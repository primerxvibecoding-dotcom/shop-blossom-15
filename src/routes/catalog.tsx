import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listProducts, listCategories } from "@/lib/shop.functions";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/catalog")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Shop — Stellar Cart" }] }),
  component: Catalog,
});

function Catalog() {
  const { category, q } = useSearch({ from: "/catalog" });
  const listProductsFn = useServerFn(listProducts);
  const listCategoriesFn = useServerFn(listCategories);

  const productsQuery = useQuery({
    queryKey: ["products", { category, q }],
    queryFn: () => listProductsFn({ data: { categorySlug: category, search: q, limit: 48 } }),
  });
  const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: () => listCategoriesFn() });

  const parents = (categoriesQuery.data ?? []).filter((c: any) => !c.parent_id);

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-md border border-border bg-card p-4">
            <h2 className="font-semibold mb-3">Categories</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <Link
                  to="/catalog"
                  search={{}}
                  className={`block rounded px-2 py-1.5 hover:bg-muted ${!category ? "bg-muted font-semibold text-primary" : ""}`}
                >
                  All products
                </Link>
              </li>
              {parents.map((c: any) => {
                const subs = (categoriesQuery.data ?? []).filter((s: any) => s.parent_id === c.id);
                return (
                  <li key={c.id}>
                    <Link
                      to="/catalog"
                      search={{ category: c.slug }}
                      className={`block rounded px-2 py-1.5 hover:bg-muted ${category === c.slug ? "bg-muted font-semibold text-primary" : ""}`}
                    >
                      {c.name}
                    </Link>
                    {subs.length > 0 && (
                      <ul className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2">
                        {subs.map((s: any) => (
                          <li key={s.id}>
                            <Link
                              to="/catalog"
                              search={{ category: s.slug }}
                              className={`block rounded px-2 py-1 text-xs hover:bg-muted ${category === s.slug ? "text-primary font-semibold" : "text-muted-foreground"}`}
                            >
                              {s.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </aside>

          <section>
            <h1 className="text-2xl font-bold mb-4">
              {category ? parents.find((p: any) => p.slug === category)?.name ?? category : q ? `Search: ${q}` : "All products"}
            </h1>
            {productsQuery.isLoading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : productsQuery.data && productsQuery.data.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productsQuery.data.map((p: any) => {
                  const img = (p.product_images ?? []).find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url;
                  return (
                    <Link
                      key={p.id}
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="group rounded-md border border-border bg-card overflow-hidden hover:shadow-card-hover transition-shadow"
                    >
                      <div className="aspect-square bg-muted/30 overflow-hidden">
                        {img && (
                          <img
                            src={img}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{p.name}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="font-bold text-primary">${Number(p.price).toFixed(2)}</span>
                          {p.compare_at_price && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${Number(p.compare_at_price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground">No products found.</p>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
