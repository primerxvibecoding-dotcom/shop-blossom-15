import { Heart, RefreshCw, ShoppingCart, Eye, Star } from "lucide-react";
import type { Product } from "@/data/shop";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col rounded-sm border border-border bg-card shadow-card transition-all hover:shadow-card-hover hover:border-primary/30">
      {product.badge && (
        <span
          className={`absolute left-2 top-2 z-10 grid h-10 w-10 place-items-center rounded-full text-[10px] font-bold uppercase ${
            product.badge.tone === "new"
              ? "bg-success text-white"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {product.badge.label}
        </span>
      )}

      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={512}
          height={512}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-1.5 bg-background/95 py-2 transition-transform duration-300 group-hover:translate-y-0">
          {[Heart, RefreshCw, Eye, ShoppingCart].map((Icon, i) => (
            <button
              key={i}
              className="grid h-8 w-8 place-items-center rounded-full bg-muted text-foreground/70 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1 border-t border-border p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
        <p className="truncate text-sm text-foreground/85">{product.name}</p>
        <div className="flex items-center justify-center gap-0.5 text-warning">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-current opacity-40" />
          ))}
        </div>
      </div>
    </div>
  );
}
