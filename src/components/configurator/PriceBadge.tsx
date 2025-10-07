"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { formatPrice } from "@/lib/configurator-utils";
import { ChevronUp, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function PriceBadge() {
  const pricing = useConfiguratorStore((state) => state.pricing);
  const isPricingDrawerOpen = useConfiguratorStore(
    (state) => state.isPricingDrawerOpen
  );
  const togglePricingDrawer = useConfiguratorStore(
    (state) => state.togglePricingDrawer
  );
  const [priceChanged, setPriceChanged] = useState(false);
  const [prevPrice, setPrevPrice] = useState(pricing.total);

  // Detect price changes and trigger animation
  useEffect(() => {
    if (pricing.total !== prevPrice) {
      setPriceChanged(true);
      setPrevPrice(pricing.total);
      const timer = setTimeout(() => setPriceChanged(false), 600);
      return () => clearTimeout(timer);
    }
  }, [pricing.total, prevPrice]);

  return (
    <>
      {/* Desktop: Bottom left */}
      <button
        onClick={togglePricingDrawer}
        className={cn(
          "group fixed bottom-6 left-6 z-50 hidden lg:flex",
          "items-center gap-3 rounded-full border bg-card/95 px-5 py-3",
          "shadow-lg backdrop-blur-sm transition-all duration-300",
          "hover:shadow-xl hover:scale-105",
          isPricingDrawerOpen && "bg-primary text-primary-foreground",
          priceChanged && "ring-2 ring-primary ring-offset-2"
        )}
        aria-label="View pricing details"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <div className="text-left">
            <p className="text-xs font-medium opacity-80">Total</p>
            <p className="text-lg font-bold tabular-nums">
              {formatPrice(pricing.total)}
            </p>
          </div>
        </div>
        <ChevronUp
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isPricingDrawerOpen && "rotate-180"
          )}
        />
      </button>

      {/* Mobile: Bottom center */}
      <button
        onClick={togglePricingDrawer}
        className={cn(
          "group fixed bottom-6 left-1/2 z-50 flex lg:hidden",
          "-translate-x-1/2 transform",
          "items-center gap-3 rounded-full border bg-card/95 px-6 py-3",
          "shadow-lg backdrop-blur-sm transition-all duration-300",
          "hover:shadow-xl",
          isPricingDrawerOpen && "bg-primary text-primary-foreground",
          priceChanged && "ring-2 ring-primary ring-offset-2"
        )}
        aria-label="View pricing details"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          <div className="text-left">
            <p className="text-xs font-medium opacity-80">Total</p>
            <p className="text-lg font-bold tabular-nums">
              {formatPrice(pricing.total)}
            </p>
          </div>
        </div>
        <ChevronUp
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isPricingDrawerOpen && "rotate-180"
          )}
        />
      </button>
    </>
  );
}
