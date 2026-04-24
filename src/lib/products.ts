import { products as legacyProducts } from "@/data/products";
import type { Database } from "@/integrations/supabase/types";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

const legacyProductBySlug = new Map(
  legacyProducts.map((product) => [product.id, product]),
);

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  shortDescription: string;
  description: string;
  image: string | null;
  bestSeller: boolean;
  isActive: boolean;
  sortOrder: number;
};

function getStoragePublicUrl(path: string) {
  const cleanPath = path.replace(/^\/+/, "");
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${baseUrl}/storage/v1/object/public/site-media/${cleanPath}`;
}

export function resolveProductImage(product: Pick<ProductRow, "slug" | "image_url" | "image_path">) {
  if (product.image_url?.trim()) return product.image_url.trim();
  if (product.image_path?.trim()) return getStoragePublicUrl(product.image_path.trim());
  return legacyProductBySlug.get(product.slug)?.image ?? null;
}

export function toStoreProduct(product: ProductRow): StoreProduct {
  const legacyProduct = legacyProductBySlug.get(product.slug);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: Number(product.price_omr),
    shortDescription: product.short_description,
    description: product.description,
    image: resolveProductImage(product),
    bestSeller: product.is_featured || legacyProduct?.bestSeller || false,
    isActive: product.is_active,
    sortOrder: product.sort_order,
  };
}

export const PRODUCT_CATEGORIES = [
  "Hand Bouquet",
  "Foam Bouquet",
  "Special Bouquet",
  "Chocolates",
  "Events",
] as const;

export function getProductCategories(products: StoreProduct[]) {
  const fromProducts = Array.from(new Set(products.map((p) => p.category)));
  return Array.from(new Set([...PRODUCT_CATEGORIES, ...fromProducts]));
}