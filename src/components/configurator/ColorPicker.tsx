"use client";

import { useState, useEffect } from "react";
import { useConfiguratorStore } from "@/lib/store/configurator";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { fetchDesigns } from "@/lib/supabase/configurator-api";
import { adaptDesignsToColors, type ColorDesignOption } from "@/lib/adapters/configurator-adapters";

export function ColorPicker() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);
  const [colors, setColors] = useState<ColorDesignOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      setIsLoading(true);
      try {
        const dbDesigns = await fetchDesigns();
        const adaptedColors = adaptDesignsToColors(dbDesigns);
        setColors(adaptedColors);
      } catch (error) {
        console.error("Failed to load colors:", error);
        // Fallback to default colors
        setColors(adaptDesignsToColors([]));
      } finally {
        setIsLoading(false);
      }
    };

    loadColors();
  }, []);

  const handleColorSelect = (color: ColorDesignOption) => {
    updateConfig("bodyColor", color.hex);
    updateConfig("designId", color.designId);
  };

  const categories = ["neutral", "warm", "cool", "metallic", "vibrant"] as const;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Body Color</h3>
        <p className="text-sm text-muted-foreground">
          Choose the color for your pen body
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {categories.map((category) => {
            const categoryColors = colors.filter((c) => c.category === category);

            if (categoryColors.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h4 className="text-sm font-medium capitalize text-muted-foreground">
                  {category}
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => handleColorSelect(color)}
                      className={cn(
                        "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105",
                        config.bodyColor === color.hex
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-transparent hover:border-primary/50"
                      )}
                      title={`${color.name}${color.cost > 0 ? ` (+$${color.cost})` : ""}`}
                    >
                      <div
                        className="h-full w-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      {config.bodyColor === color.hex && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Check className="h-5 w-5 text-white drop-shadow-lg" />
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-1 py-1 text-center text-xs text-white backdrop-blur-sm transition-transform group-hover:translate-y-0">
                        {color.name}
                        {color.cost > 0 && <span className="block text-[10px]">+${color.cost}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
