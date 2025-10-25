"use client";

import { useState, useEffect } from "react";
import { useConfiguratorStore } from "@/lib/store/configurator";
import { getModelMetadata } from "@/lib/pen-models";
import { MaterialSelector } from "./MaterialSelector";
import { ColorPicker } from "./ColorPicker";
import { NibConfigurator } from "./NibConfigurator";
import { TrimSelector } from "./TrimSelector";
import { EngravingEditor } from "./EngravingEditor";
import { ProgressIndicator } from "./ProgressIndicator";
import { AddToCartButton } from "./AddToCartButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Pen,
  Sparkles,
  Type,
  RotateCcw,
  Share2,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Section = "material" | "color" | "nib" | "trim" | "engraving";

const sections = [
  { id: "material" as const, label: "Material", icon: Sparkles },
  { id: "color" as const, label: "Color", icon: Palette },
  { id: "nib" as const, label: "Nib", icon: Pen },
  { id: "trim" as const, label: "Trim", icon: Sparkles },
  { id: "engraving" as const, label: "Engraving", icon: Type },
];

export function ConfigPanel() {
  const [activeSection, setActiveSection] = useState<Section>("material");
  const currentModel = useConfiguratorStore((state) => state.currentModel);
  const resetConfig = useConfiguratorStore((state) => state.resetConfig);
  const exportConfig = useConfiguratorStore((state) => state.exportConfig);
  const togglePricingDrawer = useConfiguratorStore(
    (state) => state.togglePricingDrawer
  );

  // Get model metadata for display
  const modelMetadata = getModelMetadata(currentModel);

  const handleExport = () => {
    const configJSON = exportConfig();
    const blob = new Blob([configJSON], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pen-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const configJSON = exportConfig();
    const encoded = btoa(configJSON);
    const url = `${window.location.origin}/configurator?config=${encoded}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Custom Pen Configuration",
          url: url,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        alert("Share link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Share link copied to clipboard!");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Arrow keys for section navigation
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const currentIndex = sections.findIndex(
          (s) => s.id === activeSection
        );
        const nextIndex =
          e.key === "ArrowRight"
            ? (currentIndex + 1) % sections.length
            : (currentIndex - 1 + sections.length) % sections.length;
        setActiveSection(sections[nextIndex].id);
      }

      // P key to toggle pricing drawer
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePricingDrawer();
      }

      // R key to reset configuration
      if ((e.metaKey || e.ctrlKey) && e.key === "r") {
        e.preventDefault();
        if (confirm("Reset configuration to defaults?")) {
          resetConfig();
        }
      }

      // S key to share
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleShare();
      }

      // D key to download
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        handleExport();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSection, resetConfig, togglePricingDrawer]);

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b p-6 pb-4">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 700, color: 'var(--luxury-black)', marginBottom: '0.5rem' }}>
          {modelMetadata.name}
        </h1>
        <span className="badge-luxury">
          {modelMetadata.tagline}
        </span>
        <p style={{ color: 'var(--luxury-gray-600)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: '1rem' }}>
          {modelMetadata.description}
        </p>
        <ProgressIndicator />
      </div>

      {/* Section Tabs */}
      <div className="border-b">
        <div className="grid grid-cols-5">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.75rem 0.5rem',
                  background: isActive ? 'linear-gradient(to bottom, var(--luxury-black), var(--luxury-navy))' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--luxury-gold)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => !isActive && (e.currentTarget.style.background = 'var(--luxury-gray-100)')}
                onMouseLeave={(e) => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <Icon style={{ width: '20px', height: '20px', stroke: isActive ? 'var(--luxury-gold)' : 'var(--luxury-gray-500)', transition: 'stroke 0.3s' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: isActive ? 600 : 500, color: isActive ? 'var(--luxury-gold)' : 'var(--luxury-gray-500)', transition: 'color 0.3s' }}>
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
          {activeSection === "material" && <MaterialSelector />}
          {activeSection === "color" && <ColorPicker />}
          {activeSection === "nib" && <NibConfigurator />}
          {activeSection === "trim" && <TrimSelector />}
          {activeSection === "engraving" && <EngravingEditor />}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3 border-t p-4">
        <button
          onClick={resetConfig}
          style={{
            height: '40px',
            border: '1px solid var(--luxury-gold)',
            borderRadius: '0.5rem',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--luxury-black)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--luxury-gold)';
            e.currentTarget.style.color = 'var(--luxury-black)';
            e.currentTarget.style.background = 'var(--luxury-gold)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--luxury-gold)';
            e.currentTarget.style.color = 'var(--luxury-black)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <RotateCcw style={{ width: '16px', height: '16px' }} />
          <span>Reset</span>
        </button>

        <button
          onClick={handleShare}
          style={{
            height: '40px',
            border: '1px solid var(--luxury-gold)',
            borderRadius: '0.5rem',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--luxury-black)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--luxury-gold)';
            e.currentTarget.style.color = 'var(--luxury-black)';
            e.currentTarget.style.background = 'var(--luxury-gold)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--luxury-gold)';
            e.currentTarget.style.color = 'var(--luxury-black)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Share2 style={{ width: '16px', height: '16px' }} />
          <span>Share</span>
        </button>

        <button
          onClick={handleExport}
          style={{
            height: '40px',
            border: '1px solid var(--luxury-gold)',
            borderRadius: '0.5rem',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--luxury-black)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--luxury-gold)';
            e.currentTarget.style.color = 'var(--luxury-black)';
            e.currentTarget.style.background = 'var(--luxury-gold)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(212, 175, 55, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--luxury-gold)';
            e.currentTarget.style.color = 'var(--luxury-black)';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Download style={{ width: '16px', height: '16px' }} />
          <span>Download</span>
        </button>
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton />
    </div>
  );
}
