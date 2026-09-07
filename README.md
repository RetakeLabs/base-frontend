# base-frontend

Boilerplate fundacional para novos projetos: Next.js (App Router) + React + TypeScript estrito + Tailwind CSS v4 + Lucide React. A página inicial (`/`) é um **showcase** de todos os componentes de UI disponíveis, com exemplos de tela de **Login** (`/login`) e de **Dashboard** (`/dashboard`).

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript** em modo estrito
- **Tailwind CSS v4** — configuração 100% via CSS (`@theme`), sem `tailwind.config.ts` (esse arquivo foi descontinuado como forma principal de configuração na v4)
- **Lucide React** para ícones
- **next-themes** para o dark/light mode (estratégia por classe `.dark`)
- **Recharts** para gráficos (tema via CSS variables — ver `DashboardChart`)
- **Embla Carousel** para o `Carousel`
- **React Hook Form** + **Zod** (`@hookform/resolvers/zod`) para formulários validados
- **TanStack Query** para cache/estado de servidor
- **Sonner** para toasts globais (por trás do `toast()` já existente — ver abaixo)
- `clsx` + `tailwind-merge` (utilitário `cn`) para composição segura de classes
- **Vitest** + **React Testing Library** para testes unitários/componente (ver "Testes" abaixo)
- **GitHub Actions** rodando lint + typecheck + testes + build em todo push/PR (`.github/workflows/ci.yml`)

## Estrutura de pastas

```
src/
  app/
    layout.tsx        # Root layout, ThemeProvider, Toaster, fontes, metadata
    page.tsx           # Showcase — catálogo dos componentes ("use client": página inteira é demo interativa)
    error.tsx           # Error boundary raiz (Client Component — exigência do Next)
    not-found.tsx        # 404 raiz — Server Component (conteúdo estático, sem JS extra)
    globals.css        # Tema: variáveis CSS (light + .dark) + bridge para o Tailwind
    login/page.tsx      # Tela de login (form + validação visual + toast)
    dashboard/
      page.tsx             # Server Component: busca os dados no servidor (getDashboardData) e monta a página
      customers-panel.tsx  # Client island: tabela de clientes (sort/CSV/toast) — só essa parte precisa de JS
      error.tsx             # Error boundary da rota /dashboard
      loading.tsx           # Suspense fallback automático enquanto o Server Component busca dados
  components/
    ui/                 # Componentes de interface, sem lógica de negócio
      button.tsx
      input.tsx          # Input, PasswordInput
      checkbox.tsx
      card.tsx
      badge.tsx
      modal.tsx           # Dialog com backdrop-blur + fade/scale
      toast.tsx           # toast() + <Toaster /> (notificações flutuantes)
      spinner.tsx         # LoadingSpinner
      skeleton.tsx        # Skeleton loader (animate-pulse)
      dropdown-menu.tsx   # DropdownMenu, DropdownMenuItem
      data-table.tsx      # DataTable<T> genérica, com paginação
      tabs.tsx            # Tabs, TabsList, TabsTrigger, TabsContent
      theme-toggle.tsx    # Botão Sol/Lua para alternar o tema
      navbar.tsx
      sidebar.tsx           # variant="card" (demo) | "panel" (dentro do DashboardLayout); collapsed controlável
      brand.tsx             # Logo + COMPANY_NAME — topo do Sidebar e, quando preciso, do Header
      breadcrumb.tsx
      metric-card.tsx       # Card de KPI (valor, ícone, variação %)
      dashboard-chart.tsx   # Gráfico de área (recharts) sensível ao tema
      carousel.tsx          # Carrossel (embla-carousel-react)
      accordion.tsx
      tooltip.tsx           # Balão on hover/focus, 100% CSS (group-hover)
      dropzone.tsx          # Drag & drop de arquivos, com preview de imagem (max-h-40, object-contain)
      date-picker.tsx       # Calendário popover, sem dependência externa
      tag-input.tsx         # Tags via Enter/vírgula, com remoção
      empty-state.tsx
      error-state.tsx
      drawer.tsx            # Painel lateral (slide-over) — side="left"|"right", w-full no mobile
      stepper.tsx           # Wizard de progressão em etapas
      notifications.tsx     # Sino + badge + popover (composto sobre o DropdownMenu)
      user-form.tsx         # Exemplo de formulário: react-hook-form + zodResolver
      textarea.tsx          # Mesmo design system do Input (borda, focus ring, dark mode)
      branding-settings-form.tsx # Logo (Dropzone) + Nome + Descrição, com preview de header ao vivo
    layout/
      DashboardLayout.tsx # Sidebar (drawer no mobile) + Header (perfil, tema, notificações) + breadcrumb
    theme-provider.tsx    # Wrapper client do ThemeProvider (next-themes)
    query-provider.tsx    # Wrapper client do QueryClientProvider (TanStack Query)
  lib/
    utils.ts             # cn() — merge de classes Tailwind
    env.ts                 # process.env validado com Zod — falha no boot, não dentro de um fetch()
    api.ts                # Client HTTP base — ponto único de injeção do Bearer token
    dashboard-data.ts       # getDashboardData() — fetch server-only consumido por dashboard/page.tsx
    use-presence.ts       # hook de entrada/saída animada (Modal, Toast, Dropdown, DatePicker, Drawer)
    use-has-mounted.ts    # hook para evitar mismatch de hidratação (SSR-safe)
    use-object-url.ts      # useObjectUrl(file) — preview de imagem com createObjectURL + revoke automático
    use-data.ts            # useQuery de exemplo (useData) — troque o mock por api.get(...)
    export-csv.ts          # exportToCsv() usado pelo botão "Exportar CSV" da DataTable
  proxy.ts                 # Proteção de rota (ver seção "Autenticação" abaixo)
vitest.config.mts           # Config do Vitest (jsdom + tsconfig paths)
.github/workflows/ci.yml    # lint + typecheck + testes + build em todo push/PR
```

