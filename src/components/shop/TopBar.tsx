import { ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-navy-deep text-navy-foreground text-xs">
      <div className="container mx-auto flex h-9 items-center justify-between px-4">
        <div className="flex items-center gap-2 opacity-90">
          <span>Welcome to Emarket!</span>
          <span className="hidden sm:inline opacity-70">| Wrap new offers / gift every single day on Weekends — New Coupon code: Happy2017</span>
        </div>
        <div className="hidden md:flex items-center gap-6 opacity-90">
          <button className="inline-flex items-center gap-1 hover:text-primary transition-colors">$ US Dollar <ChevronDown className="h-3 w-3" /></button>
          <button className="inline-flex items-center gap-1 hover:text-primary transition-colors">English <ChevronDown className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
}
