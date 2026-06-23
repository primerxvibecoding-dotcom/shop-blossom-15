import cabinet from "@/assets/product-cabinet.jpg";
import chair from "@/assets/product-chair.jpg";
import pillowRed from "@/assets/product-pillow-red.jpg";
import bear from "@/assets/product-bear.jpg";
import birds from "@/assets/product-birds.jpg";
import towels from "@/assets/product-towels.jpg";
import vase from "@/assets/product-vase.jpg";
import blankets from "@/assets/product-blankets.jpg";
import stool from "@/assets/product-stool.jpg";
import armchair from "@/assets/product-armchair.jpg";
import clock from "@/assets/product-clock.jpg";

export const categories = [
  { name: "Gifts & Toys", icon: "Gift" },
  { name: "Electronics", icon: "Smartphone" },
  { name: "Fashion & Accessories", icon: "Shirt" },
  { name: "Bags & Shoes", icon: "ShoppingBag" },
  { name: "Optimum Electronics", icon: "Cpu" },
  { name: "Bathroom", icon: "Bath" },
  { name: "Health & Beauty", icon: "Sparkles" },
  { name: "Home & Lights", icon: "Lamp" },
  { name: "Metallurgy", icon: "Hammer" },
  { name: "Bedroom", icon: "BedDouble" },
];

export type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: { label: string; tone: "promo" | "new" | "discount" };
  sold?: number;
  stock?: number;
};

export const dailyDeals: Product[] = [
  { id: "d1", name: "Yutculpa Ullamco", price: 60, oldPrice: 72, image: cabinet, badge: { label: "-32%", tone: "discount" }, sold: 30, stock: 100 },
  { id: "d2", name: "Wamboudin Ribeye", price: 70, oldPrice: 84, image: chair, badge: { label: "-17%", tone: "discount" }, sold: 60, stock: 100 },
];

export const trending: Product[] = [
  { id: "t1", name: "Pastrami bacon", price: 42, image: pillowRed },
  { id: "t2", name: "Proident leerkas", price: 46, oldPrice: 54, image: bear, badge: { label: "NEW", tone: "new" } },
  { id: "t3", name: "Consecte quichuck", price: 55, oldPrice: 64, image: birds, badge: { label: "-16%", tone: "discount" } },
  { id: "t4", name: "Balltip nullaelit", price: 65, image: towels },
  { id: "t5", name: "Drumstick tempor", price: 65, oldPrice: 70, image: vase, badge: { label: "NEW", tone: "new" } },
  { id: "t6", name: "Kielbasa hamburg", price: 55, oldPrice: 64, image: blankets },
  { id: "t7", name: "Chicken swinesha", price: 45, oldPrice: 54, image: stool, badge: { label: "-20%", tone: "discount" } },
  { id: "t8", name: "Cenison meatloa", price: 62, image: armchair },
  { id: "t9", name: "Sausage cowbee", price: 56, image: cabinet },
  { id: "t10", name: "Meatball bresaola", price: 65, oldPrice: 72, image: clock, badge: { label: "-9%", tone: "discount" } },
];

export const latest: Product[] = [
  { id: "l1", name: "Balltip Nullaelit", price: 65, image: pillowRed },
  { id: "l2", name: "Wamboudin Ribeye", price: 70, oldPrice: 84, image: chair },
  { id: "l3", name: "Hrosoulto Kevincap", price: 80, oldPrice: 108, image: armchair },
  { id: "l4", name: "Cenison Meatloa", price: 62, image: stool },
];

export const trendingTabs = ["All", "Bathroom", "Bedroom", "Decor", "Furniture", "Living Room"];
