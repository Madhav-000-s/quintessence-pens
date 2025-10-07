"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import {
  nibSizeDescriptions,
  nibMaterialDescriptions,
} from "@/lib/configurator-utils";
import { cn } from "@/lib/utils";
import type { NibSize, NibMaterial, NibStyle } from "@/types/configurator";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const nibSizes: NibSize[] = ["EF", "F", "M", "B", "Stub"];
const nibStyles: Array<{ value: NibStyle; label: string }> = [
  { value: "standard", label: "Standard" },
  { value: "italic", label: "Italic" },
  { value: "flex", label: "Flex" },
  { value: "architect", label: "Architect" },
];

const nibMaterials: Array<{ value: NibMaterial; label: string; premium: boolean }> = [
  { value: "steel", label: "Stainless Steel", premium: false },
  { value: "gold-14k", label: "14K Gold", premium: true },
  { value: "gold-18k", label: "18K Gold", premium: true },
  { value: "gold-21k", label: "21K Gold", premium: true },
  { value: "platinum", label: "Platinum", premium: true },
];

export function NibConfigurator() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Nib Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Customize your writing experience
        </p>
      </div>

      {/* Nib Size */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium">Nib Size</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Nib size affects line width and ink flow. Smaller nibs are
                  better for detailed writing, larger for bold signatures.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex gap-2">
          {nibSizes.map((size) => (
            <TooltipProvider key={size}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => updateConfig("nibSize", size)}
                    className={cn(
                      "flex-1 rounded-lg border-2 px-3 py-2 text-center font-medium transition-all hover:border-primary/50",
                      config.nibSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent"
                    )}
                  >
                    {size}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">{nibSizeDescriptions[size]}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>

      {/* Nib Material */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Nib Material</h4>
        <div className="space-y-2">
          {nibMaterials.map((material) => (
            <button
              key={material.value}
              onClick={() => updateConfig("nibMaterial", material.value)}
              className={cn(
                "group relative w-full rounded-lg border-2 p-3 text-left transition-all hover:border-primary/50",
                config.nibMaterial === material.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{material.label}</span>
                      {material.premium && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600">
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {nibMaterialDescriptions[material.value]}
                    </div>
                  </div>
                </div>
                {config.nibMaterial === material.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Nib Style */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Nib Style</h4>
        <div className="grid grid-cols-2 gap-2">
          {nibStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => updateConfig("nibStyle", style.value)}
              className={cn(
                "rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-all hover:border-primary/50",
                config.nibStyle === style.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              )}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