Quando adicionar uma feature com lógica de negócio (chamadas de API, hooks de domínio, etc.), crie pastas irmãs de `components/ui`, por exemplo `src/features/<nome>` ou `src/services`, mantendo `components/ui` livre de qualquer regra de negócio.

Todo componente em `components/ui` é independente e exporta uma interface de props própria estendendo o tipo HTML nativo correspondente (ex. `ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`). `"use client"` é declarado **só** quando o componente de fato precisa: hook de estado/efeito, evento (`onClick`/`onChange`), API de browser, ou uma lib client-only (recharts, sonner). Componentes puramente visuais (`Card`, `Badge`, `MetricCard`, `Brand`, `Breadcrumb`, `Stepper`, `Tooltip`, `Skeleton`, `LoadingSpinner`) não têm a diretiva — funcionam tanto renderizados no servidor quanto importados por uma árvore client, sem custo de bundle extra no primeiro caso.

## Server vs. Client Components

O App Router só compensa se a maior parte da árvore for Server Component — é isso que corta o JS enviado ao browser e permite `fetch` direto no servidor, sem cliente de cache nem loading state pra dado inicial. A regra desta base:

- **Página busca dado, ilha interage.** `src/app/dashboard/page.tsx` é `async` e Server Component: chama `getDashboardData()` (`src/lib/dashboard-data.ts`) direto, sem `useQuery`/`useEffect`, e passa o resultado como prop pros filhos. Só o pedaço que precisa de JS no browser — `DashboardCustomersPanel` (sort, exportar CSV, toast ao editar/excluir) e `DashboardChart` (recharts) — é `"use client"`; o resto (`DashboardLayout` por fora, `MetricCard`/`Card` por dentro) não manda bundle extra.
- **Função não atravessa a fronteira Server → Client.** Um Server Component não pode passar uma referência de função (incluindo um ícone do `lucide-react`, que é um componente `forwardRef`) como prop pra um Client Component — só dado serializável. Por isso `src/app/not-found.tsx` é Server Component "de verdade" (markup próprio, sem usar o `EmptyState` client) em vez de repassar `icon={FileQuestion}` pra um componente client.
- **`error.tsx` é sempre Client Component** — exigência do Next: error boundary usa o equivalente de `componentDidCatch`, que só existe no cliente. `not-found.tsx` não tem essa exigência e fica Server sempre que o conteúdo é estático.
- **TanStack Query é para depois da carga inicial** — refetch, mutação, invalidação de cache após uma ação do usuário (`useData`, em `src/lib/use-data.ts`, é esse caso: dado que o usuário pode re-disparar). Dado que a página só precisa mostrar ao abrir vai direto num Server Component, sem passar por `useQuery`.

