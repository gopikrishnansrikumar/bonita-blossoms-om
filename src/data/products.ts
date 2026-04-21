import pinkRoses from "@/assets/product-pink-roses.jpg";
import whiteRoses from "@/assets/product-white-roses.jpg";
import mixedPastel from "@/assets/product-mixed-pastel.jpg";
import luxuryBox from "@/assets/product-luxury-box.jpg";
import wedding from "@/assets/product-wedding.jpg";
import sympathy from "@/assets/product-sympathy.jpg";
import birthday from "@/assets/product-birthday.jpg";
import anniversary from "@/assets/product-anniversary.jpg";

export type ProductCategory = "Roses" | "Mixed Bouquets" | "Luxury Arrangements";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  occasions: string[];
  shortDescription: string;
  description: string;
  image: string;
  bestSeller?: boolean;
};

export const products: Product[] = [
  {
    id: "blush-pink-roses",
    name: "Blush Pink Roses",
    price: 28,
    category: "Roses",
    occasions: ["Birthday", "Anniversary"],
    shortDescription: "A romantic bouquet of soft pink roses wrapped in cream paper.",
    description:
      "Twenty hand-selected pink roses, gathered with lush greens and finished in our signature cream wrap. A timeless gesture for the people who matter most.",
    image: pinkRoses,
    bestSeller: true,
  },
  {
    id: "ivory-grace",
    name: "Ivory Grace",
    price: 32,
    category: "Roses",
    occasions: ["Wedding", "Sympathy"],
    shortDescription: "Cream roses with delicate baby's breath.",
    description:
      "An understated arrangement of ivory roses softened with airy baby's breath. Pure, calm, and quietly luxurious.",
    image: whiteRoses,
  },
  {
    id: "pastel-dreams",
    name: "Pastel Dreams",
    price: 38,
    category: "Mixed Bouquets",
    occasions: ["Birthday", "Anniversary"],
    shortDescription: "Peonies, ranunculus and eucalyptus in soft pastels.",
    description:
      "A garden-style bouquet of seasonal peonies, ranunculus and silver eucalyptus. Effortlessly romantic and full of texture.",
    image: mixedPastel,
    bestSeller: true,
  },
  {
    id: "bonita-signature-box",
    name: "Bonita Signature Box",
    price: 65,
    category: "Luxury Arrangements",
    occasions: ["Anniversary", "Birthday"],
    shortDescription: "Red roses and pink peonies in our signature pink hat box.",
    description:
      "Our most-loved gift. Velvety red roses meet blush peonies inside a hand-finished pink keepsake box. Always memorable.",
    image: luxuryBox,
    bestSeller: true,
  },
  {
    id: "bridal-whisper",
    name: "Bridal Whisper",
    price: 95,
    category: "Luxury Arrangements",
    occasions: ["Wedding"],
    shortDescription: "A cascading bridal bouquet of peonies and trailing greens.",
    description:
      "Designed for the aisle. Soft peonies, garden roses and trailing eucalyptus, hand-tied with silk ribbon to suit your gown.",
    image: wedding,
  },
  {
    id: "serene-lilies",
    name: "Serene Lilies",
    price: 42,
    category: "Mixed Bouquets",
    occasions: ["Sympathy"],
    shortDescription: "White lilies and roses, a gentle gesture of comfort.",
    description:
      "Pure white lilies arranged with cream roses and deep greens. A respectful, calming bouquet to send your love.",
    image: sympathy,
  },
  {
    id: "joyful-birthday",
    name: "Joyful Birthday",
    price: 34,
    category: "Mixed Bouquets",
    occasions: ["Birthday"],
    shortDescription: "Bright pink and coral blooms to celebrate her day.",
    description:
      "A joyful mix of pink roses, coral gerberas and pastel daisies, wrapped in soft cream paper. Made to bring a smile.",
    image: birthday,
    bestSeller: true,
  },
  {
    id: "eternal-red",
    name: "Eternal Red",
    price: 48,
    category: "Roses",
    occasions: ["Anniversary"],
    shortDescription: "Two dozen red roses in blush pink wrap with satin ribbon.",
    description:
      "Twenty-four long-stem red roses presented in our blush pink wrap with hand-tied satin ribbon. The classic love letter.",
    image: anniversary,
  },
];

export const categories: ProductCategory[] = ["Roses", "Mixed Bouquets", "Luxury Arrangements"];

export const occasions = ["Birthday", "Anniversary", "Wedding", "Sympathy"] as const;

export const findProduct = (id: string) => products.find((p) => p.id === id);
