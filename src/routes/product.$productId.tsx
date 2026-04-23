import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Truck, Banknote, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getStorefrontData } from "@/lib/storefront";
import { toStoreProduct } from "@/lib/products";
import { formatPrice, SITE } from "@/lib/site";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$productId")({
  loader: async ({ params }) => {
    const data = await getStorefrontData();
    const products = data.products.map(toStoreProduct);
    const product = products.find((item) => item.slug === params.productId);
    if (!product) throw notFound();
    return { product, related: products.filter((item) => item.slug !== product.slug && item.category === product.category).slice(0, 4) };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) {
      return { meta: [{ title: "Product not found — Bonita Flowers" }] };
    }
    return {
      meta: [
        { title: `${product.name} — Bonita Flowers` },
        { name: "description", content: product.shortDescription },
        { property: "og:title", content: `${product.name} — Bonita Flowers` },
        { property: "og:description", content: product.shortDescription },
        { property: "og:image", content: product.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-5 py-32 text-center">
      <h1 className="font-serif text-3xl">Bouquet not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        It may have been retired for the season.
      </p>
      <Link to="/shop" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">
        Back to shop
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md px-5 py-32 text-center">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({ id: product.id, name: product.name, price: product.price, image: product.image }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const message = `Hi Bonita Flowers, I'd like to order: ${product.name} (${formatPrice(product.price)}) × ${qty}`;

  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10 lg:py-20">
        <nav className="mb-8 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-sm border border-border/70 bg-secondary/30 shadow-[var(--shadow-petal)]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                width={900}
                height={1100}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-secondary text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <p className="eyebrow">{product.category}</p>
            <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-medium text-primary">{formatPrice(product.price)}</p>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center rounded-full border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center text-foreground/80 hover:text-primary"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center text-foreground/80 hover:text-primary"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="flex-1 rounded-full bg-accent px-6 py-3 text-sm font-medium tracking-wide text-accent-foreground transition-all hover:opacity-90"
              >
                {added ? "Added to cart ✓" : "Add to Cart"}
              </button>
            </div>

            <div className="mt-3">
              <WhatsAppButton message={message} className="w-full" size="lg">
                Order via WhatsApp
              </WhatsAppButton>
            </div>

            <ul className="mt-10 space-y-3 border-t border-border pt-6 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-primary" /> Same-day delivery available across {SITE.location}</li>
              <li className="flex items-center gap-3"><Banknote className="h-4 w-4 text-primary" /> Cash on Delivery accepted</li>
              <li className="flex items-center gap-3"><Sparkles className="h-4 w-4 text-primary" /> Hand-arranged with the freshest seasonal blooms</li>
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border/60 bg-secondary/45 py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-10">
            <h2 className="font-serif text-2xl text-foreground sm:text-3xl">You may also love</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
