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
          {nibSizes.map((size) => {
            const isSelected = config.nibSize === size;
            return (
              <TooltipProvider key={size}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => updateConfig("nibSize", size)}
                      style={{
                        flex: 1,
                        borderRadius: '0.5rem',
                        border: isSelected ? '2px solid var(--luxury-gold)' : '1.5px solid var(--luxury-gray-200)',
                        padding: '0.5rem 0.75rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: isSelected ? 600 : 500,
                        transition: 'all 0.3s',
                        background: isSelected ? 'var(--luxury-gold)' : '#ffffff',
                        color: isSelected ? 'var(--luxury-black)' : 'var(--luxury-gray-700)',
                        cursor: 'pointer',
                        boxShadow: isSelected ? '0 2px 8px rgba(212, 175, 55, 0.25)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--luxury-gold)';
                          e.currentTarget.style.background = 'var(--luxury-gray-50)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--luxury-gray-200)';
                          e.currentTarget.style.background = '#ffffff';
                        }
                      }}
                    >
                      {size}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{nibSizeDescriptions[size]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>

      {/* Nib Material */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Nib Material</h4>
        <div className="space-y-2">
          {nibMaterials.map((material) => {
            const isSelected = config.nibMaterial === material.value;
            return (
              <button
                key={material.value}
                onClick={() => updateConfig("nibMaterial", material.value)}
                style={{
                  width: '100%',
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--luxury-black)' }}>{material.label}</span>
                        {material.premium && (
                          <span style={{
                            borderRadius: '9999px',
                            background: 'rgba(212, 175, 55, 0.1)',
                            padding: '0.125rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--luxury-gold-dark)'
                          }}>
                            Premium
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--luxury-gray-600)', marginTop: '0.25rem' }}>
                        {nibMaterialDescriptions[material.value]}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <Check style={{ width: '20px', height: '20px', stroke: 'var(--luxury-gold)' }} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nib Style */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium">Nib Style</h4>
        <div className="grid grid-cols-2 gap-2">
          {nibStyles.map((style) => {
            const isSelected = config.nibStyle === style.value;
            return (
              <button
                key={style.value}
                onClick={() => updateConfig("nibStyle", style.value)}
                style={{
                  borderRadius: '0.5rem',
                  border: isSelected ? '2px solid var(--luxury-gold)' : '1.5px solid var(--luxury-gray-200)',
                  padding: '0.75rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? 600 : 500,
                  transition: 'all 0.3s',
                  background: isSelected ? 'var(--luxury-gold)' : '#ffffff',
                  color: isSelected ? 'var(--luxury-black)' : 'var(--luxury-gray-700)',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 2px 8px rgba(212, 175, 55, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--luxury-gold)';
                    e.currentTarget.style.background = 'var(--luxury-gray-50)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'var(--luxury-gray-200)';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
