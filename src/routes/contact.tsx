import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MapPin, Mail, Clock, Instagram } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bonita Flowers | Oman" },
      {
        name: "description",
        content:
          "Reach Bonita Flowers in Oman via WhatsApp, phone or our contact form. Same-day delivery and Cash on Delivery available.",
      },
      { property: "og:title", content: "Contact — Bonita Flowers" },
      { property: "og:description", content: "Reach us via WhatsApp, phone, or email." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi Bonita Flowers!\n\nName: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.open(waLink(message), "_blank");
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div>
      <section className="border-b border-border/60 bg-secondary/40 py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-10">
          <p className="eyebrow">Get in touch</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">
            A refined floral service, one message away.
          </h1>
          <p className="mt-5 text-base text-muted-foreground">
            For orders, custom arrangements or wedding enquiries — WhatsApp is the
            fastest way to reach us.
          </p>
          <div className="mt-8">
            <WhatsAppButton size="lg" message="Hi Bonita Flowers, I have a question 🌸">
              Chat on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-5 lg:px-10">
        <div className="md:col-span-2">
          <h2 className="font-serif text-2xl text-foreground">Visit & reach us</h2>
          <ul className="mt-6 space-y-5 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Studio</p>
                <p className="text-muted-foreground">{SITE.location}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Phone</p>
                <a href={`tel:${SITE.phoneE164}`} className="text-muted-foreground hover:text-primary">
                  {SITE.phoneDisplay}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Email</p>
                <a href={`mailto:${SITE.email}`} className="text-muted-foreground hover:text-primary">
                  {SITE.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Open daily</p>
                <p className="text-muted-foreground">9:00 — 22:00</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Instagram className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Instagram</p>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                >
                  @bonita.flowers
                </a>
              </div>
            </li>
          </ul>

          <div className="mt-10 rounded-sm border border-accent/30 bg-secondary/50 p-6">
            <p className="eyebrow">Delivery</p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
              Same-day delivery across Muscat for orders before 4pm. Cash on Delivery
              available across Oman. WhatsApp us for urgent same-day requests.
            </p>
          </div>

          <div className="mt-10 text-center">
            <p className="eyebrow mb-4">Find us on the map</p>
            <a
              href="https://maps.app.goo.gl/Cv48p3ynPUTc1YeK8"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${SITE.name} location in Google Maps`}
              className="group relative block overflow-hidden rounded-sm border border-accent/30 shadow-sm transition-shadow hover:shadow-md"
            >
              <iframe
                title={`${SITE.name} location map`}
                src="https://www.google.com/maps?q=Bonita+Flowers+Muscat+Oman&output=embed"
                className="pointer-events-none h-64 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-background/80 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium tracking-wide text-primary-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Get directions
                </span>
              </div>
            </a>
            <p className="mt-3 text-xs text-muted-foreground">
              Tap the map to open directions in Google Maps.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3">
          <h2 className="font-serif text-2xl text-foreground">Send us a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your message will open a WhatsApp chat with us — the fastest way to reply.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Your name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none ring-primary focus:border-primary focus:ring-1"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none ring-primary focus:border-primary focus:ring-1"
              />
            </div>
            <div>
              <label htmlFor="message" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none ring-primary focus:border-primary focus:ring-1"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-7 py-4 text-sm font-medium tracking-wide text-accent-foreground transition-all hover:opacity-90 sm:w-auto"
            >
              Send via WhatsApp
            </button>
            {sent && (
              <p className="text-sm text-sage-deep">Opening WhatsApp… thank you! 🌸</p>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
