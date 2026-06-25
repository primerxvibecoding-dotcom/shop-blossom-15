import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { adminDashboardStats } from "@/lib/admin.functions";
import { Package, ShoppingBag, Users, DollarSign } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const fn = useServerFn(adminDashboardStats);
  const { data } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fn() });

  const stats = [
    { label: "Revenue", value: `$${(data?.revenue ?? 0).toFixed(2)}`, icon: DollarSign, tone: "text-success" },
    { label: "Orders", value: data?.orders ?? 0, icon: ShoppingBag, tone: "text-primary" },
    { label: "Products", value: data?.products ?? 0, icon: Package, tone: "text-warning" },
    { label: "Customers", value: data?.users ?? 0, icon: Users, tone: "text-navy" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className={`h-5 w-5 ${s.tone}`} />
            </div>
            <p className="mt-3 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
