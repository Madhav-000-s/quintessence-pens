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
  const quantity = useConfiguratorStore((state) => state.quantity);
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
    { label: "Design & Pattern", amount: pricing.designCost },
    { label: "Coating & Finish", amount: pricing.coatingCost },
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
          "fixed left-0 top-0 bottom-0 z-50 w-full max-w-md transition-transform duration-300 ease-out",
          "border-r bg-card shadow-2xl overflow-y-auto",
          isPricingDrawerOpen
            ? "translate-x-0"
            : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-drawer-title"
      >
        <div className="space-y-4 p-6 h-full">
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

          {/* Subtotal (per pen) */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
            <span className="font-medium">Subtotal (per pen)</span>
            <span className="text-xl font-bold tabular-nums">
              {formatPrice(pricing.total)}
            </span>
          </div>

          {/* Quantity Info */}
          {quantity > 1 && (
            <div className="space-y-2 rounded-lg bg-primary/5 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-bold">{quantity} pens</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Grand Total</span>
                <span className="text-3xl font-bold tabular-nums text-primary">
                  {formatPrice(pricing.total * quantity)}
                </span>
              </div>
            </div>
          )}

          {/* Total (single pen) */}
          {quantity === 1 && (
            <div className="flex items-center justify-between rounded-lg bg-primary/10 p-4">
              <span className="text-lg font-bold">Total</span>
              <span className="text-3xl font-bold tabular-nums text-primary">
                {formatPrice(pricing.total)}
              </span>
            </div>
          )}

          {/* Info */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <Check className="h-3 w-3" />
            <span>Handcrafted to order • 4-6 weeks delivery</span>
          </div>
        </div>
      </div>
    </>
  );
}
