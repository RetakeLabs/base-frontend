import { FileQuestion } from "lucide-react";

/**
 * Server Component on purpose: static content, no interactivity. Next.js
 * renders the root `not-found` boundary server-side as part of every
 * route's tree (not just when actually triggered), so this stays a plain
 * Server Component rather than reaching for the (Client Component)
 * `EmptyState` — passing a Lucide icon into a Client Component from that
 * boundary trips "functions can't cross the RSC boundary" in dev.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <FileQuestion className="size-6" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-medium">Página não encontrada</p>
          <p className="text-sm text-muted-foreground">
            O endereço acessado não existe ou foi movido.
          </p>
        </div>
      </div>
    </div>
  );
}
