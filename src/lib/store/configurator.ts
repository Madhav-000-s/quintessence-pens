import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PenConfiguration,
  ConfigSection,
  PricingBreakdown,
  PenModel,
} from "@/types/configurator";

interface ConfiguratorState {
  // Current configuration
  config: PenConfiguration;
  currentModel: PenModel;

  // UI state
  currentSection: ConfigSection;
  isAnimating: boolean;
  isPricingDrawerOpen: boolean;

  // Pricing
  pricing: PricingBreakdown;

  // Actions
  updateConfig: <K extends keyof PenConfiguration>(
    key: K,
    value: PenConfiguration[K]
  ) => void;
  setModel: (model: PenModel) => void;
  loadPreset: (presetId: string) => void;
  setCurrentSection: (section: ConfigSection) => void;
  setIsAnimating: (isAnimating: boolean) => void;
  setPricingDrawerOpen: (isOpen: boolean) => void;
  togglePricingDrawer: () => void;
  resetConfig: () => void;
  calculatePricing: () => void;
  exportConfig: () => string;
  importConfig: (configString: string) => void;
}

// Default configuration factory
const createDefaultConfig = (model: PenModel): PenConfiguration => ({
  // Model
  model,

  // Body
  bodyMaterial: "resin",
  bodyColor: "#1a1a2e",
  bodyPattern: "solid",
  bodyFinish: "glossy",

  // Nib
  nibSize: "M",
  nibMaterial: "steel",
  nibStyle: "standard",

  // Trim
  trimFinish: "rhodium",
  clipStyle: "classic",

  // Engraving
  engraving: {
    location: "none",
    font: "script",
    text: "",
  },

  // Ink
  inkColor: "midnight-black",

  // Preferences
  handPreference: "right",
  fillingMechanism: "cartridge-converter",
});

// Model base prices
const MODEL_BASE_PRICES: Record<PenModel, number> = {
  zeus: 1499,     // Premium executive
  poseidon: 1299, // Mid-range luxury
  hera: 999,      // Elegant entry
};

// Pricing logic
const calculatePricingBreakdown = (
  config: PenConfiguration
): PricingBreakdown => {
  const basePrice = MODEL_BASE_PRICES[config.model] || 999;

  // Body material costs
  const bodyMaterialCosts: Record<string, number> = {
    resin: 0,
    metal: 150,
    wood: 100,
    "carbon-fiber": 200,
    lacquer: 250,
  };

  // Nib material costs
  const nibMaterialCosts: Record<string, number> = {
    steel: 0,
    "gold-14k": 200,
    "gold-18k": 350,
    "gold-21k": 500,
    platinum: 600,
  };

  // Trim costs
  const trimCosts: Record<string, number> = {
    rhodium: 0,
    "brushed-steel": 0,
    "yellow-gold": 100,
    "rose-gold": 100,
    platinum: 150,
    "black-chrome": 50,
  };

  // Engraving cost
  const engravingCost = config.engraving.location !== "none" ? 50 : 0;

  const bodyMaterialCost = bodyMaterialCosts[config.bodyMaterial] || 0;
  const nibMaterialCost = nibMaterialCosts[config.nibMaterial] || 0;
  const trimCost = trimCosts[config.trimFinish] || 0;

  const total =
    basePrice + bodyMaterialCost + nibMaterialCost + trimCost + engravingCost;

  return {
    basePrice,
    bodyMaterialCost,
    nibMaterialCost,
    engravingCost,
    trimCost,
    total,
  };
};

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set, get) => ({
      config: createDefaultConfig("zeus"),
      currentModel: "zeus",
      currentSection: "body",
      isAnimating: false,
      isPricingDrawerOpen: false,
      pricing: calculatePricingBreakdown(createDefaultConfig("zeus")),

      updateConfig: (key, value) => {
        set((state) => {
          const newConfig = { ...state.config, [key]: value };
          return {
            config: newConfig,
            pricing: calculatePricingBreakdown(newConfig),
          };
        });
      },

      setModel: (model) => {
        const newConfig = createDefaultConfig(model);
        set({
          currentModel: model,
          config: newConfig,
          pricing: calculatePricingBreakdown(newConfig),
        });
      },

      loadPreset: (presetId) => {
        // Import preset from presets file
        import("@/lib/pen-presets").then(({ PEN_PRESETS }) => {
          const preset = PEN_PRESETS.find((p) => p.id === presetId);
          if (preset) {
            set({
              currentModel: preset.model,
              config: preset.config,
              pricing: calculatePricingBreakdown(preset.config),
            });
          }
        });
      },

      setCurrentSection: (section) => {
        set({ currentSection: section });
      },

      setIsAnimating: (isAnimating) => {
        set({ isAnimating });
      },

      setPricingDrawerOpen: (isOpen) => {
        set({ isPricingDrawerOpen: isOpen });
      },

      togglePricingDrawer: () => {
        set((state) => ({ isPricingDrawerOpen: !state.isPricingDrawerOpen }));
      },

      resetConfig: () => {
        const { currentModel } = get();
        const newConfig = createDefaultConfig(currentModel);
        set({
          config: newConfig,
          pricing: calculatePricingBreakdown(newConfig),
        });
      },

      calculatePricing: () => {
        const { config } = get();
        set({ pricing: calculatePricingBreakdown(config) });
      },

      exportConfig: () => {
        const { config, pricing } = get();
        return JSON.stringify({
          version: "1.0",
          timestamp: Date.now(),
          config,
          pricing,
        });
      },

      importConfig: (configString) => {
        try {
          const data = JSON.parse(configString);
          if (data.config) {
            set({
              currentModel: data.config.model,
              config: data.config,
              pricing: calculatePricingBreakdown(data.config),
            });
          }
        } catch (error) {
          console.error("Failed to import configuration:", error);
        }
      },
    }),
    {
      name: "pen-configurator-storage",
      partialize: (state) => ({ config: state.config, currentModel: state.currentModel }),
    }
  )
);
