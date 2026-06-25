import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const addressSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  line1: z.string().min(1),
  city: z.string().min(1),
  postal_code: z.string().min(1),
  country: z.string().min(1),
});

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ shipping: addressSchema, notes: z.string().optional() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!cart) throw new Error("Cart is empty");

    const { data: items, error: iErr } = await supabase
      .from("cart_items")
      .select("product_id, quantity, unit_price, products(name, sku, stock)")
      .eq("cart_id", cart.id);
    if (iErr) throw new Error(iErr.message);
    if (!items || items.length === 0) throw new Error("Cart is empty");

    const subtotal = items.reduce((s: number, it: any) => s + Number(it.unit_price) * it.quantity, 0);
    const shipping_total = subtotal >= 100 ? 0 : 9.9;
    const tax_total = +(subtotal * 0.0).toFixed(2);
    const grand_total = +(subtotal + shipping_total + tax_total).toFixed(2);

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        subtotal,
        shipping_total,
        tax_total,
        grand_total,
        shipping_address: data.shipping,
        billing_address: data.shipping,
        notes: data.notes,
        status: "pending",
      })
      .select("id, order_number")
      .single();
    if (oErr) throw new Error(oErr.message);

    const rows = items.map((it: any) => ({
      order_id: order.id,
      product_id: it.product_id,
      name: it.products?.name ?? "Item",
      sku: it.products?.sku ?? null,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: Number(it.unit_price) * it.quantity,
    }));
    const { error: oiErr } = await supabase.from("order_items").insert(rows);
    if (oiErr) throw new Error(oiErr.message);

    await supabase.from("cart_items").delete().eq("cart_id", cart.id);

    return { id: order.id, orderNumber: order.order_number };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, order_number, status, grand_total, currency, placed_at, order_items(name, quantity, total)")
      .eq("user_id", context.userId)
      .order("placed_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
