"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { formatPrice } from "@/lib/configurator-utils";
import { ChevronUp, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function PriceBadge() {
  const pricing = useConfiguratorStore((state) => state.pricing);
  const quantity = useConfiguratorStore((state) => state.quantity);
  const isPricingDrawerOpen = useConfiguratorStore(
    (state) => state.isPricingDrawerOpen
  );
  const togglePricingDrawer = useConfiguratorStore(
    (state) => state.togglePricingDrawer
  );
  const [priceChanged, setPriceChanged] = useState(false);
  const [prevPrice, setPrevPrice] = useState(pricing.total);

  const totalPrice = pricing.total * quantity;

  // Detect price changes and trigger animation
  useEffect(() => {
    const currentTotal = pricing.total * quantity;
    if (currentTotal !== prevPrice) {
      setPriceChanged(true);
      setPrevPrice(currentTotal);
      const timer = setTimeout(() => setPriceChanged(false), 600);
      return () => clearTimeout(timer);
    }
  }, [pricing.total, quantity, prevPrice]);

  return (
    <>
      {/* Desktop: Bottom left */}
      <button
        onClick={togglePricingDrawer}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 1000,
          display: 'none',
          height: '64px',
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, var(--luxury-black) 0%, var(--luxury-navy) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--luxury-gold)',
          borderRadius: '1rem',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 12px 48px rgba(212, 175, 55, 0.25)',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        className="lg:flex"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 16px 60px rgba(212, 175, 55, 0.40)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(212, 175, 55, 0.25)';
        }}
        aria-label="View pricing details"
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--luxury-gray-500)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {quantity > 1 ? `Total (${quantity} pens)` : "Total"}
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--luxury-gold)'
          }}>
            {formatPrice(totalPrice)}
          </div>
        </div>
        <ChevronUp
          style={{
            width: '20px',
            height: '20px',
            stroke: 'var(--luxury-gold)',
            transition: 'transform 0.3s',
            transform: isPricingDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Mobile: Bottom center */}
      <button
        onClick={togglePricingDrawer}
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          height: '64px',
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, var(--luxury-black) 0%, var(--luxury-navy) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid var(--luxury-gold)',
          borderRadius: '1rem',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 12px 48px rgba(212, 175, 55, 0.25)',
          cursor: 'pointer',
          transition: 'all 0.3s'
        }}
        className="lg:hidden"
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 16px 60px rgba(212, 175, 55, 0.40)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 48px rgba(212, 175, 55, 0.25)';
        }}
        aria-label="View pricing details"
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--luxury-gray-500)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {quantity > 1 ? `Total (${quantity} pens)` : "Total"}
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--luxury-gold)'
          }}>
            {formatPrice(totalPrice)}
          </div>
        </div>
        <ChevronUp
          style={{
            width: '20px',
            height: '20px',
            stroke: 'var(--luxury-gold)',
            transition: 'transform 0.3s',
            transform: isPricingDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>
    </>
  );
}
