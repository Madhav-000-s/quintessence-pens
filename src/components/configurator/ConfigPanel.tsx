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
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-gradient-to-b from-card/50 to-card p-6 space-y-4 backdrop-blur-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{modelMetadata.name}</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary shadow-sm">
              {modelMetadata.tagline}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1">
            {modelMetadata.description}
          </p>
        </div>
        <ProgressIndicator />
      </div>

      {/* Section Tabs */}
      <div className="border-b bg-card/30 backdrop-blur-sm">
        <div className="flex gap-1 p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "group relative flex flex-1 flex-col items-center gap-1.5 rounded-lg px-3 py-2.5",
                  "transition-all duration-200 ease-out",
                  "hover:bg-accent/50",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isActive && "scale-110"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-all",
                  isActive && "font-semibold"
                )}>{section.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background/50 to-background">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
          {activeSection === "material" && <MaterialSelector />}
          {activeSection === "color" && <ColorPicker />}
          {activeSection === "nib" && <NibConfigurator />}
          {activeSection === "trim" && <TrimSelector />}
          {activeSection === "engraving" && <EngravingEditor />}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 border-t bg-card/50 backdrop-blur-sm p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={resetConfig}
                className="shrink-0 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset to defaults (Ctrl+R)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="shrink-0 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share configuration (Ctrl+S)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleExport}
                className="shrink-0 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-colors"
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download configuration (Ctrl+D)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton />
    </div>
  );
}
