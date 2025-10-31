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

  // Additional frontend colors to complement backend colors
  const frontendColors: ColorDesignOption[] = [
    // Neutral
    { name: "Charcoal", hex: "#36454F", category: "neutral", designId: 0, cost: 0, font: "script" },
    { name: "Slate Gray", hex: "#708090", category: "neutral", designId: 0, cost: 0, font: "script" },
    { name: "Pearl White", hex: "#F8F6F0", category: "neutral", designId: 0, cost: 0, font: "script" },
    { name: "Ivory", hex: "#FFFFF0", category: "neutral", designId: 0, cost: 0, font: "script" },

    // Warm
    { name: "Burgundy", hex: "#800020", category: "warm", designId: 0, cost: 0, font: "script" },
    { name: "Copper", hex: "#B87333", category: "warm", designId: 0, cost: 0, font: "script" },
    { name: "Mahogany", hex: "#C04000", category: "warm", designId: 0, cost: 0, font: "script" },
    { name: "Amber", hex: "#FFBF00", category: "warm", designId: 0, cost: 0, font: "script" },

    // Cool
    { name: "Navy Blue", hex: "#000080", category: "cool", designId: 0, cost: 0, font: "script" },
    { name: "Teal", hex: "#008080", category: "cool", designId: 0, cost: 0, font: "script" },
    { name: "Forest Green", hex: "#228B22", category: "cool", designId: 0, cost: 0, font: "script" },
    { name: "Royal Purple", hex: "#7851A9", category: "cool", designId: 0, cost: 0, font: "script" },

    // Metallic
    { name: "Rose Gold", hex: "#B76E79", category: "metallic", designId: 0, cost: 0, font: "script" },
    { name: "Bronze", hex: "#CD7F32", category: "metallic", designId: 0, cost: 0, font: "script" },
    { name: "Platinum", hex: "#E5E4E2", category: "metallic", designId: 0, cost: 0, font: "script" },
    { name: "Gunmetal", hex: "#2C3539", category: "metallic", designId: 0, cost: 0, font: "script" },

    // Vibrant
    { name: "Crimson", hex: "#DC143C", category: "vibrant", designId: 0, cost: 0, font: "script" },
    { name: "Emerald", hex: "#50C878", category: "vibrant", designId: 0, cost: 0, font: "script" },
    { name: "Sapphire", hex: "#0F52BA", category: "vibrant", designId: 0, cost: 0, font: "script" },
    { name: "Amethyst", hex: "#9966CC", category: "vibrant", designId: 0, cost: 0, font: "script" },
  ];

  // Texture options
  const textureOptions = [
    { name: "Carbon Fiber", texture: "/textures/carbon-fiber.jpg", category: "texture", designId: 0, cost: 50 },
    { name: "Wood Grain", texture: "/textures/wood-grain.jpg", category: "texture", designId: 0, cost: 75 },
    { name: "Marble", texture: "/textures/marble.jpg", category: "texture", designId: 0, cost: 100 },
    { name: "Leather", texture: "/textures/leather.jpg", category: "texture", designId: 0, cost: 60 },
  ];

  useEffect(() => {
    const loadColors = async () => {
      setIsLoading(true);
      try {
        const dbDesigns = await fetchDesigns();
        const adaptedColors = adaptDesignsToColors(dbDesigns);
        // Combine backend colors with frontend colors
        setColors([...adaptedColors, ...frontendColors]);
      } catch (error) {
        console.error("Failed to load colors:", error);
        // Fallback to frontend colors only
        setColors(frontendColors);
      } finally {
        setIsLoading(false);
      }
    };

    loadColors();
  }, []);

  const handleColorSelect = (color: ColorDesignOption) => {
    updateConfig("bodyColor", color.hex);
    updateConfig("bodyTexture", undefined); // Clear texture when color is selected
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

          {/* Texture Options */}
          <div className="space-y-3 border-t border-border pt-6 mt-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Premium Textures</h4>
              <p className="text-xs text-muted-foreground mt-1">Add unique texture patterns (additional cost)</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {textureOptions.map((texture) => {
                const isSelected = config.bodyTexture === texture.texture;
                return (
                  <button
                    key={texture.name}
                    onClick={() => {
                      updateConfig("bodyTexture", texture.texture);
                      updateConfig("bodyColor", "#ffffff"); // Set to white so texture shows
                      updateConfig("designId", texture.designId);
                    }}
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
                    title={`${texture.name} (+$${texture.cost})`}
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
                        backgroundImage: `url(${texture.texture})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
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
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(4px)',
                        padding: '0.25rem',
                        textAlign: 'center',
                        fontSize: '0.75rem',
                        color: '#ffffff'
                      }}
                    >
                      {texture.name}
                      <span style={{ display: 'block', fontSize: '0.625rem', color: 'var(--luxury-gold)' }}>+${texture.cost}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
