import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";
import logo from "@/assets/bonita-logo.png";
import { useCart } from "@/context/CartContext";
import { SITE } from "@/lib/site";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const handleScroll = () => setCompact(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur transition-all duration-300">
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 ${compact ? "py-3" : "py-5"} lg:px-10`}>
        <Link to="/" className="flex items-center gap-4" onClick={() => setOpen(false)}>
          <div className={`relative overflow-hidden rounded-full border-2 border-accent/60 bg-white transition-all duration-300 ${compact ? "h-12 w-12 shadow-[0_0_0_3px_rgba(199,160,103,0.12)]" : "h-16 w-16 shadow-[0_0_0_4px_rgba(199,160,103,0.16)]"}`}>
            <img
              src={logo}
              alt="Bonita Flowers logo"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div>
            <span className={`block font-serif tracking-wide text-foreground transition-all duration-300 ${compact ? "text-2xl" : "text-3xl"}`}>{SITE.name}</span>
            <span className={`text-xs uppercase tracking-[0.28em] text-muted-foreground transition-opacity duration-300 ${compact ? "opacity-0" : "opacity-100"}`}>
              Luxury florist · Oman
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex md:ml-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm tracking-wide text-foreground/80 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-foreground transition-colors hover:border-accent/50 hover:bg-secondary"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-foreground transition-colors hover:border-accent/50 hover:bg-secondary md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-card md:hidden">
          <nav className="flex flex-col px-5 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base text-foreground/80 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
