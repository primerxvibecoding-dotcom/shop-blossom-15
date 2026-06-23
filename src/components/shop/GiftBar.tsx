import { Gift } from "lucide-react";

export function GiftBar() {
  return (
    <div className="flex items-center gap-0 overflow-hidden rounded-sm bg-card border border-border">
      <div className="flex items-center gap-2 bg-primary px-5 py-3 text-primary-foreground text-sm font-bold">
        <Gift className="h-4 w-4" />
        Gift Special
        <span className="ml-2 inline-block w-0 h-0 border-y-[14px] border-y-transparent border-l-[10px] border-l-primary translate-x-5" />
      </div>
      <p className="flex-1 px-6 py-3 text-sm text-foreground/75">
        Wrap new offers / gift every single day on Weekends — New Coupon code: <span className="font-semibold">Happy2017</span>
      </p>
      <button className="mr-3 rounded-sm bg-primary px-4 py-2 text-xs font-bold uppercase text-primary-foreground hover:opacity-95">
        Get Coupon
      </button>
    </div>
  );
}