Ao adicionar uma rota nova, comece sem `"use client"` na página; só desça a diretiva pro componente-filho específico que realmente precisa de interatividade.

## Sistema de temas (Light/Dark)

O tema é controlado pelo `next-themes` (`src/components/theme-provider.tsx`, montado em `layout.tsx` com `attribute="class"`), que adiciona/remove a classe `.dark` na tag `<html>`. O botão `ThemeToggle` (`src/components/ui/theme-toggle.tsx`) alterna entre os modos com uma animação de rotação Sol/Lua.

Toda a paleta de cores vive em **duas seções** de `src/app/globals.css`:

1. `:root { ... }` — os valores reais das cores (modo claro).
2. `.dark { ... }` — os mesmos tokens, sobrescritos para o modo escuro (aplicado via classe, não `prefers-color-scheme`).

Uma diretiva `@custom-variant dark (&:where(.dark, .dark *));` no topo do arquivo é o que faz o Tailwind v4 gerar as classes `dark:*` a partir da classe `.dark`, em vez do padrão (`prefers-color-scheme`) — isso é o que permite o `next-themes` controlar o tema manualmente.

Um terceiro bloco, `@theme inline`, apenas liga essas variáveis às classes utilitárias do Tailwind (`bg-primary`, `text-danger-foreground`, `border-border`, etc.) e **não deve precisar ser editado** ao trocar de tema.

Tokens disponíveis: `background`, `foreground`, `card`, `card-foreground`, `border`, `input`, `ring`, `muted`, `muted-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `success`, `success-foreground`, `danger`, `danger-foreground`.

## Layout do Dashboard

`DashboardLayout` é uma coluna (`flex h-screen flex-col overflow-hidden`): primeiro um `header` **de ponta a ponta** (`w-full`, `sticky top-0`, acima de tudo — inclusive da sidebar), depois uma linha (`flex flex-1 overflow-hidden`) com a `Sidebar` (`variant="panel"`) e o `<main>` rolável lado a lado. Como o header é irmão dessa linha (não filho dela), recolher/expandir a `Sidebar` só redimensiona a linha de baixo — o header nunca se move ou é afetado. Passe `breadcrumbs` para renderizar a trilha de navegação no topo do conteúdo:

```tsx
<DashboardLayout title="Visão geral" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Visão geral" }]}>
  ...
