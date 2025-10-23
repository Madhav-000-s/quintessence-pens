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
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Quantity
          </span>
        </div>
        {max > 10 && (
          <span className="text-xs text-muted-foreground">
            Max: {max}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Decrement Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={isAtMin}
                className={cn(
                  "h-10 w-10 shrink-0 rounded-lg transition-all",
                  isAtMin && "opacity-50 cursor-not-allowed",
                  !isAtMin && "hover:bg-primary hover:text-primary-foreground"
                )}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            {isAtMin && (
              <TooltipContent>Minimum quantity reached</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Quantity Display/Input */}
        <div className="relative flex-1">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            className={cn(
              "h-10 w-full rounded-lg border bg-background text-center text-lg font-bold transition-all",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "appearance-none",
              "[&::-webkit-inner-spin-button]:appearance-none",
              "[&::-webkit-outer-spin-button]:appearance-none",
              isAnimating && "scale-110"
            )}
            aria-label="Quantity"
          />
        </div>

        {/* Increment Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={isAtMax}
                className={cn(
                  "h-10 w-10 shrink-0 rounded-lg transition-all",
                  isAtMax && "opacity-50 cursor-not-allowed",
                  !isAtMax && "hover:bg-primary hover:text-primary-foreground"
                )}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            {isAtMax && (
              <TooltipContent>Maximum quantity reached</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Bulk Order Info */}
      {value >= 5 && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="rounded-md bg-primary/10 px-3 py-2 text-xs text-primary">
            <span className="font-medium">Bulk Order:</span> Consider contacting
            us for custom pricing on orders of 10+
          </div>
        </div>
      )}
    </div>
  );
}
