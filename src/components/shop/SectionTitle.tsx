import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionTitle({ title, right, withNav = true }: { title: string; right?: ReactNode; withNav?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
      <h3 className="rounded-sm bg-navy px-4 py-2 text-sm font-bold uppercase tracking-wide text-navy-foreground">
        {title}
      </h3>
      <div className="flex items-center gap-4">
        {right}
        {withNav && (
          <div className="flex items-center gap-1">
            <button className="grid h-7 w-7 place-items-center rounded-sm border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="grid h-7 w-7 place-items-center rounded-sm border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
