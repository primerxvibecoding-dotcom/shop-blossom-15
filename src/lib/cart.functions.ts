import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function getOrCreateCart(supabase: any, userId: string) {
  const { data: existing } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing) return existing.id as string;
  const { data: created, error } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return created.id as string;
}

export const getCart = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const cartId = await getOrCreateCart(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("cart_items")
      .select(
        "id, quantity, unit_price, product_id, products(id, slug, name, stock, product_images(url, is_primary))",
      )
      .eq("cart_id", cartId);
    if (error) throw new Error(error.message);
    return { cartId, items: data ?? [] };
  });

export const addToCart = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).default(1) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const cartId = await getOrCreateCart(context.supabase, context.userId);
    const { data: product, error: pErr } = await context.supabase
      .from("products")
      .select("price, stock, is_active")
      .eq("id", data.productId)
      .maybeSingle();
    if (pErr) throw new Error(pErr.message);
    if (!product || !product.is_active) throw new Error("Product unavailable");

    const { data: existing } = await context.supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", data.productId)
      .maybeSingle();

    if (existing) {
      const newQty = existing.quantity + data.quantity;
      const { error } = await context.supabase
        .from("cart_items")
        .update({ quantity: newQty })
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase.from("cart_items").insert({
        cart_id: cartId,
        product_id: data.productId,
        quantity: data.quantity,
        unit_price: product.price,
      });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const updateCartItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({ itemId: z.string().uuid(), quantity: z.number().int().min(1) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("cart_items")
      .update({ quantity: data.quantity })
      .eq("id", data.itemId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeCartItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ itemId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("cart_items").delete().eq("id", data.itemId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
