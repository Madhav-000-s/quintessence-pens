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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-card p-6 space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{modelMetadata.name}</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {modelMetadata.tagline}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {modelMetadata.description}
          </p>
        </div>
        <ProgressIndicator />
      </div>

      {/* Section Tabs */}
      <div className="border-b bg-card">
        <div className="flex gap-1 p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                  activeSection === section.id &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === "material" && <MaterialSelector />}
        {activeSection === "color" && <ColorPicker />}
        {activeSection === "nib" && <NibConfigurator />}
        {activeSection === "trim" && <TrimSelector />}
        {activeSection === "engraving" && <EngravingEditor />}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 border-t p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={resetConfig}
                className="shrink-0"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset to defaults</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="shrink-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share configuration</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                className="shrink-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download configuration</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton />
    </div>
  );
}
