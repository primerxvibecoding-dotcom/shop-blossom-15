import { Star } from "lucide-react";
import type { Product } from "@/data/shop";

export function MiniProduct({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="h-16 w-16 shrink-0 rounded-sm bg-muted/40 p-1">
        <img src={product.image} alt={product.name} loading="lazy" width={128} height={128} className="h-full w-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-foreground/85">{product.name}</p>
        <div className="mt-0.5 flex items-center gap-0.5 text-warning">
          {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current opacity-40" />)}
        </div>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.oldPrice && <span className="text-xs text-muted-foreground line-through">${product.oldPrice.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}
