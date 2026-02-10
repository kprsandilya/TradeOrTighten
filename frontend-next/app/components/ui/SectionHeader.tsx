export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h3>
  );
}