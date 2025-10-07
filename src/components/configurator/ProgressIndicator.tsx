"use client";

import { useConfiguratorStore } from "@/lib/store/configurator";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProgressIndicator() {
  const config = useConfiguratorStore((state) => state.config);

  // Determine which steps are completed
  const steps = [
    {
      id: "material",
      label: "Material",
      completed: config.bodyMaterial !== "resin" || config.bodyFinish !== "glossy",
    },
    {
      id: "color",
      label: "Color",
      completed: config.bodyColor !== "#1a1a2e",
    },
    {
      id: "nib",
      label: "Nib",
      completed: config.nibMaterial !== "steel" || config.nibSize !== "M",
    },
    {
      id: "trim",
      label: "Trim",
      completed: config.trimFinish !== "rhodium" || config.clipStyle !== "classic",
    },
    {
      id: "engraving",
      label: "Engraving",
      completed: config.engraving.location !== "none",
    },
  ];

  const completedCount = steps.filter((step) => step.completed).length;
  const progressPercentage = (completedCount / steps.length) * 100;

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">
          {completedCount}/{steps.length}
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              step.completed ? "opacity-100" : "opacity-40"
            )}
          >
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                step.completed
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 bg-background"
              )}
            >
              {step.completed && <Check className="h-3 w-3" />}
            </div>
            <span className="text-[10px] font-medium">{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
