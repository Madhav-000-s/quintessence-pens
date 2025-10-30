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
    <div className={cn(className)}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--luxury-gold)',
        borderRadius: '0.5rem',
        background: '#ffffff',
        height: '48px',
        width: '120px',
        overflow: 'hidden'
      }}>
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          disabled={isAtMin}
          style={{
            width: '40px',
            height: '46px',
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
          fontSize: '0.9375rem',
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
            height: '46px',
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
    </div>
  );
}
