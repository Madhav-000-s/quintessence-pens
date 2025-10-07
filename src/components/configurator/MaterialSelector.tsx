"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { cn } from "@/lib/utils";
import type { BodyMaterial, BodyFinish } from "@/types/configurator";
import { Check } from "lucide-react";

const materials: Array<{
  value: BodyMaterial;
  label: string;
  description: string;
}> = [
  {
    value: "resin",
    label: "Resin",
    description: "Classic, lightweight, vibrant colors",
  },
  {
    value: "metal",
    label: "Metal",
    description: "Premium weight, durable, elegant",
  },
  {
    value: "wood",
    label: "Wood",
    description: "Natural grain, unique, warm feel",
  },
  {
    value: "carbon-fiber",
    label: "Carbon Fiber",
    description: "Modern, strong, distinctive pattern",
  },
  {
    value: "lacquer",
    label: "Urushi Lacquer",
    description: "Ultra-premium, glossy, Japanese tradition",
  },
];

const finishes: Array<{ value: BodyFinish; label: string }> = [
  { value: "glossy", label: "Glossy" },
  { value: "matte", label: "Matte" },
  { value: "satin", label: "Satin" },
];

export function MaterialSelector() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Body Material</h3>
        <p className="text-sm text-muted-foreground">
          Select the material for your pen body
        </p>
      </div>

      <div className="space-y-2">
        {materials.map((material) => (
          <button
            key={material.value}
            onClick={() => updateConfig("bodyMaterial", material.value)}
            className={cn(
              "group relative w-full rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 hover:shadow-md",
              config.bodyMaterial === material.value
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium">{material.label}</div>
                <div className="text-sm text-muted-foreground">
                  {material.description}
                </div>
              </div>
              {config.bodyMaterial === material.value && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4">
        <h3 className="mb-3 font-medium">Surface Finish</h3>
        <div className="flex gap-2">
          {finishes.map((finish) => (
            <button
              key={finish.value}
              onClick={() => updateConfig("bodyFinish", finish.value)}
              className={cn(
                "flex-1 rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-all hover:border-primary/50",
                config.bodyFinish === finish.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              )}
            >
              {finish.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
