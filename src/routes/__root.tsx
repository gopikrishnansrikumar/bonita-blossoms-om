import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/WhatsAppButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-foreground">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Bonita Flowers — Fresh Flowers, Beautiful Moments | Oman" },
      {
        name: "description",
        content:
          "Premium hand-arranged bouquets and floral gifts in Oman. Same-day delivery, Cash on Delivery, and order easily via WhatsApp.",
      },
      { name: "author", content: "Bonita Flowers" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Bonita Flowers" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Bonita Flowers — Fresh Flowers, Beautiful Moments | Oman" },
      { name: "twitter:title", content: "Bonita Flowers — Fresh Flowers, Beautiful Moments | Oman" },
      { name: "description", content: "Bonita Bloom Beauty is an e-commerce website for a luxury flower shop in Oman." },
      { property: "og:description", content: "Bonita Bloom Beauty is an e-commerce website for a luxury flower shop in Oman." },
      { name: "twitter:description", content: "Bonita Bloom Beauty is an e-commerce website for a luxury flower shop in Oman." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ebc6bfd5-c139-4865-b6bf-184001a06f22/id-preview-18faf5a0--09d5a304-15d1-450a-9a74-7aa10f64c057.lovable.app-1776923478388.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ebc6bfd5-c139-4865-b6bf-184001a06f22/id-preview-18faf5a0--09d5a304-15d1-450a-9a74-7aa10f64c057.lovable.app-1776923478388.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <FloatingWhatsApp />
    </CartProvider>
  );
}
