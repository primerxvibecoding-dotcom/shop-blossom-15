import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { getProduct } from "@/lib/shop.functions";
import { addToCart } from "@/lib/cart.functions";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({ meta: [{ title: `${params.slug} — Stellar Cart` }] }),
  notFoundComponent: () => (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Link to="/catalog" className="text-primary underline mt-4 inline-block">Browse catalog</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container mx-auto py-20 text-center text-destructive">{error.message}</div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const getProductFn = useServerFn(getProduct);
  const addToCartFn = useServerFn(addToCart);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useSession();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductFn({ data: { slug } }),
  });

  const addMut = useMutation({
    mutationFn: (input: { productId: string; quantity: number }) => addToCartFn({ data: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (e: any) => toast.error(e.message),
  });

  if (isLoading) return <div className="container py-20">Loading…</div>;
  if (!product) return <div className="container py-20">Not found</div>;

  const img = (product.product_images ?? []).find((i: any) => i.is_primary)?.url ?? product.product_images?.[0]?.url;

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="container mx-auto px-4 py-6">
        <nav className="text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> /{" "}
          <Link to="/catalog" className="hover:text-primary">Shop</Link>
          {product.categories && (
            <> / <Link to="/catalog" search={{ category: product.categories.slug }} className="hover:text-primary">{product.categories.name}</Link></>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-card overflow-hidden">
            {img && <img src={img} alt={product.name} className="w-full aspect-square object-cover" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating_avg) ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <span className="text-muted-foreground">({product.rating_count} reviews)</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
              {product.compare_at_price && (
                <span className="text-lg text-muted-foreground line-through">
                  ${Number(product.compare_at_price).toFixed(2)}
                </span>
              )}
            </div>
            <p className="mt-4 text-muted-foreground">{product.short_description}</p>
            <p className="mt-2 text-sm">
              Availability:{" "}
              <span className={product.stock > 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
              </span>
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-border">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-muted">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-muted">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="lg"
                disabled={product.stock === 0 || addMut.isPending}
                onClick={() => {
                  if (!user) {
                    navigate({ to: "/auth", search: { redirect: window.location.pathname } });
                    return;
                  }
                  addMut.mutate({ productId: product.id, quantity: qty });
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to cart
              </Button>
            </div>

            {product.description && (
              <div className="mt-8">
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
