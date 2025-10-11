"use client";

import { useState, useEffect } from "react";
import { useConfiguratorStore } from "@/lib/store/configurator";
import { cn } from "@/lib/utils";
import type { BodyFinish } from "@/types/configurator";
import { Check, Loader2 } from "lucide-react";
import { fetchMaterials } from "@/lib/supabase/configurator-api";
import { adaptMaterialsToOptions, type MaterialOption } from "@/lib/adapters/configurator-adapters";

const finishes: Array<{ value: BodyFinish; label: string }> = [
  { value: "glossy", label: "Glossy" },
  { value: "matte", label: "Matte" },
  { value: "satin", label: "Satin" },
];

export function MaterialSelector() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);
  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);
      try {
        const dbMaterials = await fetchMaterials();
        const adaptedMaterials = adaptMaterialsToOptions(dbMaterials);
        setMaterials(adaptedMaterials);
      } catch (error) {
        console.error("Failed to load materials:", error);
        // Fallback will be used automatically by adapter
        setMaterials(adaptMaterialsToOptions([]));
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterials();
  }, []);

  const handleMaterialSelect = (material: MaterialOption) => {
    updateConfig("bodyMaterial", material.value as any);
    updateConfig("materialId", material.materialId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Body Material</h3>
        <p className="text-sm text-muted-foreground">
          Select the material for your pen body
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {materials.map((material) => (
            <button
              key={material.value}
              onClick={() => handleMaterialSelect(material)}
              className={cn(
                "group relative w-full rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 hover:shadow-md",
                config.bodyMaterial === material.value
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{material.label}</span>
                    {material.cost > 0 && (
                      <span className="text-xs text-muted-foreground">
                        +${material.cost}
                      </span>
                    )}
                  </div>
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
      )}

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
