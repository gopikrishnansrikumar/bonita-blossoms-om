import { createFileRoute, Link } from "@tanstack/react-router";
import aboutImage from "@/assets/about-florist.jpg";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Bonita Flowers | Oman" },
      {
        name: "description",
        content:
          "The story of Bonita Flowers — a Muscat-based florist crafting premium bouquets with freshness, design and love.",
      },
      { property: "og:title", content: "Our Story — Bonita Flowers" },
      { property: "og:description", content: "Premium florist in Oman, made with love." },
      { property: "og:image", content: aboutImage },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    title: "Freshness, always",
    description:
      "We hand-pick seasonal stems and arrange every bouquet the day it's delivered.",
  },
  {
    title: "Design with intention",
    description:
      "From soft pastels to dramatic reds — every arrangement is designed to feel curated.",
  },
  {
    title: "Quality you can feel",
    description:
      "From wrap to ribbon, every detail is chosen to make your gift unforgettable.",
  },
];

function AboutPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24 lg:px-10">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
            Floral gifting with a luxury signature.
          </h1>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Bonita Flowers began with a simple idea: that Oman deserved a florist
              that treats every bouquet like a love letter. From a small Muscat
              studio, we hand-arrange premium florals for birthdays, weddings,
              anniversaries — and every quiet moment in between.
            </p>
            <p>
              Each design starts with the freshest stems available that morning. We
              source carefully, wrap thoughtfully, and deliver across Oman the same day
              whenever possible — because flowers are best when they're a surprise.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Shop bouquets
            </Link>
            <WhatsAppButton size="md" variant="outline">
              Chat with us
            </WhatsAppButton>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-accent/20 blur-3xl" />
          <img
            src={aboutImage}
            alt="Florist hand-arranging a premium bouquet"
            loading="lazy"
            width={1200}
            height={1400}
            className="relative aspect-[4/5] w-full rounded-sm object-cover shadow-[var(--shadow-petal)]"
          />
        </div>
      </section>

       <section className="border-y border-border/60 bg-secondary/45 py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="text-center">
            <p className="eyebrow">What we believe</p>
            <h2 className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">
              Three things, every time.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-sm border border-border/60 bg-background p-8">
                <h3 className="font-serif text-xl text-foreground">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
