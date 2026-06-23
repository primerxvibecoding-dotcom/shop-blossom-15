import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/shop/TopBar";
import { Header } from "@/components/shop/Header";
import { CategoryMenu } from "@/components/shop/CategoryMenu";
import { HeroSlider } from "@/components/shop/HeroSlider";
import { GiftBar } from "@/components/shop/GiftBar";
import { SectionTitle } from "@/components/shop/SectionTitle";
import { DealCard } from "@/components/shop/DealCard";
import { ProductCard } from "@/components/shop/ProductCard";
import { MiniProduct } from "@/components/shop/MiniProduct";
import { ServiceStrip } from "@/components/shop/ServiceStrip";
import { Footer } from "@/components/shop/Footer";
import { dailyDeals, trending, latest, trendingTabs } from "@/data/shop";
import sidebarImg from "@/assets/sidebar-interior.jpg";
import bannerTowel from "@/assets/banner-towel.jpg";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Emarket — All in One Store" },
      { name: "description", content: "Modern multi-purpose e-commerce store: furniture, decor, fashion, electronics and more. Daily deals, trending items and fast delivery." },
      { property: "og:title", content: "Emarket — All in One Store" },
      { property: "og:description", content: "Daily deals, trending items and fast delivery on a modern multi-purpose store." },
    ],
  }),
  component: Home,
});

function Home() {
  const [tab, setTab] = useState("All");

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Top grid: sidebar menu + hero */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <div className="hidden lg:block"><CategoryMenu /></div>
          <HeroSlider />
        </div>

        <GiftBar />

        {/* Daily deals + side promo column */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <div className="space-y-4 hidden lg:block">
            <div className="relative overflow-hidden rounded-sm bg-card border border-border">
              <img src={sidebarImg} alt="Interior design promo" loading="lazy" width={512} height={512} className="h-64 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
              <div className="absolute left-4 top-4 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground">ON</div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-bold text-primary">$49.89</p>
                <p className="text-xs font-semibold uppercase text-navy">Interior Design</p>
                <button className="mt-2 rounded-sm bg-navy px-4 py-1.5 text-[10px] font-bold uppercase text-navy-foreground hover:bg-primary transition-colors">
                  Shop now
                </button>
              </div>
            </div>
          </div>

          <section className="space-y-4">
            <SectionTitle title="Daily Deals" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {dailyDeals.map((p, i) => (
                <DealCard key={p.id} product={p} countdown={i === 0 ? [249, 7, 41, 36] : [399, 7, 41, 36]} />
              ))}
            </div>
            <div className="flex justify-center gap-1.5">
              <span className="h-1.5 w-6 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
            </div>
          </section>
        </div>

        {/* Big horizontal banner */}
        <div className="relative overflow-hidden rounded-sm">
          <img src={bannerTowel} alt="Jacquard Warp Knitted Microfiber Towel" loading="lazy" width={1024} height={512} className="h-56 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-between bg-gradient-to-r from-background/95 via-background/70 to-transparent px-8">
            <div className="grid h-24 w-24 place-items-center rounded-full bg-primary text-center text-primary-foreground">
              <div>
                <div className="text-2xl font-bold leading-none">75%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider">OFF</div>
              </div>
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-display text-2xl font-bold text-navy">Jacquard Warp Knitted Microfiber Towel</h3>
              <p className="mt-1 text-sm text-foreground/70">This bag is to have every key to your open every door.</p>
              <button className="mt-3 rounded-sm bg-primary px-5 py-2 text-xs font-bold uppercase text-primary-foreground hover:opacity-95">Shop Now</button>
            </div>
          </div>
        </div>

        {/* Latest products column + trending */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <div className="space-y-6 hidden lg:block">
            <div className="rounded-sm border border-border bg-card p-4 shadow-card">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <h4 className="text-sm font-bold uppercase tracking-wide text-navy">Latest Products</h4>
                <div className="flex gap-1">
                  <span className="h-1.5 w-3 rounded-full bg-primary" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
              {latest.map((p) => <MiniProduct key={p.id} product={p} />)}
            </div>

            <ServiceStrip />
          </div>

          <section className="space-y-4">
            <SectionTitle
              title="Trending Items"
              right={
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                  {trendingTabs.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`uppercase tracking-wide transition-colors ${
                        tab === t ? "text-primary" : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              }
              withNav={false}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {trending.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
