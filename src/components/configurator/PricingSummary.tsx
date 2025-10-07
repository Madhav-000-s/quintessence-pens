"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { formatPrice } from "@/lib/configurator-utils";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Check, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

export function PricingSummary() {
  const pricing = useConfiguratorStore((state) => state.pricing);
  const isPricingDrawerOpen = useConfiguratorStore(
    (state) => state.isPricingDrawerOpen
  );
  const setPricingDrawerOpen = useConfiguratorStore(
    (state) => state.setPricingDrawerOpen
  );
  const drawerRef = useRef<HTMLDivElement>(null);

  const items = [
    { label: "Base Pen", amount: pricing.basePrice },
    { label: "Body Material", amount: pricing.bodyMaterialCost },
    { label: "Nib Upgrade", amount: pricing.nibMaterialCost },
    { label: "Trim Finish", amount: pricing.trimCost },
    { label: "Engraving", amount: pricing.engravingCost },
  ].filter((item) => item.amount > 0);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPricingDrawerOpen) {
        setPricingDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isPricingDrawerOpen, setPricingDrawerOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isPricingDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        // Check if click is on the price badge
        const target = e.target as HTMLElement;
        if (!target.closest('[aria-label="View pricing details"]')) {
          setPricingDrawerOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPricingDrawerOpen, setPricingDrawerOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isPricingDrawerOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-2xl transition-transform duration-300 ease-out",
          "rounded-t-2xl border-t bg-card shadow-2xl",
          "lg:bottom-24 lg:left-8 lg:right-auto lg:rounded-2xl lg:border",
          isPricingDrawerOpen
            ? "translate-y-0"
            : "translate-y-full lg:translate-y-[120%]"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-drawer-title"
      >
        {/* Drawer Handle (mobile only) */}
        <div className="flex justify-center pt-3 lg:hidden">
          <div className="h-1 w-12 rounded-full bg-muted" />
        </div>

        <div className="space-y-4 p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 id="pricing-drawer-title" className="flex items-center gap-2 text-xl font-bold">
                <TrendingUp className="h-5 w-5 text-primary" />
                Price Summary
              </h3>
              <p className="text-sm text-muted-foreground">
                Your custom configuration
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPricingDrawerOpen(false)}
              className="shrink-0"
              aria-label="Close pricing details"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm animate-in fade-in slide-in-from-left-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium tabular-nums">
                  {formatPrice(item.amount)}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-3xl font-bold tabular-nums text-primary">
              {formatPrice(pricing.total)}
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3 w-3" />
              <span>Handcrafted to order • 4-6 weeks delivery</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
