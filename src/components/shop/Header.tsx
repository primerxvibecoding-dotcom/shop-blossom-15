import { Heart, RefreshCw, ShoppingCart, User, Phone, Search, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { useSession } from "@/hooks/use-session";
import { getCart } from "@/lib/cart.functions";
import { getMyRoles } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

const mainNav = [
  { label: "HOME", to: "/" },
  { label: "SHOP", to: "/catalog" },
  { label: "DEALS", to: "/catalog", search: { category: undefined } as any },
];

export function Header() {
  const navigate = useNavigate();
  const { user } = useSession();
  const [q, setQ] = useState("");

  const getCartFn = useServerFn(getCart);
  const getRolesFn = useServerFn(getMyRoles);
  const { data: cart } = useQuery({ queryKey: ["cart"], queryFn: () => getCartFn(), enabled: !!user });
  const { data: roles } = useQuery({ queryKey: ["roles"], queryFn: () => getRolesFn(), enabled: !!user });

  const cartCount = (cart?.items ?? []).reduce((s: number, i: any) => s + i.quantity, 0);
  const cartTotal = (cart?.items ?? []).reduce((s: number, i: any) => s + Number(i.unit_price) * i.quantity, 0);
  const isAdmin = (roles ?? []).some((r: string) => ["super_admin", "admin", "manager"].includes(r));

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/catalog", search: q ? { q } : {} });
  }

  return (
    <header className="bg-navy text-navy-foreground">
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-4">
        <Link to="/" className="flex items-baseline gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-bold">e</div>
          <div className="leading-none">
            <div className="font-display text-2xl font-bold tracking-tight">market</div>
            <div className="text-[10px] opacity-60 tracking-widest">ALL IN ONE STORE</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
          {mainNav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-primary inline-flex items-center gap-1" }}
              inactiveProps={{ className: "inline-flex items-center gap-1 transition-colors hover:text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="hidden md:inline-flex items-center gap-1.5 hover:text-primary">
                  <LayoutDashboard className="h-4 w-4" /> Admin
                </Link>
              )}
              <Link to="/account" className="hidden md:inline-flex items-center gap-1.5 hover:text-primary">
                <User className="h-4 w-4" /> {user.email?.split("@")[0]}
              </Link>
              <button
                onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
                className="hidden md:inline-flex items-center gap-1 hover:text-primary"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link to="/auth" className="hidden md:inline-flex items-center gap-1.5 hover:text-primary">
              <User className="h-4 w-4" /> Login or Register
            </Link>
          )}
          <span className="hidden xl:inline-flex items-center gap-1.5">
            <Phone className="h-4 w-4 text-primary" /> (+1) 234 567 890
          </span>
        </div>
      </div>

      <div className="bg-navy-deep">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Link to="/catalog" className="flex items-center gap-3 rounded-sm bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:opacity-95">
            <span className="grid h-4 w-4 place-items-center">
              <span className="block h-0.5 w-4 bg-current" />
            </span>
            ALL CATEGORIES
            <ChevronDown className="h-4 w-4" />
          </Link>

          <form onSubmit={onSearch} className="flex flex-1 items-stretch rounded-sm bg-background overflow-hidden">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="flex-1 px-4 text-sm text-foreground outline-none"
            />
            <button type="submit" className="bg-primary px-5 text-primary-foreground hover:opacity-95">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/catalog" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 hover:border-primary hover:text-primary transition-colors" title="Compare">
              <RefreshCw className="h-4 w-4" />
            </Link>
            <Link to={user ? "/account" : "/auth"} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 hover:border-primary hover:text-primary transition-colors" title="Wishlist">
              <Heart className="h-4 w-4" />
            </Link>
            <Link to="/cart" className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm font-semibold hover:text-primary">
              <span className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </span>
              <span className="flex flex-col items-start leading-tight">
                <span className="text-[11px] opacity-70 font-normal">MY CART</span>
                <span className="text-primary">${cartTotal.toFixed(2)}</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
