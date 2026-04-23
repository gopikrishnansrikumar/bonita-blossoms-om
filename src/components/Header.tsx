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
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/92 backdrop-blur-xl transition-all duration-300">
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-10 transition-all duration-300 ${isCompact ? "py-3" : "py-5"}`}>
        <Link to="/" className="flex items-center gap-3 sm:gap-4" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Bonita Flowers logo"
            className={`rounded-full border border-accent/60 object-cover shadow-[var(--shadow-soft)] transition-all duration-300 ${isCompact ? "h-12 w-12" : "h-16 w-16 sm:h-18 sm:w-18"}`}
          />
          <div>
            <span className={`block font-serif tracking-wide text-foreground transition-all duration-300 ${isCompact ? "text-[1.7rem] leading-none sm:text-[1.9rem]" : "text-[2.15rem] leading-none sm:text-[2.7rem]"}`}>
              {SITE.name}
            </span>
            <span className={`hidden uppercase text-muted-foreground sm:block transition-all duration-300 ${isCompact ? "mt-1 text-[10px] tracking-[0.24em]" : "mt-1.5 text-[11px] tracking-[0.3em]"}`}>
              Luxury florist · Oman
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
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
