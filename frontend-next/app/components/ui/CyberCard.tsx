import React, { ReactNode } from "react";

interface CyberCardProps {
  title?: string;
  children: ReactNode;
  className?: string; // optional for extra styling
}

const CyberCard = ({ title, children, className = "" }: CyberCardProps) => {
  return (
    <div className={`rounded-lg bg-panel p-5 neon-border ${className}`}>
      {title && (
        <h3 className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow mb-4">
          {title}
        </h3>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default CyberCard;
