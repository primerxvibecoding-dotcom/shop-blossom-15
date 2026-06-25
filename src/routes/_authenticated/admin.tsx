import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { getMyRoles } from "@/lib/admin.functions";
import { LayoutDashboard, Package, FolderTree, ShoppingBag, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Stellar Cart" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const getRolesFn = useServerFn(getMyRoles);
  const navigate = useNavigate();
  const { data: roles, isLoading } = useQuery({ queryKey: ["roles"], queryFn: () => getRolesFn() });
  const allowed = (roles ?? []).some((r) => ["super_admin", "admin", "manager"].includes(r));

  useEffect(() => {
    if (!isLoading && !allowed) navigate({ to: "/" });
  }, [isLoading, allowed, navigate]);

  if (isLoading) return <div className="p-8">Loading…</div>;
  if (!allowed) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <aside className="w-60 min-h-screen bg-navy text-navy-foreground p-4 sticky top-0">
          <Link to="/" className="text-xl font-bold block mb-1">
            Stellar<span className="text-primary">Cart</span>
          </Link>
          <p className="text-xs opacity-70 mb-6">Admin Panel</p>
          <nav className="space-y-1 text-sm">
            <NavItem to="/admin" exact icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/admin/products" icon={Package} label="Products" />
            <NavItem to="/admin/categories" icon={FolderTree} label="Categories" />
            <NavItem to="/admin/orders" icon={ShoppingBag} label="Orders" />
            <Link to="/" className="flex items-center gap-2 mt-6 px-3 py-2 rounded hover:bg-white/10 text-xs opacity-70">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to shop
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavItem({ to, exact, icon: Icon, label }: any) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      activeProps={{ className: "flex items-center gap-2 px-3 py-2 rounded bg-primary text-primary-foreground font-semibold" }}
      inactiveProps={{ className: "flex items-center gap-2 px-3 py-2 rounded hover:bg-white/10" }}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
