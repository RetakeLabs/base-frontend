import { Skeleton } from "@/components/ui/skeleton";

/**
 * Automatic Suspense fallback for `/dashboard` while the Server Component
 * awaits its data — Next.js wraps the route in `<Suspense fallback={this}>`
 * for you, no boilerplate needed at the call site.
 */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
