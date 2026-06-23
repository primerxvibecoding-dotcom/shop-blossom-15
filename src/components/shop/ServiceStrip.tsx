import { Truck, ShieldCheck, Gift } from "lucide-react";

const items = [
  { Icon: Truck, title: "FREE DELIVERY", text: "On order over $49.86" },
  { Icon: ShieldCheck, title: "ORDER PROTECTION", text: "secured information" },
  { Icon: Gift, title: "PROMOTION GIFT", text: "special offers!" },
];

export function ServiceStrip() {
  return (
    <div className="rounded-sm border border-border bg-card divide-y divide-border">
      {items.map(({ Icon, title, text }) => (
        <div key={title} className="flex items-center gap-3 px-4 py-3">
          <Icon className="h-7 w-7 text-primary" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-navy uppercase tracking-wide">{title}</p>
            <p className="text-xs text-muted-foreground">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
