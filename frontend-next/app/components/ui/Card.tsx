import { cn } from "../../lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-card p-5 neon-border",
        className
      )}
    >
      {children}
    </div>
  );
}
