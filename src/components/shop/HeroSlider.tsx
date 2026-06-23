import heroImg from "@/assets/hero-furniture.jpg";
import pillows from "@/assets/promo-pillows.jpg";
import sofa from "@/assets/promo-sofa.jpg";

export function HeroSlider() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
      {/* Main slider */}
      <div className="relative overflow-hidden rounded-sm bg-muted">
        <img src={heroImg} alt="Office furniture sale" className="h-[340px] w-full object-cover" width={1024} height={1024} />
        <div className="absolute inset-0 flex flex-col justify-center px-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-foreground/70">Office furniture</p>
          <h2 className="mt-2 font-display text-5xl font-bold text-primary leading-none">
            SALE UP TO <br /> 50% OFF
          </h2>
          <p className="mt-3 max-w-xs text-xs text-foreground/70">
            The key is to have every key to your open every door.
          </p>
          <button className="mt-5 w-fit rounded-sm bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-primary-foreground hover:opacity-95 transition-opacity">
            Shop Now
          </button>
        </div>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          <span className="h-1.5 w-6 rounded-full bg-primary" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
        </div>
      </div>

      {/* Side banners */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
        <div className="relative overflow-hidden rounded-sm bg-card border border-border p-3">
          <img src={pillows} alt="Colorful Pillows" className="h-32 w-full object-contain" loading="lazy" width={512} height={512} />
          <div className="mt-2">
            <p className="text-xs font-semibold uppercase text-navy">Colorful Pillows</p>
            <p className="text-sm font-bold text-primary">$29.89</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-sm bg-card border border-border p-3">
          <img src={sofa} alt="Interior Design" className="h-32 w-full object-contain" loading="lazy" width={512} height={512} />
          <div className="mt-2">
            <p className="text-sm font-bold text-primary">$49.89</p>
            <p className="text-xs font-semibold uppercase text-navy">Interior Design</p>
          </div>
        </div>
      </div>
    </div>
  );
}
