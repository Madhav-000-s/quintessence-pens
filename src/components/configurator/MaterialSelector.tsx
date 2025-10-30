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
                key={material.materialId || material.value}
                onClick={() => handleMaterialSelect(material)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1rem',
                  border: isSelected ? '2px solid var(--luxury-gold)' : '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: '#ffffff',
                  boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.25)' : 'none',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--luxury-gold)';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(212, 175, 55, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--luxury-black)', marginBottom: '0.25rem' }}>
                    {material.label}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--luxury-black)', opacity: 0.6 }}>
                    {material.description}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--luxury-gold)',
                  flexShrink: 0,
                  paddingTop: '0.125rem'
                }}>
                  {material.cost === 0 ? 'Included' : `+$${material.cost}`}
                </div>
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
                  border: isSelected ? '2px solid var(--luxury-gold)' : '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '0.75rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 600 : 500,
                  transition: 'all 0.3s',
                  background: isSelected ? 'var(--luxury-gold)' : '#ffffff',
                  color: isSelected ? 'var(--luxury-black)' : 'var(--luxury-black)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 2px 8px rgba(212, 175, 55, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--luxury-gold)';
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
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
