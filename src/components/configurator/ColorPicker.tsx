"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { bodyColorPalette } from "@/lib/configurator-utils";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ColorPicker() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);

  const categories = ["neutral", "warm", "cool", "metallic", "vibrant"] as const;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Body Color</h3>
        <p className="text-sm text-muted-foreground">
          Choose the color for your pen body
        </p>
      </div>

      {categories.map((category) => {
        const colors = bodyColorPalette.filter((c) => c.category === category);

        return (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-medium capitalize text-muted-foreground">
              {category}
            </h4>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => updateConfig("bodyColor", color.hex)}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-lg border-2 transition-all hover:scale-105",
                    config.bodyColor === color.hex
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent hover:border-primary/50"
                  )}
                  title={color.name}
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
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
