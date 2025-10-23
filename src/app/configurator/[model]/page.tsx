"use client";

import { Suspense, useEffect } from "react";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { PenViewer } from "@/components/configurator/PenViewer";
import { ConfigPanel } from "@/components/configurator/ConfigPanel";
import { PriceBadge } from "@/components/configurator/PriceBadge";
import { PricingSummary } from "@/components/configurator/PricingSummary";
import { KeyboardShortcuts } from "@/components/configurator/KeyboardShortcuts";
import { useConfiguratorStore } from "@/lib/store/configurator";
import { Skeleton } from "@/components/ui/skeleton";
import type { PenModel } from "@/types/configurator";

// Valid pen models
const VALID_MODELS: PenModel[] = ["zeus", "poseidon", "hera"];

function ConfiguratorContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const model = params.model as string;

  const setModel = useConfiguratorStore((state) => state.setModel);
  const loadPreset = useConfiguratorStore((state) => state.loadPreset);
  const importConfig = useConfiguratorStore((state) => state.importConfig);

  // Validate model
  if (!VALID_MODELS.includes(model as PenModel)) {
    notFound();
  }

  // Load model and optional preset/config on mount
  useEffect(() => {
    // Set the model
    setModel(model as PenModel);

    // Check for preset parameter
    const presetId = searchParams.get("preset");
    if (presetId) {
      loadPreset(presetId);
      return;
    }

    // Check for config parameter (shared configuration)
    const configParam = searchParams.get("config");
    if (configParam) {
      try {
        const decoded = atob(configParam);
        importConfig(decoded);
      } catch (error) {
        console.error("Failed to load configuration from URL:", error);
      }
    }
  }, [model, searchParams, setModel, loadPreset, importConfig]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden lg:flex-row">
      {/* 3D Viewer - 60% on desktop */}
      <div className="viewer-luxury-bg relative h-1/2 flex-1 lg:h-full">
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <Skeleton className="h-96 w-96" />
            </div>
          }
        >
          <PenViewer />
        </Suspense>

        {/* Logo/Brand */}
        <div className="pointer-events-none absolute left-6 top-6 lg:left-8 lg:top-8">
          <h1 className="text-luxury-heading text-2xl font-bold" style={{ fontFamily: 'var(--font-serif)', color: 'var(--luxury-gold)', opacity: 0.9 }}>
            Quintessence
          </h1>
        </div>
      </div>

      {/* Configuration Panel - 40% on desktop */}
      <div className="h-1/2 w-full overflow-y-auto bg-white shadow-2xl lg:h-full lg:w-[40%] lg:max-w-[640px]">
        <ConfigPanel />
      </div>

      {/* Price Badge - Always visible */}
      <PriceBadge />

      {/* Pricing Drawer - Shows on demand */}
      <PricingSummary />

      {/* Keyboard Shortcuts Helper */}
      <KeyboardShortcuts />
    </div>
  );
}

export default function ConfiguratorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div className="text-center">
            <Skeleton className="mx-auto mb-4 h-12 w-64" />
            <Skeleton className="mx-auto h-6 w-48" />
          </div>
        </div>
      }
    >
      <ConfiguratorContent />
    </Suspense>
  );
}
