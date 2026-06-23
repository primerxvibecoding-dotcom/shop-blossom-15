import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const cols = [
  {
    title: "Information",
    links: ["About Us", "Customer Service", "Privacy Policy", "Site Map", "Gift Certificates", "Affiliates"],
  },
  {
    title: "Extras",
    links: ["Brands", "Specials", "Gift Vouchers", "Affiliate", "Returns", "Order History"],
  },
  {
    title: "My Account",
    links: ["My Account", "Order History", "Wishlist", "Newsletter", "Returns", "Order Tracking"],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-navy text-navy-foreground">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row">
          <div>
            <h4 className="font-display text-lg font-bold">Sign up to our newsletter</h4>
            <p className="text-sm opacity-70">Receive our latest offers and product news.</p>
          </div>
          <form className="flex w-full max-w-md items-stretch overflow-hidden rounded-sm bg-background">
            <input type="email" placeholder="Enter your email..." className="flex-1 px-4 text-sm text-foreground outline-none" />
            <button className="bg-primary px-6 text-sm font-bold text-primary-foreground hover:opacity-95">SUBSCRIBE</button>
          </form>
        </div>
      </div>

      <div className="container mx-auto grid grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <a href="/" className="flex items-baseline gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-bold">e</div>
            <div className="leading-none">
              <div className="font-display text-2xl font-bold">market</div>
              <div className="text-[10px] opacity-60 tracking-widest">ALL IN ONE STORE</div>
            </div>
          </a>
          <p className="mt-4 text-sm opacity-70">
            We are a team of designers and developers building modern shopping experiences for everyone.
          </p>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> 123 Suspendis matti, Visaosang Building Road, NY</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> (+1)234 567 890</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> contact@emarket.com</li>
          </ul>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h5 className="mb-4 font-display font-bold uppercase tracking-wide text-sm">{col.title}</h5>
            <ul className="space-y-2 text-sm opacity-80">
              {col.links.map((l) => (
                <li key={l}><a href="#" className="transition-colors hover:text-primary">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-4 text-xs opacity-80 md:flex-row">
          <p>© 2025 Emarket. All Rights Reserved.</p>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition-colors hover:bg-primary">
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
