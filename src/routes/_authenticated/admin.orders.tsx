import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;

function AdminOrders() {
  const qc = useQueryClient();
  const listFn = useServerFn(adminListOrders);
  const updFn = useServerFn(adminUpdateOrderStatus);
  const { data } = useQuery({ queryKey: ["admin-orders"], queryFn: () => listFn() });

  const updMut = useMutation({
    mutationFn: (v: { id: string; status: typeof STATUSES[number] }) => updFn({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Status updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Date</th>
              <th className="p-3">Items</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o: any) => (
              <tr key={o.id} className="border-t border-border">
                <td className="p-3 font-medium">{o.order_number}</td>
                <td className="p-3 text-muted-foreground">{new Date(o.placed_at).toLocaleDateString()}</td>
                <td className="p-3 text-xs">{(o.order_items ?? []).map((it: any) => `${it.name}×${it.quantity}`).join(", ")}</td>
                <td className="p-3 text-xs text-muted-foreground">{o.shipping_address?.full_name ?? "—"}</td>
                <td className="p-3 font-bold text-primary">${Number(o.grand_total).toFixed(2)}</td>
                <td className="p-3">
                  <select
                    className="h-8 rounded border border-input bg-background px-2 text-xs"
                    value={o.status}
                    onChange={(e) => updMut.mutate({ id: o.id, status: e.target.value as any })}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
