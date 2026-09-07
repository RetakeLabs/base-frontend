"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  FileQuestion,
  LayoutDashboard,
  LogIn,
  Mail,
  MoreVertical,
  PanelRight,
  Pencil,
  Search,
  ShoppingCart,
  Trash2,
  TrendingDown,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge, type BadgeColor } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Navbar } from "@/components/ui/navbar";
import { Sidebar } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { MetricCard } from "@/components/ui/metric-card";
import { DashboardChart, type ChartDatum } from "@/components/ui/dashboard-chart";
import { Carousel } from "@/components/ui/carousel";
import { Accordion } from "@/components/ui/accordion";
import { Tooltip } from "@/components/ui/tooltip";
import { Dropzone } from "@/components/ui/dropzone";
import { DatePicker } from "@/components/ui/date-picker";
import { TagInput } from "@/components/ui/tag-input";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Drawer } from "@/components/ui/drawer";
import { Stepper } from "@/components/ui/stepper";
import { UserForm } from "@/components/ui/user-form";
import { BrandingSettingsForm } from "@/components/ui/branding-settings-form";
import { useData, type TeamMember } from "@/lib/use-data";

const buttonColors = ["primary", "secondary", "success", "danger"] as const;
const buttonVariants = ["solid", "outline", "ghost"] as const;

interface Invoice {
  id: string;
  customer: string;
  amount: string;
  status: "paid" | "pending" | "overdue";
}

const invoices: Invoice[] = [
  { id: "INV-001", customer: "Ana Souza", amount: "R$ 149,00", status: "paid" },
  { id: "INV-002", customer: "Bruno Lima", amount: "R$ 89,00", status: "pending" },
  { id: "INV-003", customer: "Carla Dias", amount: "R$ 249,00", status: "paid" },
  { id: "INV-004", customer: "Diego Alves", amount: "R$ 49,00", status: "overdue" },
  { id: "INV-005", customer: "Elisa Ramos", amount: "R$ 149,00", status: "paid" },
  { id: "INV-006", customer: "Felipe Rocha", amount: "R$ 89,00", status: "pending" },
];

const statusColor: Record<Invoice["status"], "success" | "secondary" | "danger"> = {
  paid: "success",
  pending: "secondary",
  overdue: "danger",
};

const invoiceColumns: DataTableColumn<Invoice>[] = [
  { header: "Fatura", accessor: (row) => row.id },
  { header: "Cliente", accessor: (row) => row.customer },
  { header: "Valor", accessor: (row) => row.amount },
  {
    header: "Status",
    accessor: (row) => <Badge color={statusColor[row.status]}>{row.status}</Badge>,
  },
];

const chartData: ChartDatum[] = [
  { label: "Jan", value: 18400 },
  { label: "Fev", value: 21200 },
  { label: "Mar", value: 19800 },
  { label: "Abr", value: 24500 },
  { label: "Mai", value: 27100 },
  { label: "Jun", value: 32900 },
];

const carouselSlides = [
  { src: "https://picsum.photos/800/400?random=1", alt: "Imagem de demonstração 1" },
  { src: "https://picsum.photos/800/400?random=2", alt: "Imagem de demonstração 2" },
  { src: "https://picsum.photos/800/400?random=3", alt: "Imagem de demonstração 3" },
];

const faqItems = [
  {
    id: "billing",
    title: "Como funciona a cobrança?",
    content: "A cobrança é mensal, via cartão de crédito, com nota fiscal emitida automaticamente.",
  },
  {
    id: "cancel",
    title: "Posso cancelar quando quiser?",
    content: "Sim, o cancelamento é imediato e não há multa por fidelidade.",
  },
  {
    id: "support",
    title: "Qual o horário de suporte?",
    content: "Nosso time atende de segunda a sexta, das 9h às 18h (horário de Brasília).",
  },
];

const teamColumns: DataTableColumn<TeamMember>[] = [
  { header: "Nome", accessor: (row) => row.name, sortValue: (row) => row.name },
  { header: "Cargo", accessor: (row) => row.role, sortValue: (row) => row.role },
  { header: "E-mail", accessor: (row) => row.email, sortValue: (row) => row.email },
  {
    header: "Status",
    accessor: (row) => (
      <Badge color={row.status === "active" ? "success" : "secondary"}>
        {row.status === "active" ? "Ativo" : "Convidado"}
      </Badge>
    ),
    csvValue: (row) => (row.status === "active" ? "Ativo" : "Convidado"),
  },
];

const stepperSteps = ["Conta", "Perfil", "Pagamento", "Revisão"];

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  badge?: { label: string; color: BadgeColor };
}

