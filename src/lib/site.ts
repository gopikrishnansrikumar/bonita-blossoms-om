export const SITE = {
  name: "Bonita Flowers",
  tagline: "Elegant Flowers for Every Occasion",
  location: "Muscat, Oman",
  phoneDisplay: "+968 9210 9485",
  phoneE164: "+96892109485",
  whatsappNumber: "96892109485",
  instagram: "https://www.instagram.com/bonita.flowers/",
  email: "info@adamforttrading.com",
  currency: "OMR",
};

export const waLink = (message?: string) => {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
};

export const formatPrice = (amount: number) =>
  `${SITE.currency} ${amount.toFixed(2)}`;
