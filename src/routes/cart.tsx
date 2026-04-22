import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, X, Truck, Banknote } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/storefront";
import { formatPrice, waLink } from "@/lib/site";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Bonita Flowers" },
      { name: "description", content: "Review your bouquet selection and check out — Cash on Delivery available." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, total, setQuantity, remove, clear } = useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [info, setInfo] = useState({ name: "", phone: "", address: "", city: "", note: "" });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    await createOrder({
      data: {
        customer_name: info.name,
        phone: info.phone,
        address: info.address,
        city: info.city,
        note: info.note,
        total_amount: total,
        items: items.map((item) => ({
          product_id: undefined,
          product_name: item.name,
          product_image_url: item.image,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      },
    });
    const lines = items
      .map((i) => `• ${i.name} × ${i.quantity} — ${formatPrice(i.price * i.quantity)}`)
      .join("\n");
    const message = `Hi Bonita Flowers, I'd like to place an order (Cash on Delivery):\n\n${lines}\n\nTotal: ${formatPrice(total)}\n\nName: ${info.name}\nPhone: ${info.phone}\nAddress: ${info.address}, ${info.city}\nNote: ${info.note || "—"}`;
    window.open(waLink(message), "_blank");
    setStep("done");
    clear();
  };

  if (step === "done") {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <p className="eyebrow">Order placed</p>
        <h1 className="mt-3 font-serif text-4xl text-foreground">Thank you 🌸</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          We've opened WhatsApp with your order summary. We'll confirm and arrange same-day delivery shortly.
        </p>
        <Link to="/shop" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-32 text-center">
        <h1 className="font-serif text-4xl text-foreground">Your cart is empty</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Find a bouquet you love and we'll deliver it across Oman.
        </p>
        <Link to="/shop" className="mt-8 inline-block rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground">
          Shop bouquets
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 lg:px-10 lg:py-20">
      <p className="eyebrow">{step === "cart" ? "Your cart" : "Checkout"}</p>
      <h1 className="mt-3 font-serif text-4xl text-foreground">
        {step === "cart" ? "Review your bouquets" : "Delivery details"}
      </h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === "cart" ? (
            <ul className="divide-y divide-border border-y border-border">
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 py-5">
                  <img src={i.image} alt={i.name} loading="lazy" className="h-24 w-20 rounded-sm object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-lg text-foreground">{i.name}</h3>
                        <p className="text-sm text-muted-foreground">{formatPrice(i.price)}</p>
                      </div>
                      <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-primary" aria-label="Remove">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 inline-flex w-fit items-center rounded-full border border-border">
                      <button onClick={() => setQuantity(i.id, i.quantity - 1)} className="flex h-9 w-9 items-center justify-center" aria-label="Decrease">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-sm">{i.quantity}</span>
                      <button onClick={() => setQuantity(i.id, i.quantity + 1)} className="flex h-9 w-9 items-center justify-center" aria-label="Increase">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-5">
              {(["name", "phone", "address", "city"] as const).map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {field === "name" ? "Full name" : field === "phone" ? "Phone (WhatsApp)" : field === "address" ? "Delivery address" : "City"}
                  </label>
                  <input
                    id={field}
                    required
                    value={info[field]}
                    onChange={(e) => setInfo({ ...info, [field]: e.target.value })}
                    className="mt-2 w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="note" className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Card message (optional)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={info.note}
                  onChange={(e) => setInfo({ ...info, note: e.target.value })}
                  className="mt-2 w-full rounded-sm border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
               <div className="rounded-sm border border-accent/30 bg-secondary/50 p-4 text-sm text-foreground/80">
                <p className="flex items-center gap-2 font-medium"><Banknote className="h-4 w-4 text-primary" /> Cash on Delivery</p>
                <p className="mt-1 text-xs text-muted-foreground">Pay with cash when your bouquet arrives.</p>
              </div>
               <button type="submit" className="w-full rounded-full bg-accent px-7 py-4 text-sm font-medium text-accent-foreground hover:opacity-90">
                Confirm order via WhatsApp
              </button>
            </form>
          )}
        </div>

        <aside className="h-fit rounded-sm border border-border bg-secondary/50 p-6 shadow-[var(--shadow-soft)]">
          <h2 className="font-serif text-xl text-foreground">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span><span>Calculated at WhatsApp</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium text-foreground">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-4 w-4 text-primary" /> Same-day delivery available
          </div>
          {step === "cart" ? (
            <button
              onClick={() => setStep("checkout")}
              className="mt-6 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              Checkout
            </button>
          ) : (
            <button
              onClick={() => setStep("cart")}
              className="mt-6 w-full rounded-full border border-border bg-background px-6 py-3 text-sm text-foreground hover:border-primary"
            >
              ← Back to cart
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}
