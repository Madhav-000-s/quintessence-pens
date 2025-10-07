"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { formatPrice } from "@/lib/configurator-utils";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function AddToCartButton() {
  const pricing = useConfiguratorStore((state) => state.pricing);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Simulate adding to cart
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Here you would typically dispatch to cart state or API
    console.log("Added to cart");

    setIsAdding(false);

    // Optional: Show success feedback
    alert("Added to cart!");
  };

  return (
    <div className="border-t bg-card p-4">
      <Button
        onClick={handleAddToCart}
        disabled={isAdding}
        size="lg"
        className="w-full gap-2"
      >
        <ShoppingCart className="h-5 w-5" />
        <span>Add to Cart</span>
        <span className="ml-auto font-bold">{formatPrice(pricing.total)}</span>
      </Button>
    </div>
  );
}
