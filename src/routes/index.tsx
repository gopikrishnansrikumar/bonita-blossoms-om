import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, Sparkles, HeartHandshake, Star, Instagram, ShieldCheck } from "lucide-react";
import logo from "@/assets/bonita-logo.png";
import heroImage from "@/assets/hero-bouquet.jpg";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bonita Flowers — Elegant Flowers for Every Occasion | Oman" },
      {
        name: "description",
        content:
          "Luxury bouquets and floral gifts in Oman. Same-day delivery, Cash on Delivery, and elegant WhatsApp ordering.",
      },
      { property: "og:title", content: "Bonita Flowers — Elegant Flowers for Every Occasion" },
      {
        property: "og:description",
        content: "Premium florist in Oman. Same-day delivery and effortless WhatsApp ordering.",
      },
    ],
  }),
  component: HomePage,
});

const occasions = [
  { name: "Birthday", description: "Bright, joyful, made to celebrate." },
  { name: "Anniversary", description: "Romantic gestures, beautifully tied." },
  { name: "Wedding", description: "Bridal bouquets and event florals." },
  { name: "Sympathy", description: "Quiet, graceful arrangements of comfort." },
];

const testimonials = [
  {
    quote:
      "The most beautiful bouquet I've ever received. The packaging felt like a luxury gift in itself.",
    name: "Maryam A.",
    city: "Muscat",
  },
  {
    quote:
      "Ordered last minute via WhatsApp and they delivered within hours. My wife was in tears — happy ones!",
    name: "Khalid R.",
    city: "Seeb",
  },
  {
    quote:
      "Bonita's wedding flowers were beyond what I imagined. So fresh, so elegantly arranged.",
    name: "Lina S.",
    city: "Muscat",
  },
];

function HomePage() {
  const featured = products.filter((p) => p.bestSeller).slice(0, 4);
  const galleryImages = products.slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/50 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--color-background)_88%,var(--color-gold)_12%),var(--color-background))]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-2 md:pb-24 md:pt-16 lg:px-10">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center gap-3 rounded-full border border-accent/35 bg-background/90 px-3 py-2 shadow-[var(--shadow-soft)]">
              <img src={logo} alt="Bonita Flowers mark" className="h-9 w-9 rounded-full object-cover" />
              <span className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">Bonita Flowers · Oman</span>
            </div>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              Elegant Flowers
              <br />
              for <span className="text-primary">Every Occasion</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              A premium floral boutique experience for gifting, celebration, and life’s
              most meaningful moments — delivered across Oman with care.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-medium tracking-wide text-accent-foreground transition-all hover:opacity-90"
              >
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <WhatsAppButton size="lg" message="Hi Bonita Flowers, I'd love to order a bouquet 🌸" />
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Same-day delivery</span>
              <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Cash on Delivery</span>
              <span className="flex items-center gap-2"><HeartHandshake className="h-4 w-4 text-primary" /> Hand-arranged daily</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Premium gifting experience</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-accent/25 to-primary/20 blur-3xl" />
              <img
                src={heroImage}
                alt="Luxury flower bouquet styled for Bonita Flowers"
                width={1600}
                height={1200}
                className="relative aspect-[4/3] w-full rounded-sm border border-accent/25 object-cover shadow-[var(--shadow-petal)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="border-y border-border/50 bg-secondary/40 py-20">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-10">
          <p className="eyebrow">Welcome to Bonita</p>
          <h2 className="mt-4 font-serif text-3xl text-foreground sm:text-4xl">
            Refined floral gifting for the moments that matter.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            From the first hello to the lifelong love story, Bonita Flowers crafts
             elegant arrangements with premium seasonal blooms. Every bouquet is
             styled to feel luxurious, thoughtful, and worthy of the occasion.
          </p>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Best sellers</p>
            <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
              Featured bouquets
            </h2>
          </div>
          <Link to="/shop" className="hidden text-sm text-primary hover:underline sm:inline-flex">
            View all →
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="bg-secondary/55 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="text-center">
            <p className="eyebrow">Shop by occasion</p>
            <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
              Flowers for every chapter
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {occasions.map((o) => (
              <Link
                key={o.name}
                to="/shop"
                className="group flex flex-col items-center rounded-sm border border-border/60 bg-background p-8 text-center transition-all hover:border-accent hover:shadow-[var(--shadow-soft)]"
              >
                <span className="font-serif text-xl text-foreground transition-colors group-hover:text-primary">
                  {o.name}
                </span>
                <span className="mt-2 text-xs text-muted-foreground">{o.description}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
        <div className="text-center">
          <p className="eyebrow">Loved across Oman</p>
          <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
            Kind words from our clients
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col rounded-sm border border-border/60 bg-card p-8">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 font-serif text-lg leading-relaxed text-foreground">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t.name} · {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="border-t border-border/60 bg-champagne py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="flex flex-col items-center text-center">
            <p className="eyebrow">@bonita.flowers</p>
            <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
              Follow our daily blooms
            </h2>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Instagram className="h-4 w-4" /> @bonita.flowers
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
            {galleryImages.map((p) => (
              <a
                key={p.id}
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-sm bg-secondary"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/30 group-hover:opacity-100">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
