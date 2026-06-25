import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: any) => r.role);
  if (!roles.some((r: string) => ["super_admin", "admin", "manager"].includes(r))) {
    throw new Error("Forbidden");
  }
  return roles;
}

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    return (data ?? []).map((r: any) => r.role as string);
  });

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("products")
      .select("id, slug, name, price, stock, is_active, is_featured, is_deal, category_id, categories(name)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const productInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  short_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().min(0),
  compare_at_price: z.number().min(0).optional().nullable(),
  stock: z.number().int().min(0),
  category_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  is_deal: z.boolean().default(false),
  image_url: z.string().url().optional().nullable(),
});

export const adminUpsertProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productInput.parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { image_url, id, ...rest } = data;
    let productId = id;
    if (id) {
      const { error } = await context.supabase.from("products").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      const { data: created, error } = await context.supabase
        .from("products")
        .insert(rest)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      productId = created.id;
    }
    if (image_url && productId) {
      await context.supabase.from("product_images").delete().eq("product_id", productId);
      await context.supabase
        .from("product_images")
        .insert({ product_id: productId, url: image_url, is_primary: true, position: 0 });
    }
    return { id: productId };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("categories")
      .select("id, slug, name, icon, parent_id, position, is_active")
      .order("position");
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const categoryInput = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1),
  name: z.string().min(1),
  icon: z.string().optional().nullable(),
  parent_id: z.string().uuid().optional().nullable(),
  position: z.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const adminUpsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => categoryInput.parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { id, ...rest } = data;
    if (id) {
      const { error } = await context.supabase.from("categories").update(rest).eq("id", id);
      if (error) throw new Error(error.message);
      return { id };
    }
    const { data: created, error } = await context.supabase
      .from("categories")
      .insert(rest)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: created.id };
  });

export const adminDeleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, order_number, status, grand_total, currency, placed_at, user_id, shipping_address, order_items(name, quantity, unit_price)")
      .order("placed_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminUpdateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDashboardStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);
    const [{ count: productCount }, { count: orderCount }, { count: userCount }, { data: revenueRows }] =
      await Promise.all([
        context.supabase.from("products").select("*", { count: "exact", head: true }),
        context.supabase.from("orders").select("*", { count: "exact", head: true }),
        context.supabase.from("profiles").select("*", { count: "exact", head: true }),
        context.supabase.from("orders").select("grand_total").neq("status", "cancelled"),
      ]);
    const revenue = (revenueRows ?? []).reduce((s: number, r: any) => s + Number(r.grand_total), 0);
    return {
      products: productCount ?? 0,
      orders: orderCount ?? 0,
      users: userCount ?? 0,
      revenue,
    };
  });
