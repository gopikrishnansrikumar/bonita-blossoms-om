import { waLink } from "@/lib/site";

type Props = {
  message?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-sm",
};

export function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.11 17.21c-.27-.13-1.61-.79-1.86-.88-.25-.09-.43-.13-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.97 2.63 1.11 2.81.14.18 1.91 2.92 4.63 4.09.65.28 1.16.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.61-.66 1.84-1.29.23-.64.23-1.18.16-1.29-.07-.11-.25-.18-.52-.32zM16.02 5.33c-5.89 0-10.67 4.78-10.67 10.67 0 1.88.49 3.71 1.43 5.32L5 27.33l6.13-1.61c1.55.85 3.3 1.3 5.07 1.3h.01c5.89 0 10.67-4.78 10.67-10.67 0-2.85-1.11-5.53-3.13-7.55-2.02-2.02-4.7-3.13-7.55-3.13zm0 19.49h-.01c-1.59 0-3.15-.43-4.51-1.24l-.32-.19-3.64.95.97-3.55-.21-.36c-.89-1.41-1.36-3.04-1.36-4.71 0-4.91 4-8.91 8.91-8.91 2.38 0 4.61.93 6.29 2.61 1.68 1.68 2.61 3.91 2.61 6.29 0 4.91-4 8.91-8.73 8.91z"/>
    </svg>
  );
}

export function WhatsAppButton({
  message,
  children = "Order via WhatsApp",
  className = "",
  variant = "solid",
  size = "md",
}: Props) {
  const styles = {
    solid: "bg-primary text-primary-foreground hover:opacity-90",
    outline: "border border-accent text-primary hover:bg-accent/10",
    ghost: "text-whatsapp hover:bg-whatsapp/10",
  }[variant];

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-all ${sizes[size]} ${styles} ${className}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
      {children}
    </a>
  );
}

export function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Hi Bonita Flowers, I'd like to place an order 🌸")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
