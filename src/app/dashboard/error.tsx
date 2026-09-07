"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

/**
 * Scoped to `/dashboard`: a crash here shows this instead of tearing down
 * the whole app (the root `error.tsx` is the fallback for everything else).
 */
export default function DashboardError({
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
    <div className="p-4 sm:p-6">
      <ErrorState
        title="Não foi possível carregar o dashboard"
        description="Tente novamente ou volte mais tarde."
        onRetry={reset}
      />
    </div>
  );
}
