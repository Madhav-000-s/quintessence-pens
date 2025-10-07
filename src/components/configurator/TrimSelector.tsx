"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { getTrimProperties } from "@/lib/configurator-utils";
import { cn } from "@/lib/utils";
import type { TrimFinish, ClipStyle } from "@/types/configurator";
import { Check } from "lucide-react";

const trimFinishes: Array<{ value: TrimFinish; label: string }> = [
  { value: "rhodium", label: "Rhodium" },
  { value: "yellow-gold", label: "Yellow Gold" },
  { value: "rose-gold", label: "Rose Gold" },
  { value: "platinum", label: "Platinum" },
  { value: "black-chrome", label: "Black Chrome" },
  { value: "brushed-steel", label: "Brushed Steel" },
];

const clipStyles: Array<{ value: ClipStyle; label: string; description: string }> = [
  { value: "classic", label: "Classic", description: "Traditional elegance" },
  { value: "modern", label: "Modern", description: "Contemporary design" },
  { value: "minimalist", label: "Minimalist", description: "Sleek simplicity" },
  { value: "arrow", label: "Arrow", description: "Iconic signature style" },
];

export function TrimSelector() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Trim & Hardware</h3>
        <p className="text-sm text-muted-foreground">
          Select finishes for your pen's accents
        </p>
      </div>

      {/* Trim Finish */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Trim Finish</h4>
        <div className="grid grid-cols-3 gap-2">
          {trimFinishes.map((finish) => {
            const properties = getTrimProperties(finish.value);
            return (
              <button
                key={finish.value}
                onClick={() => updateConfig("trimFinish", finish.value)}
                className={cn(
                  "group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105",
                  config.trimFinish === finish.value
                    ? "border-primary ring-2 ring-primary ring-offset-2"
                    : "border-transparent hover:border-primary/50"
                )}
              >
                <div className="aspect-square p-3">
                  <div
                    className="h-full w-full rounded-md shadow-inner"
                    style={{
                      backgroundColor: properties.color,
                      boxShadow: `inset 0 2px 4px rgba(0,0,0,${properties.roughness})`,
                    }}
                  />
                </div>
                {config.trimFinish === finish.value && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="h-6 w-6 text-white drop-shadow-lg" />
                  </div>
                )}
                <div className="border-t bg-card p-2 text-center">
                  <div className="text-xs font-medium">{finish.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clip Style */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Clip Style</h4>
        <div className="grid grid-cols-2 gap-2">
          {clipStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => updateConfig("clipStyle", style.value)}
              className={cn(
                "rounded-lg border-2 p-3 text-left transition-all hover:border-primary/50",
                config.clipStyle === style.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{style.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {style.description}
                  </div>
                </div>
                {config.clipStyle === style.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
