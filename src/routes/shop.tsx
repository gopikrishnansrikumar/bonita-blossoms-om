import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { products, categories, type ProductCategory } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/shop")({
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
  component: ShopPage,
});

function ShopPage() {
  const [active, setActive] = useState<ProductCategory | "All">("All");
  const filtered = active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      <section className="border-b border-border/60 bg-secondary/40 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
          <p className="eyebrow">The Shop</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
            Hand-tied bouquets, made to gift.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
            Each arrangement is created fresh in our Muscat studio using seasonal blooms.
            Choose a style below and we'll deliver — often the same day.
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
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground/70 hover:border-primary hover:text-primary"
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
