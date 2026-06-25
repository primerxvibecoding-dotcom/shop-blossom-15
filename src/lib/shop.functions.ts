import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("categories")
    .select("id, slug, name, icon, position, parent_id, image_url")
    .eq("is_active", true)
    .order("position", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((d) =>
    z
      .object({
        categorySlug: z.string().optional(),
        search: z.string().optional(),
        featured: z.boolean().optional(),
        deal: z.boolean().optional(),
        limit: z.number().int().min(1).max(60).optional(),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const supa = publicClient();
    let categoryIds: string[] | null = null;
    if (data.categorySlug) {
      const { data: cat } = await supa
        .from("categories")
        .select("id")
        .eq("slug", data.categorySlug)
        .maybeSingle();
      if (cat) {
        const { data: subs } = await supa
          .from("categories")
          .select("id")
          .eq("parent_id", cat.id);
        categoryIds = [cat.id, ...(subs ?? []).map((s) => s.id)];
      } else {
        return [];
      }
    }
    let q = supa
      .from("products")
      .select(
        "id, slug, name, short_description, price, compare_at_price, stock, is_featured, is_deal, rating_avg, rating_count, category_id, product_images(url, is_primary, position)",
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 24);
    if (categoryIds) q = q.in("category_id", categoryIds);
    if (data.search) q = q.ilike("name", `%${data.search}%`);
    if (data.featured) q = q.eq("is_featured", true);
    if (data.deal) q = q.eq("is_deal", true);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const supa = publicClient();
    const { data: product, error } = await supa
      .from("products")
      .select(
        "id, slug, name, short_description, description, price, compare_at_price, stock, currency, rating_avg, rating_count, category_id, product_images(url, alt, is_primary, position), categories(slug, name)",
      )
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return product;
  });