const products: Product[] = [
  {
    id: "1",
    name: "Fone Bluetooth Pro",
    price: "R$ 349,90",
    image: "https://picsum.photos/400/300?random=21",
    badge: { label: "Novo", color: "primary" },
  },
  {
    id: "2",
    name: "Smartwatch Série X",
    price: "R$ 899,00",
    image: "https://picsum.photos/400/300?random=22",
    badge: { label: "-20%", color: "danger" },
  },
  {
    id: "3",
    name: "Câmera Instantânea",
    price: "R$ 459,00",
    image: "https://picsum.photos/400/300?random=23",
  },
  {
    id: "4",
    name: "Teclado Mecânico RGB",
    price: "R$ 529,00",
    image: "https://picsum.photos/400/300?random=24",
    badge: { label: "Mais vendido", color: "success" },
  },
  {
    id: "5",
    name: "Mochila Urbana",
    price: "R$ 279,90",
    image: "https://picsum.photos/400/300?random=25",
  },
  {
    id: "6",
    name: "Cadeira Gamer",
    price: "R$ 1.299,00",
    image: "https://picsum.photos/400/300?random=26",
  },
  {
    id: "7",
    name: 'Monitor Ultrawide 34"',
    price: "R$ 2.199,00",
    image: "https://picsum.photos/400/300?random=27",
    badge: { label: "Novo", color: "primary" },
  },
  {
    id: "8",
    name: "Caixa de Som Portátil",
    price: "R$ 199,90",
    image: "https://picsum.photos/400/300?random=28",
  },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="relative aspect-4/3 w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- generic demo, arbitrary external image URL */}
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        {product.badge && (
          <Badge color={product.badge.color} className="absolute top-2 left-2">
            {product.badge.label}
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="font-medium">{product.name}</p>
        <p className="text-lg font-semibold text-primary">{product.price}</p>
        <Button
          size="sm"
          className="w-full"
          onClick={() => toast({ title: "Adicionado ao carrinho", description: product.name })}
        >
          <ShoppingCart className="size-4" />
          Adicionar ao carrinho
        </Button>
      </div>
    </Card>
  );
}

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [currentStep, setCurrentStep] = useState(2);
  const { data: teamMembers, isLoading: teamLoading, isError: teamError, refetch: refetchTeam } = useData();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <Badge>Design System</Badge>
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">base-frontend</h1>
        <p className="max-w-2xl text-muted-foreground">
          Catálogo de componentes reutilizáveis. Toda a estilização vem de
          variáveis CSS em{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
            src/app/globals.css
          </code>
          — altere as variáveis de cor para adaptar o tema a um novo projeto.
          Use o botão no canto superior direito para alternar entre claro e
          escuro.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/login">
            <Button variant="outline">
              <LogIn className="size-4" />
              Ver tela de Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button>
              <LayoutDashboard className="size-4" />
              Ver Dashboard
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </header>

      <Tabs defaultValue="components">
        <TabsList>
          <TabsTrigger value="components">Componentes UI</TabsTrigger>
          <TabsTrigger value="marketplace">Exemplo de Aplicação Real</TabsTrigger>
        </TabsList>

        <TabsContent value="components">
          <div className="flex flex-col gap-16">
            <Section title="Menus e navegação">
              <Navbar />
              <div className="flex flex-col gap-4 sm:h-80 sm:flex-row">
                <Sidebar />
                <Card className="flex-1 items-center justify-center text-center text-muted-foreground">
                  Conteúdo principal ao lado da sidebar
                </Card>
              </div>
            </Section>

            <Section
              title="Buttons"
              description="Variações sólida, outline e ghost, para cada cor semântica."
            >
              <div className="flex flex-col gap-4">
                {buttonVariants.map((variant) => (
                  <div key={variant} className="flex flex-wrap items-center gap-3">
                    <span className="w-16 shrink-0 text-xs font-medium uppercase text-muted-foreground">
                      {variant}
                    </span>
                    {buttonColors.map((color) => (
                      <Button key={color} variant={variant} color={color}>
                        {color}
                      </Button>
                    ))}
                  </div>
                ))}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="w-16 shrink-0 text-xs font-medium uppercase text-muted-foreground">
                    estados
                  </span>
                  <Button>Normal</Button>
                  <Button isLoading>Carregando</Button>
                  <Button disabled>Desabilitado</Button>
                </div>
              </div>
            </Section>

            <Section
              title="Inputs"
              description="Campos padrão, com ícone, senha, checkbox e validação de erro."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input placeholder="Nome completo" />
                <Input
                  leftIcon={<Mail />}
                  type="email"
                  placeholder="voce@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input leftIcon={<Search />} placeholder="Buscar..." />
                <PasswordInput leftIcon={<User />} placeholder="Senha" />
                <Input
                  placeholder="Campo com erro"
                  error="Este campo é obrigatório."
                  className="sm:col-span-2"
                />
                <Checkbox
                  id="showcase-checkbox"
                  label="Aceito os termos de uso"
                  className="sm:col-span-2"
                />
              </div>
            </Section>

            <Section
              title="SaaS Ready"
              description="Dropdown, tabela de dados, tabs e skeleton loaders."
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Dropdown menu" className="items-start">
                  <DropdownMenu
                    align="left"
                    trigger={
                      <Button variant="outline" size="sm">
                        Ações
                        <MoreVertical className="size-4" />
                      </Button>
                    }
                  >
                    <DropdownMenuItem>
                      <Pencil className="size-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem destructive>
                      <Trash2 className="size-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenu>
                </Card>

                <Card title="Loading" className="items-start gap-4">
                  <LoadingSpinner label="Carregando dados..." />
                  <div className="flex w-full flex-col gap-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              </div>

              <Tabs defaultValue="table">
                <TabsList>
                  <TabsTrigger value="table">Tabela</TabsTrigger>
                  <TabsTrigger value="about">Sobre</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                  <DataTable
                    data={invoices}
                    columns={invoiceColumns}
                    keyExtractor={(row) => row.id}
                    pageSize={4}
                  />
                </TabsContent>
                <TabsContent value="about">
                  <Card className="text-sm text-muted-foreground">
                    A `DataTable` é genérica (`DataTable&lt;T&gt;`), recebe `columns`
                    com um `accessor` por coluna e pagina os dados no cliente.
                  </Card>
                </TabsContent>
              </Tabs>
            </Section>

            <Section title="Feedback" description="Cards, badges, toasts e modais.">
              <div className="grid gap-4 sm:grid-cols-3">
                <Card
                  title="Card simples"
                  description="Layout base reutilizável para qualquer conteúdo."
                >
                  <div className="flex gap-2">
                    <Badge color="primary">Novo</Badge>
                    <Badge color="success">Ativo</Badge>
                    <Badge color="danger">Urgente</Badge>
                  </div>
                </Card>
                <Card title="Toasts" description="Notificações flutuantes.">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      color="success"
                      onClick={() =>
                        toast({
                          title: "Alterações salvas",
                          description: "Tudo certo por aqui.",
                          variant: "success",
                        })
                      }
                    >
                      Sucesso
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      color="danger"
                      onClick={() =>
                        toast({
                          title: "Algo deu errado",
                          description: "Tente novamente em instantes.",
                          variant: "danger",
                        })
                      }
                    >
                      Erro
                    </Button>
                  </div>
                </Card>
                <Card title="Abrir modal" description="Diálogo com blur e animação.">
                  <Button variant="outline" onClick={() => setModalOpen(true)}>
                    Abrir modal
                  </Button>
                </Card>
              </div>
            </Section>

            <Section
              title="Advanced & Dashboard UI"
              description="Breadcrumb, métricas, gráfico, carrossel, accordion e tooltip."
            >
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Relatórios", href: "/dashboard" },
                  { label: "Detalhes" },
                ]}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard
                  title="Assinantes ativos"
                  value="1.284"
                  icon={Users}
                  trend={{ value: "+12,4%", direction: "up" }}
                />
                <MetricCard
                  title="MRR"
                  value="R$ 42.900"
                  icon={DollarSign}
                  trend={{ value: "+8,1%", direction: "up" }}
                />
                <MetricCard
                  title="Churn (30d)"
                  value="2,1%"
                  icon={TrendingDown}
                  trend={{ value: "-0,6%", direction: "down" }}
                />
              </div>

              <Card title="Receita mensal" description="Gráfico sensível ao tema (light/dark).">
                <DashboardChart data={chartData} />
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Carousel</span>
                  <Carousel slides={carouselSlides} />
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Accordion</span>
                    <Accordion items={faqItems} defaultOpenId="billing" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Tooltip</span>
                    <Tooltip content="Ação disponível apenas para admins">
                      <Button variant="outline" size="sm" className="w-fit">
                        Passe o mouse aqui
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Section>

            <Section
              title="Advanced Forms & States"
              description="Formulário validado (Zod + React Hook Form), upload de arquivos, date picker, tags e estados de vazio/erro."
            >
              <Card
                title="Novo usuário"
                description="Validação com Zod: e-mail válido, senha com no mínimo 8 caracteres e termos obrigatórios."
              >
                <UserForm />
              </Card>

              <Card
                title="Branding / White-label"
                description="Logotipo (Dropzone), nome e descrição do sistema — o preview abaixo do formulário atualiza em tempo real."
              >
                <BrandingSettingsForm />
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Upload de arquivos" className="items-stretch">
                  <Dropzone />
                </Card>

                <Card title="Date picker & Tags" className="items-stretch gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Data do evento</label>
                    <DatePicker value={selectedDate} onChange={setSelectedDate} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Tags</label>
                    <TagInput
                      defaultTags={["design-system", "ui"]}
                      placeholder="Digite e aperte Enter..."
                    />
                  </div>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <EmptyState
                  icon={FileQuestion}
                  title="Nenhum resultado encontrado"
                  description="Ajuste os filtros ou crie o primeiro item da lista."
                  actionLabel="Criar novo item"
                  onAction={() =>
                    toast({ title: "Novo item", description: "Ação de exemplo disparada." })
                  }
                />
                <ErrorState
                  onRetry={() =>
                    toast({
                      title: "Tentando novamente",
                      description: "Simulação de nova requisição.",
                      variant: "danger",
                    })
                  }
                />
              </div>
            </Section>

            <Section
              title="Advanced Data & Layouts"
              description="Data table com ordenação e ações, stepper e painel lateral (drawer)."
            >
              <Card
                title="Equipe"
                description="Dados via React Query (useData). Cabeçalho fixo, ordenação, paginação, ações e exportação CSV."
              >
                {teamLoading && (
                  <div className="flex flex-col gap-3">
                    <LoadingSpinner label="Carregando equipe..." />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                )}
                {teamError && (
                  <ErrorState
                    title="Não foi possível carregar a equipe"
                    onRetry={() => refetchTeam()}
                  />
                )}
                {teamMembers && (
                  <DataTable
                    data={teamMembers}
                    columns={teamColumns}
                    keyExtractor={(row) => row.id}
                    pageSize={5}
                    csvFilename="equipe.csv"
                    onEdit={(row) =>
                      toast({ title: "Editar membro", description: `Abrindo edição de ${row.name}.` })
                    }
                    onDelete={(row) =>
                      toast({
                        title: "Membro removido",
                        description: `${row.name} foi removido (simulação).`,
                        variant: "danger",
                      })
                    }
                  />
                )}
              </Card>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Stepper" description="Wizard de progressão em múltiplas etapas.">
                  <Stepper currentStep={currentStep} steps={stepperSteps} />
                  <div className="mt-6 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentStep === 1}
                      onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                    >
                      <ArrowLeft className="size-4" />
                      Anterior
                    </Button>
                    <Button
                      size="sm"
                      disabled={currentStep === stepperSteps.length}
                      onClick={() => setCurrentStep((s) => Math.min(stepperSteps.length, s + 1))}
                    >
                      Próxima etapa
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </Card>

                <Card title="Drawer" description="Painel lateral com slide-over animado.">
                  <Button variant="outline" onClick={() => setDrawerOpen(true)}>
                    <PanelRight className="size-4" />
                    Abrir painel lateral
                  </Button>
                </Card>
              </div>
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="marketplace">
          <div className="flex flex-col gap-6">
            <div className="relative h-64 w-full overflow-hidden rounded-lg sm:h-80">
              {/* eslint-disable-next-line @next/next/no-img-element -- generic demo, arbitrary external image URL */}
              <img
                src="https://picsum.photos/1200/400?random=99"
                alt="Banner de destaque da loja"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative flex h-full flex-col justify-end p-6 sm:p-10">
                <h2 className="max-w-lg text-2xl font-bold text-white sm:text-4xl">
                  Descubra Novos Produtos
                </h2>
                <p className="mt-2 max-w-md text-sm text-white/80 sm:text-base">
                  Ofertas selecionadas toda semana — o mesmo design system do
                  showcase, agora em um cenário de cliente final.
                </p>
                <Button className="mt-4 w-fit">Ver ofertas</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirmar ação"
      >
        <p className="text-sm text-muted-foreground">
          Esta é uma modal de exemplo, controlada por estado local e fechada
          com Escape, clique fora ou pelo botão de fechar.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" color="secondary" onClick={() => setModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="danger" onClick={() => setModalOpen(false)}>
            Confirmar
          </Button>
        </div>
      </Modal>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Detalhes do pedido">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Painel lateral que desliza a partir da borda direita — útil para
            detalhes de um registro, formulários rápidos ou filtros
            avançados, sem sair da tela atual.
          </p>
          <Card title="Pedido #1082" description="Recebido há 2 horas">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cliente</span>
              <span className="font-medium">Ana Souza</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total</span>
              <span className="font-medium">R$ 349,90</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <Badge color="secondary">Aguardando aprovação</Badge>
            </div>
          </Card>
          <Button className="w-full" onClick={() => setDrawerOpen(false)}>
            Aprovar pedido
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
