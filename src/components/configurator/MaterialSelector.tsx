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
        <div className="space-y-3">
          {materials.map((material) => {
            const isSelected = config.bodyMaterial === material.value;
            return (
              <button
                key={material.value}
                onClick={() => handleMaterialSelect(material)}
                className="card-luxury"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  border: isSelected ? '2px solid var(--luxury-gold)' : '1.5px solid var(--luxury-gray-200)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: isSelected ? 'var(--luxury-gray-50)' : '#ffffff',
                  position: 'relative',
                  boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.25)' : 'none'
                }}
              >
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--luxury-black)', marginBottom: '0.25rem' }}>
                    {material.label}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--luxury-gray-600)' }}>
                    {material.description}
                  </div>
                </div>
                {material.cost > 0 && (
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--luxury-gold)', marginLeft: 'auto' }}>
                    +${material.cost}
                  </div>
                )}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '20px',
                    height: '20px',
                    background: 'linear-gradient(135deg, var(--luxury-black), var(--luxury-navy))',
                    border: '1px solid var(--luxury-gold)',
                    color: 'var(--luxury-gold)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="pt-4">
        <h3 className="mb-3 font-medium">Surface Finish</h3>
        <div className="flex gap-2">
          {finishes.map((finish) => {
            const isSelected = config.bodyFinish === finish.value;
            return (
              <button
                key={finish.value}
                onClick={() => updateConfig("bodyFinish", finish.value)}
                style={{
                  flex: 1,
                  borderRadius: '0.5rem',
                  border: isSelected ? '2px solid var(--luxury-gold)' : '2px solid var(--luxury-gray-200)',
                  padding: '0.75rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.3s',
                  background: isSelected ? 'var(--luxury-gold)' : 'transparent',
                  color: isSelected ? 'var(--luxury-black)' : 'var(--luxury-gray-700)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => !isSelected && (e.currentTarget.style.borderColor = 'var(--luxury-gold-muted)')}
                onMouseLeave={(e) => !isSelected && (e.currentTarget.style.borderColor = 'var(--luxury-gray-200)')}
              >
                {finish.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
