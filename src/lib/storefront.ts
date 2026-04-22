import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const createOrderSchema = z.object({
  customer_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(5).max(30),
  address: z.string().trim().min(1).max(255),
  city: z.string().trim().min(1).max(120),
  note: z.string().trim().max(1000).optional(),
  total_amount: z.number().min(0).max(10000),
  items: z.array(
    z.object({
      product_id: z.string().uuid().optional(),
      product_name: z.string().trim().min(1).max(120),
      product_image_url: z.string().trim().url().or(z.literal("")),
      quantity: z.number().int().min(1).max(50),
      unit_price: z.number().min(0).max(10000),
    }),
  ).min(1).max(50),
});

export const getStorefrontData = createServerFn({ method: "GET" }).handler(async () => {
  const [productsRes, contentRes, settingsRes, mediaRes] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabaseAdmin
      .from("site_content")
      .select("*")
      .eq("enabled", true)
      .order("sort_order", { ascending: true }),
    supabaseAdmin.from("site_settings").select("*").limit(1).maybeSingle(),
    supabaseAdmin.from("media_assets").select("*").order("created_at", { ascending: false }).limit(24),
  ]);

  if (productsRes.error) throw new Error(productsRes.error.message);
  if (contentRes.error) throw new Error(contentRes.error.message);
  if (settingsRes.error) throw new Error(settingsRes.error.message);
  if (mediaRes.error) throw new Error(mediaRes.error.message);

  return {
    products: productsRes.data ?? [],
    siteContent: contentRes.data ?? [],
    siteSettings: settingsRes.data,
    mediaAssets: mediaRes.data ?? [],
  };
});

export const getAdminData = createServerFn({ method: "GET" }).handler(async () => {
  const [productsRes, contentRes, settingsRes, ordersRes, orderItemsRes, mediaRes] = await Promise.all([
    supabaseAdmin.from("products").select("*").order("sort_order", { ascending: true }),
    supabaseAdmin.from("site_content").select("*").order("sort_order", { ascending: true }),
    supabaseAdmin.from("site_settings").select("*").limit(1).maybeSingle(),
    supabaseAdmin.from("orders").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("order_items").select("*").order("created_at", { ascending: false }),
    supabaseAdmin.from("media_assets").select("*").order("created_at", { ascending: false }),
  ]);

  if (productsRes.error) throw new Error(productsRes.error.message);
  if (contentRes.error) throw new Error(contentRes.error.message);
  if (settingsRes.error) throw new Error(settingsRes.error.message);
  if (ordersRes.error) throw new Error(ordersRes.error.message);
  if (orderItemsRes.error) throw new Error(orderItemsRes.error.message);
  if (mediaRes.error) throw new Error(mediaRes.error.message);

  return {
    products: productsRes.data ?? [],
    siteContent: contentRes.data ?? [],
    siteSettings: settingsRes.data,
    orders: ordersRes.data ?? [],
    orderItems: orderItemsRes.data ?? [],
    mediaAssets: mediaRes.data ?? [],
  };
});

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator(createOrderSchema)
  .handler(async ({ data }) => {
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.customer_name,
        phone: data.phone,
        address: data.address,
        city: data.city,
        note: data.note || null,
        total_amount: data.total_amount,
        status: "pending",
        payment_method: "cash_on_delivery",
        order_channel: "website",
      })
      .select()
      .single();

    if (orderError || !order) throw new Error(orderError?.message ?? "Could not create order");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      data.items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id ?? null,
        product_name: item.product_name,
        product_image_url: item.product_image_url || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    );

    if (itemsError) throw new Error(itemsError.message);

    return { orderId: order.id };
  });