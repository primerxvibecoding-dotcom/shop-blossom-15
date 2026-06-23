import { Heart, RefreshCw, ShoppingCart, User, Phone, Search, ChevronDown } from "lucide-react";

const mainNav = [
  { label: "HOME", active: true },
  { label: "LAYOUTS" },
  { label: "FEATURES", badge: "NEW" },
  { label: "SHOP" },
  { label: "BLOG", badge: "NEW" },
  { label: "PAGES" },
  { label: "MARKETPLACE", badge: "HOT" },
];

export function Header() {
  return (
    <header className="bg-navy text-navy-foreground">
      {/* Logo + nav */}
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-4">
        <a href="/" className="flex items-baseline gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-bold">e</div>
          <div className="leading-none">
            <div className="font-display text-2xl font-bold tracking-tight">market</div>
            <div className="text-[10px] opacity-60 tracking-widest">ALL IN ONE STORE</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {mainNav.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`relative inline-flex items-center gap-1 transition-colors hover:text-primary ${
                item.active ? "text-primary" : ""
              }`}
            >
              {item.label}
              {item.badge && (
                <span className="absolute -top-3 -right-4 rounded-sm bg-primary px-1 py-0.5 text-[9px] font-bold text-primary-foreground">
                  {item.badge}
                </span>
              )}
              {["LAYOUTS", "FEATURES", "SHOP", "BLOG", "PAGES", "MARKETPLACE"].includes(item.label) && (
                <ChevronDown className="h-3 w-3 opacity-70" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-sm">
          <a href="#" className="hidden md:inline-flex items-center gap-1.5 hover:text-primary transition-colors">
            <User className="h-4 w-4" /> Login or Register
          </a>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-primary" /> Hotline (+1)234 567 890
          </span>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-navy-deep">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <button className="flex items-center gap-3 rounded-sm bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-95">
            <span className="grid h-4 w-4 place-items-center">
              <span className="block h-0.5 w-4 bg-current" />
            </span>
            ALL CATEGORIES
            <ChevronDown className="h-4 w-4" />
          </button>

          <div className="flex flex-1 items-stretch rounded-sm bg-background overflow-hidden">
            <button className="flex items-center gap-1 border-r border-border px-4 text-sm text-foreground/80 hover:text-foreground">
              All Categories <ChevronDown className="h-3 w-3" />
            </button>
            <input
              type="search"
              placeholder="Keyword here..."
              className="flex-1 px-4 text-sm text-foreground outline-none"
            />
            <button className="bg-primary px-5 text-primary-foreground hover:opacity-95">
              <Search className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 hover:border-primary hover:text-primary transition-colors">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 hover:border-primary hover:text-primary transition-colors">
              <Heart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">3</span>
            </button>
            <button className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold hover:text-primary transition-colors">
              <span className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">3</span>
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[11px] opacity-70 font-normal">MY CART</span>
                <span className="text-primary">$0.00</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
