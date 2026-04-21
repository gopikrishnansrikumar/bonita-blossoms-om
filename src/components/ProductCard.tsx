import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/site";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-secondary/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={900}
          height={1100}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.bestSeller && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
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
