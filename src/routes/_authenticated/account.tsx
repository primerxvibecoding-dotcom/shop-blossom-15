import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyRoles } from "@/lib/admin.functions";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "My Account — Stellar Cart" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getRolesFn = useServerFn(getMyRoles);
  const { data: roles } = useQuery({ queryKey: ["roles"], queryFn: () => getRolesFn() });
  const isAdmin = (roles ?? []).some((r) => ["super_admin", "admin", "manager"].includes(r));

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My account</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-6">
            <h2 className="font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground mt-2">Email: {user?.email}</p>
            <p className="text-sm text-muted-foreground">Roles: {(roles ?? []).join(", ") || "customer"}</p>
            <Button variant="outline" className="mt-4" onClick={signOut}>Sign out</Button>
          </div>
          <div className="rounded-md border border-border bg-card p-6 space-y-2">
            <h2 className="font-semibold">Quick links</h2>
            <Link to="/account/orders" className="block text-primary hover:underline">My orders</Link>
            {isAdmin && <Link to="/admin" className="block text-primary hover:underline">Admin dashboard</Link>}
            <Link to="/catalog" className="block text-primary hover:underline">Continue shopping</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
