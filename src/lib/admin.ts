import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().trim().min(1).max(80),
  price_omr: z.number().min(0).max(10000),
  short_description: z.string().trim().min(1).max(220),
  description: z.string().trim().min(1).max(4000),
  image_url: z.string().trim().url().or(z.literal("")),
  image_path: z.string().trim().max(500).optional().nullable(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

const siteContentSchema = z.object({
  id: z.string().uuid(),
  title: z.string().trim().max(160),
  subtitle: z.string().trim().max(220),
  body: z.string().trim().max(4000),
  image_url: z.string().trim().url().or(z.literal("")),
  enabled: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

const settingsSchema = z.object({
  id: z.string().uuid(),
  whatsapp_number: z.string().trim().min(5).max(30),
  phone_display: z.string().trim().min(5).max(30),
  phone_e164: z.string().trim().min(5).max(30),
  instagram_url: z.string().trim().url(),
  email: z.string().trim().email(),
  delivery_info: z.string().trim().max(1000),
  hero_enabled: z.boolean(),
  featured_enabled: z.boolean(),
  delivery_enabled: z.boolean(),
  instagram_enabled: z.boolean(),
});

const orderStatusSchema = z.object({
  orderId: z.string().uuid(),
  status: z.enum(["pending", "completed", "delivered"]),
});

const deleteProductSchema = z.object({ id: z.string().uuid() });
export type ProductInput = z.infer<typeof productSchema>;
export type SiteContentInput = z.infer<typeof siteContentSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;

export async function getSessionState() {
  const { data } = await supabase.auth.getSession();
  const session = data.session;

  if (!session?.user) {
    return { session: null, isAdmin: false };
  }

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id);

  return {
    session,
    isAdmin: roles?.some((role) => role.role === "admin") ?? false,
  };
}

export async function signInWithPassword(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined },
  });
}

export async function signOutAdmin() {
  return supabase.auth.signOut();
}

export async function bootstrapAdminRole() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session?.user) {
    throw new Error("Please sign in before claiming admin access.");
  }

  const { error } = await supabase
    .from("user_roles")
    .insert({ user_id: session.user.id, role: "admin" });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function saveProduct(input: ProductInput) {
  const data = productSchema.parse(input);
  const payload = {
    name: data.name,
    slug: data.slug,
    category: data.category,
    price_omr: data.price_omr,
    short_description: data.short_description,
    description: data.description,
    image_url: data.image_url || null,
    image_path: data.image_path ?? null,
    is_featured: data.is_featured,
    is_active: data.is_active,
    sort_order: data.sort_order,
  };

  const query = data.id
    ? supabase.from("products").update(payload).eq("id", data.id).select().single()
    : supabase.from("products").insert(payload).select().single();

  const { data: saved, error } = await query;
  if (error) throw new Error(error.message);
  return saved;
}

export async function deleteProduct(input: { id: string }) {
  const data = deleteProductSchema.parse(input);
  const { error } = await supabase.from("products").delete().eq("id", data.id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function saveSiteContent(input: SiteContentInput) {
  const data = siteContentSchema.parse(input);
  const { data: saved, error } = await supabase
    .from("site_content")
    .update({
      title: data.title || null,
      subtitle: data.subtitle || null,
      body: data.body || null,
      image_url: data.image_url || null,
      enabled: data.enabled,
      sort_order: data.sort_order,
    })
    .eq("id", data.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return saved;
}

export async function saveSettings(input: SettingsInput) {
  const data = settingsSchema.parse(input);
  const { data: saved, error } = await supabase
    .from("site_settings")
    .update({
      whatsapp_number: data.whatsapp_number,
      phone_display: data.phone_display,
      phone_e164: data.phone_e164,
      instagram_url: data.instagram_url,
      email: data.email,
      delivery_info: data.delivery_info,
      hero_enabled: data.hero_enabled,
      featured_enabled: data.featured_enabled,
      delivery_enabled: data.delivery_enabled,
      instagram_enabled: data.instagram_enabled,
    })
    .eq("id", data.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return saved;
}

export async function updateOrderStatus(input: { orderId: string; status: "pending" | "completed" | "delivered" }) {
  const data = orderStatusSchema.parse(input);
  const { data: saved, error } = await supabase
    .from("orders")
    .update({ status: data.status })
    .eq("id", data.orderId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return saved;
}