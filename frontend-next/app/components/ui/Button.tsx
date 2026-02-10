import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "danger";

export function Button({
  children,
  onClick,
  variant = "secondary",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
}) {
  const styles = {
    primary: "bg-primary/10 text-primary neon-border hover:bg-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/70",
    danger: "bg-destructive/10 text-destructive accent-border hover:bg-destructive/20",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors",
        styles[variant]
      )}
    >
      {children}
    </button>
  );
}
