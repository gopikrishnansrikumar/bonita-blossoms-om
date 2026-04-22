export const SITE = {
  name: "Bonita Flowers",
  tagline: "Elegant Flowers for Every Occasion",
  location: "Muscat, Oman",
  phoneDisplay: "+968 9000 0000",
  phoneE164: "+96890000000",
  whatsappNumber: "96890000000", // edit to your real number
  instagram: "https://www.instagram.com/bonita.flowers/",
  email: "hello@bonitaflowers.om",
  currency: "OMR",
};

export const waLink = (message?: string) => {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const formatPrice = (amount: number) =>
  `${SITE.currency} ${amount.toFixed(2)}`;
