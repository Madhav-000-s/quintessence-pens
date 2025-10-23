"use client";

import { useState } from "react";
import { Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 50,
  className,
}: QuantitySelectorProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
      triggerAnimation();
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
      triggerAnimation();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const isAtMin = value <= min;
  const isAtMax = value >= max;

  return (
    <div className={cn("quantity-luxury space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package style={{ width: '20px', height: '20px', stroke: 'var(--luxury-gray-700)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--luxury-black)' }}>
            Quantity
          </span>
        </div>
        {max > 10 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--luxury-gray-500)' }}>
            Max: {max}
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        border: '1.5px solid var(--luxury-gray-300)',
        borderRadius: '0.5rem',
        background: '#ffffff',
        height: '40px',
        width: '120px',
        overflow: 'hidden',
        marginTop: '0.5rem'
      }}>
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          disabled={isAtMin}
          style={{
            width: '40px',
            height: '38px',
            border: 'none',
            background: 'transparent',
            cursor: isAtMin ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            opacity: isAtMin ? 0.5 : 1
          }}
          onMouseEnter={(e) => !isAtMin && (e.currentTarget.style.background = 'var(--luxury-gold)')}
          onMouseLeave={(e) => !isAtMin && (e.currentTarget.style.background = 'transparent')}
        >
          <Minus style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Quantity Display */}
        <div style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 600,
          color: 'var(--luxury-black)'
        }}>
          {value}
        </div>

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          disabled={isAtMax}
          style={{
            width: '40px',
            height: '38px',
            border: 'none',
            background: 'transparent',
            cursor: isAtMax ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            opacity: isAtMax ? 0.5 : 1
          }}
          onMouseEnter={(e) => !isAtMax && (e.currentTarget.style.background = 'var(--luxury-gold)')}
          onMouseLeave={(e) => !isAtMax && (e.currentTarget.style.background = 'transparent')}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
        </button>
      </div>

      {/* Bulk Order Info */}
      {value >= 5 && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
          <div style={{
            borderRadius: '0.25rem',
            background: 'linear-gradient(to bottom, rgba(240, 217, 125, 0.1), rgba(212, 175, 55, 0.1))',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            padding: '0.5rem 0.75rem',
            fontSize: '0.75rem',
            color: 'var(--luxury-gold-dark)'
          }}>
            <span style={{ fontWeight: 600 }}>Bulk Order:</span> Consider contacting
            us for custom pricing on orders of 10+
          </div>
        </div>
      )}
    </div>
  );
}
