import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getStorefrontData } from "@/lib/storefront";
import { getProductCategories, toStoreProduct } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { category?: string } => ({
    category: typeof search.category === "string" ? search.category : undefined,
  }),
  loader: async () => {
    const data = await getStorefrontData();
    const products = data.products.map(toStoreProduct);
    return {
      products,
      categories: getProductCategories(products),
    };
  },
  head: () => ({
    meta: [
      { title: "Shop Bouquets — Bonita Flowers | Oman" },
      {
        name: "description",
        content:
          "Browse roses, mixed bouquets, and luxury arrangements. Fresh, hand-tied flowers with same-day delivery in Oman.",
      },
      { property: "og:title", content: "Shop Bouquets — Bonita Flowers" },
      { property: "og:description", content: "Roses, mixed bouquets, and luxury arrangements." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md px-5 py-24 text-center lg:px-10">
      <h1 className="font-serif text-3xl text-foreground">Could not load the shop</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-5 py-24 text-center lg:px-10">
      <h1 className="font-serif text-3xl text-foreground">Shop unavailable</h1>
      <p className="mt-3 text-sm text-muted-foreground">Please check back in a moment.</p>
    </div>
  ),
  component: ShopPage,
});

function ShopPage() {
  const { products, categories } = Route.useLoaderData();
  const [active, setActive] = useState<string | "All">("All");
  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      <section className="border-b border-border/60 bg-secondary/50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
          <p className="eyebrow">The Shop</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
            Signature bouquets, styled to impress.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
            Browse elegant arrangements designed for luxury gifting, heartfelt surprises,
            and beautiful celebrations across Oman.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.18em] transition-all ${
                active === c
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-background text-foreground/70 hover:border-accent hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
