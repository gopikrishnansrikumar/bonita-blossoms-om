import { Link } from "@tanstack/react-router";
import { Instagram, Phone, MapPin, Mail } from "lucide-react";
import { SITE, waLink } from "@/lib/site";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <h3 className="font-serif text-2xl">{SITE.name}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Premium bouquets and floral gifts, hand-arranged in Muscat. Same-day delivery
            across Oman, every petal chosen with care.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-whatsapp transition-colors hover:bg-whatsapp hover:text-whatsapp-foreground"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="text-foreground/80 hover:text-primary">Shop all</Link></li>
            <li><Link to="/shop" search={{ category: "Roses" }} className="text-foreground/80 hover:text-primary">Roses</Link></li>
            <li><Link to="/shop" search={{ category: "Luxury Arrangements" }} className="text-foreground/80 hover:text-primary">Luxury</Link></li>
            <li><Link to="/about" className="text-foreground/80 hover:text-primary">Our story</Link></li>
            <li><Link to="/contact" className="text-foreground/80 hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Visit</p>
          <ul className="space-y-3 text-sm text-foreground/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" />
              <span>{SITE.location}</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-primary" />
              <a href={`tel:${SITE.phoneE164}`} className="hover:text-primary">{SITE.phoneDisplay}</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 text-primary" />
              <a href={`mailto:${SITE.email}`} className="hover:text-primary">{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row lg:px-10">
          <p>© {new Date().getFullYear()} {SITE.name}. Crafted with love in Oman.</p>
          <p>Same-day delivery · Cash on Delivery available</p>
        </div>
      </div>
    </footer>
  );
}
