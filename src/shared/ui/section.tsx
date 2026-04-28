import type { ReactNode } from "react";

type SectionProps = {
  className?: string;
  children: ReactNode;
};

const sectionStyles = "rounded-xl border border-forest-100/10 bg-forest-950/60";

export function Section({ className, children }: SectionProps) {
  return <section className={`${sectionStyles} ${className ?? ""}`}>{children}</section>;
}
