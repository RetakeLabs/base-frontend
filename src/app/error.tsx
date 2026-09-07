"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

/**
 * Root error boundary — catches anything thrown during render in this
 * segment's tree. Must be a Client Component (Next.js requirement: an
 * error boundary needs `componentDidCatch`-equivalent behavior, which only
 * exists client-side). Route segments can override this with their own
 * `error.tsx` for a narrower boundary (see `dashboard/error.tsx`).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <ErrorState
        title="Algo deu errado"
        description="Um erro inesperado interrompeu esta página."
        onRetry={reset}
        className="w-full max-w-md"
      />
    </div>
  );
}
