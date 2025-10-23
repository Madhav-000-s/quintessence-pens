"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/configurator-utils";
import { ShoppingCart, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { validateConfiguration } from "@/lib/validation/config-validation";
import { QuantitySelector } from "./QuantitySelector";

const PROGRESS_STEPS = {
  cap: "Creating cap configuration...",
  barrel: "Creating barrel configuration...",
  nib: "Creating nib configuration...",
  ink: "Creating ink configuration...",
  pen: "Assembling your pen...",
  cart: "Adding to cart...",
};

export function AddToCartButton() {
  const pricing = useConfiguratorStore((state) => state.pricing);
  const config = useConfiguratorStore((state) => state.config);
  const quantity = useConfiguratorStore((state) => state.quantity);
  const setQuantity = useConfiguratorStore((state) => state.setQuantity);
  const saveConfiguration = useConfiguratorStore((state) => state.saveConfiguration);
  const isSaving = useConfiguratorStore((state) => state.isSaving);
  const saveProgress = useConfiguratorStore((state) => state.saveProgress);
  const saveError = useConfiguratorStore((state) => state.saveError);

  const addCartItem = useCartStore((state) => state.addItem);
  const fetchCart = useCartStore((state) => state.fetchCart);

  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset success message after a delay
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleAddToCart = async () => {
    // Validate configuration first
    const validation = validateConfiguration(config);
    if (!validation.valid) {
      setValidationError(validation.errors[0] || "Invalid configuration");
      setTimeout(() => setValidationError(null), 5000);
      return;
    }

    setValidationError(null);

    try {
      // Save configuration (creates all configs + pen + adds to cart)
      const result = await saveConfiguration();

      if (result) {
        // Refresh cart to show new item
        await fetchCart();
        setShowSuccess(true);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const getButtonContent = () => {
    if (showSuccess) {
      return (
        <>
          <CheckCircle2 className="h-5 w-5" />
          <span>Added to Cart!</span>
        </>
      );
    }

    if (isSaving && saveProgress) {
      return (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">{PROGRESS_STEPS[saveProgress]}</span>
        </>
      );
    }

    if (isSaving) {
      return (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Processing...</span>
        </>
      );
    }

    const itemText = quantity === 1 ? "Add to Cart" : `Add ${quantity} to Cart`;
    return (
      <>
        <ShoppingCart className="h-5 w-5" />
        <span>{itemText}</span>
        <span className="ml-auto font-bold">{formatPrice(pricing.total * quantity)}</span>
      </>
    );
  };

  const unitPrice = pricing.total;
  const totalPrice = unitPrice * quantity;

  return (
    <div className="border-t bg-card p-4 space-y-4">
      {/* Quantity Selector */}
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        min={1}
        max={50}
      />

      <Separator />

      {/* Price Summary */}
      {quantity > 1 && (
        <div className="space-y-1 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price per pen:</span>
            <span className="font-medium tabular-nums">{formatPrice(unitPrice)}</span>
          </div>
          <div className="flex items-center justify-between text-sm font-bold">
            <span>Total for {quantity} pens:</span>
            <span className="text-lg text-primary tabular-nums">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isSaving || showSuccess}
        size="lg"
        className="w-full gap-2"
        variant={showSuccess ? "default" : "default"}
      >
        {getButtonContent()}
      </Button>

      {/* Validation Error */}
      {validationError && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Save Error */}
      {saveError && !isSaving && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Progress Indicator */}
      {isSaving && saveProgress && (
        <div className="space-y-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${
                  saveProgress === "cap"
                    ? 16
                    : saveProgress === "barrel"
                    ? 33
                    : saveProgress === "nib"
                    ? 50
                    : saveProgress === "ink"
                    ? 66
                    : saveProgress === "pen"
                    ? 83
                    : saveProgress === "cart"
                    ? 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
