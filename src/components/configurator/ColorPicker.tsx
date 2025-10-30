"use client";

import { useState, useEffect } from "react";
import { useConfiguratorStore } from "@/lib/store/configurator";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import { fetchDesigns } from "@/lib/supabase/configurator-api";
import { adaptDesignsToColors, type ColorDesignOption } from "@/lib/adapters/configurator-adapters";

export function ColorPicker() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);
  const [colors, setColors] = useState<ColorDesignOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      setIsLoading(true);
      try {
        const dbDesigns = await fetchDesigns();
        const adaptedColors = adaptDesignsToColors(dbDesigns);
        setColors(adaptedColors);
      } catch (error) {
        console.error("Failed to load colors:", error);
        // Fallback to default colors
        setColors(adaptDesignsToColors([]));
      } finally {
        setIsLoading(false);
      }
    };

    loadColors();
  }, []);

  const handleColorSelect = (color: ColorDesignOption) => {
    updateConfig("bodyColor", color.hex);
    updateConfig("designId", color.designId);
  };

  const categories = ["neutral", "warm", "cool", "metallic", "vibrant"] as const;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Body Color</h3>
        <p className="text-sm text-muted-foreground">
          Choose the color for your pen body
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {categories.map((category) => {
            const categoryColors = colors.filter((c) => c.category === category);

            if (categoryColors.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h4 className="text-sm font-medium capitalize text-muted-foreground">
                  {category}
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {categoryColors.map((color) => {
                    const isSelected = config.bodyColor === color.hex;
                    return (
                      <button
                        key={color.hex}
                        onClick={() => handleColorSelect(color)}
                        style={{
                          position: 'relative',
                          aspectRatio: '1',
                          overflow: 'hidden',
                          borderRadius: '0.5rem',
                          border: isSelected ? '2px solid var(--luxury-gold)' : '1px solid rgba(212, 175, 55, 0.3)',
                          transition: 'all 0.3s',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 0 20px rgba(212, 175, 55, 0.25)' : 'none'
                        }}
                        title={`${color.name}${color.cost > 0 ? ` (+$${color.cost})` : ""}`}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'var(--luxury-gold)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: '100%',
                            backgroundColor: color.hex
                          }}
                        />
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
                              width: '20px',
                              height: '20px',
                              stroke: '#ffffff',
                              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
                            }} />
                          </div>
                        )}
                        <div
                          className="group-hover:translate-y-0"
                          style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            transform: 'translateY(100%)',
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(4px)',
                            padding: '0.25rem',
                            textAlign: 'center',
                            fontSize: '0.75rem',
                            color: '#ffffff',
                            transition: 'transform 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {color.name}
                          {color.cost > 0 && <span style={{ display: 'block', fontSize: '0.625rem' }}>+${color.cost}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
