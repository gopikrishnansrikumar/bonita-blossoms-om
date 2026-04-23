import { Link } from "@tanstack/react-router";
import type { StoreProduct } from "@/lib/products";
import { formatPrice } from "@/lib/site";

export function ProductCard({ product }: { product: StoreProduct }) {
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.slug }}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border/70 bg-secondary/30 shadow-[var(--shadow-soft)]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={900}
            height={1100}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary text-sm text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent opacity-70" />
        {product.bestSeller && (
          <span className="absolute left-3 top-3 rounded-full border border-accent/40 bg-background/95 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
            Best seller
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-lg leading-tight text-foreground">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{product.shortDescription}</p>
        </div>
        <p className="shrink-0 text-sm font-medium text-foreground">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