</DashboardLayout>
```

### Branding (logo + nome da empresa)

`Brand` (`src/components/ui/brand.tsx`) exporta `COMPANY_NAME` (`"ZeroLag"`) e o mark (ícone + nome). Ele vive **só no header** do `DashboardLayout` — sempre visível, em qualquer largura de tela ou estado da sidebar (`hamburguer` + `Brand` + separador + `title` da página). A `Sidebar` não mostra mais marca nenhuma; no topo dela sobrou só o botão de recolher/expandir, para não duplicar a identidade nem depender do estado dela.

Para usar a marca de verdade salva em `BrandingSettingsForm`, troque `COMPANY_NAME`/o ícone fixo em `brand.tsx` pelos valores vindos da sua API/estado global.

### DataTable

`DataTable<T>` (`src/components/ui/data-table.tsx`) suporta cabeçalho fixo (`sticky`), ordenação, scroll horizontal no mobile (`overflow-x-auto`), uma coluna de ações automática e exportação CSV:

- Ordenação: adicione `sortValue: (row) => string | number` numa coluna para torná-la ordenável (aparece a seta e o clique alterna asc/desc). Colunas sem `sortValue` não são ordenáveis.
- Ações: passe `onEdit` e/ou `onDelete` e uma coluna "Ações" com um `DropdownMenu` (Editar/Excluir) é anexada automaticamente — não precisa declarar essa coluna manualmente.
- CSV: passe `csvFilename="algo.csv"` para mostrar o botão "Exportar CSV" (some se a prop for omitida). Para colunas cujo `accessor` retorna JSX (ex. um `Badge`), adicione `csvValue: (row) => "texto simples"` — sem isso a célula exporta vazia. A exportação usa `sortedData` (respeita a ordenação atual, ignora a paginação — sempre exporta tudo).

### Formulários (Zod + React Hook Form)

`UserForm` (`src/components/ui/user-form.tsx`) é o exemplo de referência: um `z.object({...})` define as regras, `zodResolver` conecta ao `useForm`, e `register("campo")` é espalhado direto nos componentes base (`Input`, `PasswordInput`, `Checkbox`) — eles já usam `forwardRef`, então não precisa de adaptador. Erros aparecem via `error={errors.campo?.message}` (borda e texto em vermelho, já embutido no `Input`/`Textarea`).

`BrandingSettingsForm` (`src/components/ui/branding-settings-form.tsx`) mostra o mesmo padrão para um campo que **não** é um valor simples: o logotipo é um `File[]`, então é ligado via `Controller` (não `register`) ao `Dropzone`. Usa `useWatch` (não `watch()`) para reagir aos campos sem o aviso do React Compiler sobre funções não memoizáveis, e `useObjectUrl` (`src/lib/use-object-url.ts`) para a pré-visualização da imagem — um hook pequeno que empacota `URL.createObjectURL`/`revokeObjectURL` como `useMemo` + cleanup, evitando o padrão "setState direto dentro de efeito" que o linter rejeita.

### Cache de dados (TanStack Query)

`QueryProvider` (`src/components/query-provider.tsx`) é montado uma vez em `layout.tsx`. `useData` (`src/lib/use-data.ts`) é o hook de exemplo — troque o `fetchTeamMembers` mockado por uma chamada real via `api.get(...)` (`src/lib/api.ts`); a assinatura do `useQuery` não muda. A tabela "Equipe" do showcase já consome esse hook e trata `isLoading`/`isError` (skeletons e `ErrorState` com retry).

### DropdownMenu

Portalizado para `document.body` e posicionado via `getBoundingClientRect` (não com CSS `position: relative/absolute` dentro da árvore) — por isso nunca é cortado por um ancestral com `overflow-hidden`/`overflow-auto` (como o `<main>` rolável do `DashboardLayout` ou o corpo com scroll do `DataTable`). `NotificationsMenu` é só um `DropdownMenu` com um trigger de sino e conteúdo customizado — reaproveite esse padrão para popovers parecidos.

### Toasts (Sonner)

`toast({ title, description, variant })` (`src/components/ui/toast.tsx`) é um adaptador fino sobre o `sonner` — a mesma API de sempre, agora rodando em cima do Sonner por baixo, temizado via `unstyled` + `classNames` para usar `bg-card`/`border-border`/etc. em vez da paleta padrão do Sonner. `variant: "success" | "danger" | "default"` mapeia para `toast.success/error/toast()`. `<Toaster />` fica montado em `layout.tsx`.

## Responsividade (mobile-first)

- **DashboardLayout**: a `Sidebar` estática só aparece em `lg:` pra cima (`hidden lg:block`). Abaixo disso, um ícone de menu (`lg:hidden`) abre a mesma navegação dentro de um `Drawer` (`side="left"`) — veja `mobileNavOpen` em `DashboardLayout.tsx`. `Sidebar` aceita `onNavigate` para fechar esse drawer ao clicar num item.
- **Modal**: `h-full w-full` sem `rounded`/`border` até `sm:`; a partir daí volta a ser um card centralizado (`sm:h-auto sm:max-w-md sm:rounded-lg sm:border`).
- **Drawer**: já é `h-full` por natureza (slide-over); a largura é `w-full` até `sm:`, onde passa a ser `sm:max-w-md`.
- **Grids**: `grid` sem `grid-cols-*` já empilha em 1 coluna por padrão — os breakpoints (`sm:grid-cols-2`, `lg:grid-cols-4`, etc.) só entram a partir daí. Siga esse padrão em qualquer grid novo.
- **`w-full` por padrão**: `Input`, `Textarea`, `Accordion`, `Dropzone` e o trigger do `DatePicker` sempre ocupam 100% do contêiner pai (sem largura fixa tipo `w-56`) — só popovers/paineis flutuantes (`DropdownMenu`, `NotificationsMenu`, o calendário do `DatePicker`) mantêm largura própria, porque não devem esticar até o tamanho do contêiner que os abriu.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e ajuste `NEXT_PUBLIC_API_URL`. A leitura passa por `src/lib/env.ts`, que valida `process.env` com Zod **no momento em que o módulo é importado**: uma env faltando ou mal formada derruba o boot com uma mensagem clara, em vez de quebrar silenciosamente dentro de um `fetch()` no meio de uma request. `src/lib/api.ts` importa `env` de lá — para adicionar uma nova variável, acrescente-a ao `envSchema` em `env.ts` e leia via `env.NOME_DA_VAR`, nunca `process.env` direto no resto do código.

## Testes

Vitest + React Testing Library, configurados em `vitest.config.mts` (jsdom + resolução de `@/*`). Cobrem hooks/utils puros (`src/lib/utils.test.ts`) e componentes síncronos (`src/components/ui/badge.test.tsx`) — Server Components `async` (como `dashboard/page.tsx`) não são testáveis por unit test hoje (limitação do próprio Vitest/RSC); cubra esses com E2E se precisar.

```bash
npm run test      # watch mode, para desenvolvimento
npm run test:ci    # roda uma vez e sai — usado no CI
```

## CI

`.github/workflows/ci.yml` roda em todo push/PR: `lint` → `typecheck` → `test:ci` → `build`, nessa ordem, falhando rápido no passo mais barato primeiro.

## Autenticação e proteção de rotas

O Next.js 16 renomeou `middleware.ts` para **`proxy.ts`** (mesmo mecanismo, arquivo/export renomeados — veja o changelog do Next). Por isso a proteção de rota está em [`src/proxy.ts`](src/proxy.ts), não em `middleware.ts`.

A verificação é **otimista**: só confere se o cookie `auth-token` existe (proxy roda em toda navegação, inclusive prefetches, então precisa ser barato — nada de bater no banco aqui). `config.matcher` restringe isso a `/dashboard/:path*`.

Fluxo de demonstração já ligado ponta a ponta:

1. Visitar `/dashboard` sem o cookie → `proxy.ts` redireciona para `/login?from=/dashboard`.
2. `src/app/login/page.tsx` grava `document.cookie = "auth-token=..."` ao "logar" e volta para a rota original (`from`).
3. "Sair" no menu de perfil (`DashboardLayout`) limpa o cookie e manda para `/login`.

Para trocar pelo JWT real: assine o cookie no servidor (rota de API, Server Action, ou uma lib como Auth.js) em vez de escrevê-lo no cliente, e troque a checagem de existência em `proxy.ts` por uma verificação de assinatura/expiração (ex. `jose`'s `jwtVerify`, que roda no Edge runtime). Mantenha essa verificação otimista — qualquer checagem que precise do banco deve ficar na página/layout ou numa Server Action.

## Consumindo uma API real

`src/lib/api.ts` expõe um client HTTP fino (`api.get/post/put/patch/delete`) sobre `fetch`. Ele não guarda o token — você lê de onde quer que fique sua sessão e passa em cada chamada:

```ts
const token = getSessionToken(); // cookie, next-auth, contexto, etc.
const me = await api.get<User>("/me", { token });
```

O `Authorization: Bearer <token>` é injetado dentro de `request()`, no arquivo — é o único lugar a mudar se o backend usar outro esquema de auth.

### Como pedir para reaproveitar esta base em um novo projeto

Copie a pasta do projeto (ou use como template) e diga algo como:

> "Use minha base `base-frontend` como ponto de partida. Troque as cores do tema para `primary: #0ea5e9`, `success: #22c55e`, `danger: #ef4444` (edite tanto o bloco `:root` quanto o `.dark` em `globals.css`) e mantenha o resto da estrutura (`components/ui`, `cn`, showcase em `page.tsx`) exatamente como está."

Ou, para pedir uma nova tela reutilizando os componentes:

> "Crie uma página de cadastro usando `Input`, `PasswordInput`, `Checkbox` e `Button` de `src/components/ui`, dentro do `DashboardLayout`, seguindo o mesmo padrão visual do showcase."

Isso é suficiente para eu (Claude) saber exatamente onde estão as variáveis de cor, qual é o padrão de props dos componentes e onde adicionar novas telas.

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test        # watch mode
npm run test:ci      # roda uma vez (CI)
```
