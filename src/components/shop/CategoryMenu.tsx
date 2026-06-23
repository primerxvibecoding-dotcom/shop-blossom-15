import { Gift, Smartphone, Shirt, ShoppingBag, Cpu, Bath, Sparkles, Lamp, Hammer, BedDouble, ChevronRight } from "lucide-react";
import { categories } from "@/data/shop";

const iconMap: Record<string, any> = { Gift, Smartphone, Shirt, ShoppingBag, Cpu, Bath, Sparkles, Lamp, Hammer, BedDouble };

export function CategoryMenu() {
  return (
    <aside className="rounded-sm border border-border bg-card shadow-card">
      <ul className="divide-y divide-border">
        {categories.map((c) => {
          const Icon = iconMap[c.icon];
          return (
            <li key={c.name}>
              <a
                href="#"
                className="group flex items-center gap-3 px-4 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-primary"
              >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                <span className="flex-1">{c.name}</span>
                <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-primary" />
              </a>
            </li>
          );
        })}
        <li>
          <a href="#" className="block px-4 py-2.5 text-sm font-semibold text-primary hover:bg-muted">
            More Categories
          </a>
        </li>
      </ul>
    </aside>
  );
}
