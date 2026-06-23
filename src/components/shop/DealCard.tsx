import type { Product } from "@/data/shop";

function Countdown({ values }: { values: [number, number, number, number] }) {
  const labels = ["DAYS", "HOURS", "MINS", "SECS"];
  return (
    <div className="flex gap-2">
      {values.map((v, i) => (
        <div key={i} className="flex flex-col items-center rounded-sm bg-muted px-3 py-1.5 min-w-12">
          <span className="text-lg font-bold text-navy leading-none">{v.toString().padStart(2, "0")}</span>
          <span className="mt-1 text-[9px] font-semibold tracking-wide text-muted-foreground">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export function DealCard({ product, countdown }: { product: Product; countdown: [number, number, number, number] }) {
  const soldPct = product.sold && product.stock ? Math.min(100, (product.sold / product.stock) * 100) : 0;
  return (
    <div className="flex flex-col gap-4 rounded-sm border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover sm:flex-row">
      <div className="relative shrink-0">
        {product.badge && (
          <span className="absolute right-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {product.badge.label}
          </span>
        )}
        <img src={product.image} alt={product.name} loading="lazy" width={512} height={512} className="h-48 w-48 object-contain" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3">
        <h4 className="font-display text-xl font-bold text-navy">{product.name}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="text-sm text-muted-foreground line-through">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Available: <strong className="text-navy">{product.stock}</strong></span>
            <span>Sold: <strong className="text-navy">{product.sold}</strong></span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${soldPct}%` }} />
          </div>
        </div>
        <Countdown values={countdown} />
      </div>
    </div>
  );
}
