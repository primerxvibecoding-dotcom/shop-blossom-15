import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart.functions";
import { placeOrder } from "@/lib/orders.functions";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Stellar Cart" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const getCartFn = useServerFn(getCart);
  const placeFn = useServerFn(placeOrder);
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/checkout" } });
  }, [loading, user, navigate]);

  const { data } = useQuery({ queryKey: ["cart"], queryFn: () => getCartFn(), enabled: !!user });
  const items = data?.items ?? [];
  const subtotal = items.reduce((s: number, i: any) => s + Number(i.unit_price) * i.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 9.9;

  const [form, setForm] = useState({
    full_name: "",
    email: user?.email ?? "",
    phone: "",
    line1: "",
    city: "",
    postal_code: "",
    country: "France",
  });
  useEffect(() => {
    if (user?.email && !form.email) setForm((f) => ({ ...f, email: user.email! }));
  }, [user]);

  const placeMut = useMutation({
    mutationFn: () => placeFn({ data: { shipping: form } }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`Order placed: ${res.orderNumber}`);
      navigate({ to: "/account/orders" });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            placeMut.mutate();
          }}
          className="grid gap-6 lg:grid-cols-[1fr_360px]"
        >
          <div className="rounded-md border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold">Shipping address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["full_name", "email", "phone", "line1", "city", "postal_code", "country"] as const).map((field) => (
                <div key={field} className={field === "line1" ? "sm:col-span-2" : ""}>
                  <Label className="capitalize">{field.replace("_", " ")}</Label>
                  <Input
                    value={(form as any)[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required={field !== "phone"}
                  />
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-md border border-border bg-card p-6 h-fit space-y-3 text-sm">
            <h2 className="font-semibold">Order summary</h2>
            {items.map((i: any) => (
              <div key={i.id} className="flex justify-between text-xs">
                <span className="truncate pr-2">
                  {i.products?.name} × {i.quantity}
                </span>
                <span>${(Number(i.unit_price) * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary">${(subtotal + shipping).toFixed(2)}</span>
            </div>
            <Button type="submit" className="w-full" disabled={placeMut.isPending || items.length === 0}>
              {placeMut.isPending ? "Placing order…" : "Place order"}
            </Button>
            <p className="text-xs text-muted-foreground">Demo checkout — no real payment is processed.</p>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
}
