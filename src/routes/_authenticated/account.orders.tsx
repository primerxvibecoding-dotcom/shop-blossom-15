import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listMyOrders } from "@/lib/orders.functions";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/account/orders")({
  head: () => ({ meta: [{ title: "My Orders — Stellar Cart" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const fn = useServerFn(listMyOrders);
  const { data, isLoading } = useQuery({ queryKey: ["my-orders"], queryFn: () => fn() });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My orders</h1>
        {isLoading ? (
          <p>Loading…</p>
        ) : !data || data.length === 0 ? (
          <p className="text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {data.map((o: any) => (
              <div key={o.id} className="rounded-md border border-border bg-card p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold">{o.order_number}</p>
                    <p className="text-xs text-muted-foreground">{new Date(o.placed_at).toLocaleString()}</p>
                  </div>
                  <Badge variant="secondary">{o.status}</Badge>
                  <p className="font-bold text-primary">${Number(o.grand_total).toFixed(2)}</p>
                </div>
                <div className="mt-3 border-t border-border pt-3 space-y-1 text-sm">
                  {(o.order_items ?? []).map((it: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span>{it.name} × {it.quantity}</span>
                      <span>${Number(it.total).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
