"use client";

import { useState, useEffect } from "react";
import { useConfiguratorStore } from "@/lib/store/configurator";
import { validateEngravingText } from "@/lib/configurator-utils";
import { cn } from "@/lib/utils";
import type { EngravingLocation } from "@/types/configurator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Loader2 } from "lucide-react";
import { fetchEngravings } from "@/lib/supabase/configurator-api";
import { adaptEngravingsToOptions, type EngravingOption } from "@/lib/adapters/configurator-adapters";

const locations: Array<{ value: EngravingLocation; label: string }> = [
  { value: "none", label: "No Engraving" },
  { value: "cap", label: "Cap Body" },
  { value: "barrel", label: "Barrel" },
  { value: "clip", label: "Clip" },
];

export function EngravingEditor() {
  const config = useConfiguratorStore((state) => state.config);
  const updateConfig = useConfiguratorStore((state) => state.updateConfig);
  const [textError, setTextError] = useState<string | null>(null);
  const [engravingOptions, setEngravingOptions] = useState<EngravingOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEngravingId, setSelectedEngravingId] = useState<number | null>(null);

  useEffect(() => {
    const loadEngravingOptions = async () => {
      setIsLoading(true);
      try {
        const dbEngravings = await fetchEngravings();
        const adaptedEngravings = adaptEngravingsToOptions(dbEngravings);
        setEngravingOptions(adaptedEngravings);
      } catch (error) {
        console.error("Failed to load engraving options:", error);
        // Fallback will be used automatically by adapter
        setEngravingOptions(adaptEngravingsToOptions([]));
      } finally {
        setIsLoading(false);
      }
    };

    loadEngravingOptions();
  }, []);

  const handleTextChange = (field: "text" | "line2" | "line3", value: string) => {
    const validation = validateEngravingText(value);

    if (!validation.valid) {
      setTextError(validation.message || null);
    } else {
      setTextError(null);
    }

    updateConfig("engraving", {
      ...config.engraving,
      [field]: value,
    });
  };

  const handleLocationChange = (location: EngravingLocation) => {
    updateConfig("engraving", {
      ...config.engraving,
      location,
    });

    // Set engravingId when enabling engraving
    if (location !== "none" && engravingOptions.length > 0 && !selectedEngravingId) {
      const firstOption = engravingOptions[0];
      setSelectedEngravingId(firstOption.engravingId);
      updateConfig("engravingId", firstOption.engravingId);
    } else if (location === "none") {
      updateConfig("engravingId", undefined);
      setSelectedEngravingId(null);
    }
  };

  const handleEngravingTypeChange = (option: EngravingOption) => {
    setSelectedEngravingId(option.engravingId);
    updateConfig("engravingId", option.engravingId);
    updateConfig("engraving", {
      ...config.engraving,
      font: option.font,
    });
  };

  const isEngravingEnabled = config.engraving.location !== "none";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium">Engraving</h3>
        <p className="text-sm text-muted-foreground">
          Add a personal touch with custom engraving
        </p>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <Label>Engraving Location</Label>
        <div className="grid grid-cols-2 gap-2">
          {locations.map((location) => (
            <button
              key={location.value}
              onClick={() => handleLocationChange(location.value)}
              className={cn(
                "rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-all hover:border-primary/50",
                config.engraving.location === location.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-accent"
              )}
            >
              {location.label}
            </button>
          ))}
        </div>
      </div>

      {isEngravingEnabled && (
        <>
          {/* Engraving Type/Style Selection */}
          <div className="space-y-3">
            <Label>Engraving Style</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-2">
                {engravingOptions.map((option) => (
                  <button
                    key={option.engravingId}
                    onClick={() => handleEngravingTypeChange(option)}
                    className={cn(
                      "w-full rounded-lg border-2 p-3 text-left transition-all hover:border-primary/50",
                      selectedEngravingId === option.engravingId
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{option.typeName}</span>
                          {option.cost > 0 && (
                            <span className="text-xs text-muted-foreground">
                              +${option.cost}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {option.description} • {option.font} font
                        </div>
                      </div>
                      {selectedEngravingId === option.engravingId && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <Label htmlFor="engraving-text">Engraving Text</Label>
            <div className="space-y-2">
              <div>
                <Input
                  id="engraving-text"
                  placeholder="Line 1 (required)"
                  value={config.engraving.text}
                  onChange={(e) => handleTextChange("text", e.target.value)}
                  maxLength={30}
                  className={cn(textError && "border-destructive")}
                />
                {textError && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {textError}
                  </div>
                )}
              </div>

              <Input
                placeholder="Line 2 (optional)"
                value={config.engraving.line2 || ""}
                onChange={(e) => handleTextChange("line2", e.target.value)}
                maxLength={30}
              />

              <Input
                placeholder="Line 3 (optional)"
                value={config.engraving.line3 || ""}
                onChange={(e) => handleTextChange("line3", e.target.value)}
                maxLength={30}
              />
            </div>

            <div className="text-xs text-muted-foreground">
              Max 30 characters per line. Letters, numbers, and basic
              punctuation only.
            </div>
          </div>

          {/* Preview */}
          {config.engraving.text && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                Preview
              </div>
              <div
                className="text-center"
                style={{
                  fontFamily:
                    config.engraving.font === "script"
                      ? "cursive"
                      : config.engraving.font === "serif"
                        ? "serif"
                        : config.engraving.font === "monospace"
                          ? "monospace"
                          : "sans-serif",
                }}
              >
                <div className="text-sm">{config.engraving.text}</div>
                {config.engraving.line2 && (
                  <div className="text-sm">{config.engraving.line2}</div>
                )}
                {config.engraving.line3 && (
                  <div className="text-sm">{config.engraving.line3}</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
