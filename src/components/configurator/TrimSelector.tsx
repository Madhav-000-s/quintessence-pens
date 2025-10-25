"use client";

import { useState, useEffect } from "react";
import { useConfiguratorStore } from "@/lib/store/configurator";
import { getTrimProperties } from "@/lib/configurator-utils";
import { cn } from "@/lib/utils";
import type { ClipStyle } from "@/types/configurator";
import { Check, Loader2 } from "lucide-react";
import { fetchDesigns } from "@/lib/supabase/configurator-api";
import { adaptDesignsToTrimFinishes, type TrimOption } from "@/lib/adapters/configurator-adapters";

const clipStyles: Array<{ value: ClipStyle; label: string; description: string }> = [
  { value: "classic", label: "Classic", description: "Traditional elegance" },
  { value: "modern", label: "Modern", description: "Contemporary design" },
  { value: "minimalist", label: "Minimalist", description: "Sleek simplicity" },
  { value: "arrow", label: "Arrow", description: "Iconic signature style" },
];

export function TrimSelector() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);
  const [trimOptions, setTrimOptions] = useState<TrimOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrimOptions = async () => {
      setIsLoading(true);
      try {
        const dbDesigns = await fetchDesigns();
        const adaptedTrims = adaptDesignsToTrimFinishes(dbDesigns);
        // If no data from DB, use the fallback hardcoded data
        setTrimOptions(adaptedTrims);
      } catch (error) {
        console.error("Failed to load trim options:", error);
        // Fallback will be used automatically by adapter
        setTrimOptions(adaptDesignsToTrimFinishes([]));
      } finally {
        setIsLoading(false);
      }
    };

    loadTrimOptions();
  }, []);

  const handleTrimSelect = (trim: TrimOption) => {
    updateConfig("trimFinish", trim.value);
    // Store designId if available for pricing
    if (trim.designId) {
      updateConfig("designId", trim.designId);
    }
  };

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
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {trimOptions.map((finish) => {
              const properties = getTrimProperties(finish.value);
              return (
                <button
                  key={finish.value}
                  onClick={() => handleTrimSelect(finish)}
                  className={cn(
                    "group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105",
                    config.trimFinish === finish.value
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent hover:border-primary/50"
                  )}
                  title={finish.cost > 0 ? `+$${finish.cost}` : undefined}
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
                    {finish.cost > 0 && (
                      <div className="text-[10px] text-muted-foreground">+${finish.cost}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
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
