import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { getCart, updateCartItem, removeCartItem } from "@/lib/cart.functions";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { Trash2, Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — Stellar Cart" }] }),
  component: CartPage,
});

function CartPage() {
  const { user, loading } = useSession();
  const navigate = useNavigate();
  const getCartFn = useServerFn(getCart);
  const updateFn = useServerFn(updateCartItem);
  const removeFn = useServerFn(removeCartItem);
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/cart" } });
  }, [loading, user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCartFn(),
    enabled: !!user,
  });

  const upMut = useMutation({
    mutationFn: (v: { itemId: string; quantity: number }) => updateFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });
  const rmMut = useMutation({
    mutationFn: (itemId: string) => removeFn({ data: { itemId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  });

  const items = data?.items ?? [];
  const subtotal = items.reduce((s: number, i: any) => s + Number(i.unit_price) * i.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your shopping cart</h1>
        {isLoading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <div className="rounded-md border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/catalog" className="inline-block mt-4">
              <Button>Continue shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-md border border-border bg-card overflow-hidden">
              {items.map((it: any) => {
                const img = it.products?.product_images?.find((i: any) => i.is_primary)?.url ?? it.products?.product_images?.[0]?.url;
                return (
                  <div key={it.id} className="flex items-center gap-4 p-4 border-b border-border last:border-0">
                    {img && <img src={img} alt={it.products?.name} className="h-20 w-20 rounded object-cover" />}
                    <div className="flex-1 min-w-0">
                      <Link to="/product/$slug" params={{ slug: it.products?.slug }} className="font-medium hover:text-primary">
                        {it.products?.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">${Number(it.unit_price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center rounded border border-border">
                      <button
                        onClick={() => upMut.mutate({ itemId: it.id, quantity: Math.max(1, it.quantity - 1) })}
                        className="p-1.5 hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-semibold">{it.quantity}</span>
                      <button
                        onClick={() => upMut.mutate({ itemId: it.id, quantity: it.quantity + 1 })}
                        className="p-1.5 hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="w-20 text-right font-bold text-primary">
                      ${(Number(it.unit_price) * it.quantity).toFixed(2)}
                    </div>
                    <button onClick={() => rmMut.mutate(it.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
            <aside className="rounded-md border border-border bg-card p-6 h-fit">
              <h2 className="font-semibold mb-4">Order summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">{subtotal >= 100 ? "Free" : "$9.90"}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">
                    ${(subtotal + (subtotal >= 100 ? 0 : 9.9)).toFixed(2)}
                  </span>
                </div>
              </div>
              <Link to="/checkout">
                <Button className="w-full mt-4">Proceed to checkout</Button>
              </Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
