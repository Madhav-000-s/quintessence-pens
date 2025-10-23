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
              const isSelected = config.trimFinish === finish.value;
              return (
                <button
                  key={finish.value}
                  onClick={() => handleTrimSelect(finish)}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '0.5rem',
                    border: isSelected ? '2px solid var(--luxury-gold)' : '1.5px solid var(--luxury-gray-200)',
                    transition: 'all 0.3s',
                    background: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.25)' : 'none'
                  }}
                  title={finish.cost > 0 ? `+$${finish.cost}` : undefined}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--luxury-gold-muted)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--luxury-gray-200)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div style={{ aspectRatio: '1', padding: '0.75rem' }}>
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        borderRadius: '0.375rem',
                        backgroundColor: properties.color,
                        boxShadow: `inset 0 2px 4px rgba(0,0,0,${properties.roughness})`,
                      }}
                    />
                  </div>
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0, 0, 0, 0.2)'
                    }}>
                      <Check style={{
                        width: '24px',
                        height: '24px',
                        stroke: '#ffffff',
                        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
                      }} />
                    </div>
                  )}
                  <div style={{
                    borderTop: '1px solid var(--luxury-gray-200)',
                    background: 'var(--card)',
                    padding: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--luxury-black)' }}>{finish.label}</div>
                    {finish.cost > 0 && (
                      <div style={{ fontSize: '0.625rem', color: 'var(--luxury-gold)', fontWeight: 600 }}>+${finish.cost}</div>
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
          {clipStyles.map((style) => {
            const isSelected = config.clipStyle === style.value;
            return (
              <button
                key={style.value}
                onClick={() => updateConfig("clipStyle", style.value)}
                style={{
                  borderRadius: '0.5rem',
                  border: isSelected ? '2px solid var(--luxury-gold)' : '1.5px solid var(--luxury-gray-200)',
                  padding: '0.75rem',
                  textAlign: 'left',
                  transition: 'all 0.3s',
                  background: isSelected ? 'var(--luxury-gray-50)' : '#ffffff',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.25)' : '0 2px 4px rgba(10, 10, 15, 0.05)'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--luxury-gold-muted)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--luxury-gray-200)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(10, 10, 15, 0.05)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--luxury-black)' }}>{style.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--luxury-gray-600)', marginTop: '0.25rem' }}>
                      {style.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check style={{ width: '16px', height: '16px', stroke: 'var(--luxury-gold)', flexShrink: 0 }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
