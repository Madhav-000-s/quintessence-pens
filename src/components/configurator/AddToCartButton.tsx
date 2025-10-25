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
    <div style={{ borderTop: '1px solid var(--luxury-gold)', padding: '0.75rem', background: '#ffffff' }}>
      {/* Quantity Selector and Add to Cart Button in Same Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Quantity Selector */}
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={50}
        />

        {/* Add to Cart Button */}
        <button
        onClick={handleAddToCart}
        disabled={isSaving || showSuccess}
        style={{
          flex: 1,
          height: '48px',
          background: showSuccess
            ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
            : 'linear-gradient(135deg, var(--luxury-black) 0%, var(--luxury-navy) 100%)',
          border: showSuccess ? '1px solid #16a34a' : '1px solid var(--luxury-gold)',
          color: showSuccess ? '#ffffff' : 'var(--luxury-gold)',
          borderRadius: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.25rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: isSaving || showSuccess ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.25)',
          transition: 'all 0.3s',
          opacity: isSaving || showSuccess ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!isSaving && !showSuccess) {
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--luxury-gold) 0%, var(--luxury-gold-light) 100%)';
            e.currentTarget.style.color = 'var(--luxury-black)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.40)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSaving && !showSuccess) {
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--luxury-black) 0%, var(--luxury-navy) 100%)';
            e.currentTarget.style.color = 'var(--luxury-gold)';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showSuccess ? (
            <CheckCircle2 style={{ width: '20px', height: '20px' }} />
          ) : isSaving ? (
            <Loader2 style={{ width: '20px', height: '20px' }} className="animate-spin" />
          ) : (
            <ShoppingCart style={{ width: '20px', height: '20px' }} />
          )}
          <span>
            {showSuccess
              ? "Added to Cart!"
              : isSaving && saveProgress
                ? PROGRESS_STEPS[saveProgress]
                : isSaving
                  ? "Processing..."
                  : quantity === 1 ? "Add to Cart" : `Add ${quantity} to Cart`}
          </span>
        </div>
        {!showSuccess && !isSaving && (
          <span style={{ fontWeight: 700 }}>{formatPrice(totalPrice)}</span>
        )}
      </button>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div style={{
          marginTop: '0.625rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.625rem',
          borderRadius: '0.375rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          fontSize: '0.8125rem',
          color: '#dc2626'
        }}>
          <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          <span>{validationError}</span>
        </div>
      )}

      {/* Save Error */}
      {saveError && !isSaving && (
        <div style={{
          marginTop: '0.625rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.625rem',
          borderRadius: '0.375rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          fontSize: '0.8125rem',
          color: '#dc2626'
        }}>
          <AlertCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          <span>{saveError}</span>
        </div>
      )}

      {/* Progress Indicator */}
      {isSaving && saveProgress && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{
            width: '100%',
            height: '3px',
            background: 'rgba(212, 175, 55, 0.2)',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, var(--luxury-gold) 0%, var(--luxury-gold-light) 100%)',
                transition: 'all 0.5s',
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
                }%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
