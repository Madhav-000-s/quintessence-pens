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
    <div className="flex gap-2 mt-4">
      {steps.map((step) => (
        <div
          key={step.id}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: step.completed ? 'var(--luxury-gold)' : 'var(--luxury-gray-200)',
            transform: step.completed ? 'scale(1.25)' : 'scale(1)',
            boxShadow: step.completed ? '0 0 12px rgba(212, 175, 55, 0.4)' : 'none',
            transition: 'all 0.3s'
          }}
        />
      ))}
    </div>
  );
}
