import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpinnerSize = "sm" | "md" | "lg";

export interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

export function LoadingSpinner({ size = "md", className, label }: LoadingSpinnerProps) {
  return (
    <div className="inline-flex items-center gap-2 text-muted-foreground">
      <Loader2 className={cn("animate-spin", sizeStyles[size], className)} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
