import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PenConfiguration,
  ConfigSection,
  PricingBreakdown,
  PenModel,
} from "@/types/configurator";
import {
  fetchMaterials,
  fetchDesigns,
  fetchCoatings,
  fetchEngravings,
  type DBMaterial,
  type DBDesign,
  type DBCoating,
  type DBEngraving
} from "@/lib/supabase/configurator-api";
import { calculateConfigCost } from "@/lib/adapters/configurator-adapters";

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

// Cache for database data
let dbMaterials: DBMaterial[] = [];
let dbDesigns: DBDesign[] = [];
let dbCoatings: DBCoating[] = [];
let dbEngravings: DBEngraving[] = [];
let dbDataLoaded = false;

// Load database data for pricing calculations
const loadDatabaseData = async () => {
  if (dbDataLoaded) return;

  try {
    [dbMaterials, dbDesigns, dbCoatings, dbEngravings] = await Promise.all([
      fetchMaterials(),
      fetchDesigns(),
      fetchCoatings(),
      fetchEngravings(),
    ]);
    dbDataLoaded = true;
  } catch (error) {
    console.error("Failed to load database data for pricing:", error);
  }
};

// Initialize database data (non-blocking)
loadDatabaseData();

// Pricing logic - uses database data when available, falls back to hardcoded prices
const calculatePricingBreakdown = async (
  config: PenConfiguration
): Promise<PricingBreakdown> => {
  const basePrice = MODEL_BASE_PRICES[config.model] || 999;

  // Try to use database data if available
  if (dbDataLoaded && (config.materialId || config.designId || config.engravingId)) {
    const dbCosts = calculateConfigCost(
      config.materialId || null,
      config.designId || null,
      config.coatingId || null,
      config.engravingId || null,
      dbMaterials,
      dbDesigns,
      dbCoatings,
      dbEngravings
    );

    return {
      basePrice,
      bodyMaterialCost: dbCosts.materialCost,
      nibMaterialCost: getNibMaterialCost(config.nibMaterial),
      engravingCost: config.engraving.location !== "none" ? dbCosts.engravingCost : 0,
      trimCost: 0, // Trim cost from design
      designCost: dbCosts.designCost,
      coatingCost: dbCosts.coatingCost,
      total: basePrice + dbCosts.materialCost + getNibMaterialCost(config.nibMaterial) +
        (config.engraving.location !== "none" ? dbCosts.engravingCost : 0) + dbCosts.designCost + dbCosts.coatingCost,
    };
  }

  // Fallback to hardcoded prices
  const bodyMaterialCosts: Record<string, number> = {
    resin: 0,
    metal: 150,
    wood: 100,
    "carbon-fiber": 200,
    lacquer: 250,
  };

  const trimCosts: Record<string, number> = {
    rhodium: 0,
    "brushed-steel": 0,
    "yellow-gold": 100,
    "rose-gold": 100,
    platinum: 150,
    "black-chrome": 50,
  };

  const engravingCost = config.engraving.location !== "none" ? 50 : 0;
  const bodyMaterialCost = bodyMaterialCosts[config.bodyMaterial] || 0;
  const nibMaterialCost = getNibMaterialCost(config.nibMaterial);
  const trimCost = trimCosts[config.trimFinish] || 0;

  const total =
    basePrice + bodyMaterialCost + nibMaterialCost + trimCost + engravingCost;

  return {
    basePrice,
    bodyMaterialCost,
    nibMaterialCost,
    engravingCost,
    trimCost,
    designCost: 0,
    coatingCost: 0,
    total,
  };
};

// Helper for nib material costs (still hardcoded as NibConfig is empty)
function getNibMaterialCost(nibMaterial: string): number {
  const nibMaterialCosts: Record<string, number> = {
    steel: 0,
    "gold-14k": 200,
    "gold-18k": 350,
    "gold-21k": 500,
    platinum: 600,
  };
  return nibMaterialCosts[nibMaterial] || 0;
}

// Initial pricing calculation (synchronous fallback)
const initialConfig = createDefaultConfig("zeus");
let initialPricing: PricingBreakdown = {
  basePrice: MODEL_BASE_PRICES["zeus"],
  bodyMaterialCost: 0,
  nibMaterialCost: 0,
  engravingCost: 0,
  trimCost: 0,
  designCost: 0,
  coatingCost: 0,
  total: MODEL_BASE_PRICES["zeus"],
};

// Update initial pricing asynchronously
calculatePricingBreakdown(initialConfig).then((pricing) => {
  initialPricing = pricing;
  // Update store if it's already been created
  if (typeof window !== 'undefined') {
    try {
      useConfiguratorStore.getState().calculatePricing();
    } catch (e) {
      // Store not yet initialized
    }
  }
});

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set, get) => ({
      config: initialConfig,
      currentModel: "zeus",
      currentSection: "body",
      isAnimating: false,
      isPricingDrawerOpen: false,
      pricing: initialPricing,

      updateConfig: (key, value) => {
        set((state) => {
          const newConfig = { ...state.config, [key]: value };
          // Update config immediately, pricing will be updated asynchronously
          calculatePricingBreakdown(newConfig).then((pricing) => {
            set({ pricing });
          });
          return {
            config: newConfig,
          };
        });
      },

      setModel: (model) => {
        const newConfig = createDefaultConfig(model);
        calculatePricingBreakdown(newConfig).then((pricing) => {
          set({ pricing });
        });
        set({
          currentModel: model,
          config: newConfig,
        });
      },

      loadPreset: (presetId) => {
        // Import preset from presets file
        import("@/lib/pen-presets").then(({ PEN_PRESETS }) => {
          const preset = PEN_PRESETS.find((p) => p.id === presetId);
          if (preset) {
            calculatePricingBreakdown(preset.config).then((pricing) => {
              set({ pricing });
            });
            set({
              currentModel: preset.model,
              config: preset.config,
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
        calculatePricingBreakdown(newConfig).then((pricing) => {
          set({ pricing });
        });
        set({
          config: newConfig,
        });
      },

      calculatePricing: () => {
        const { config } = get();
        calculatePricingBreakdown(config).then((pricing) => {
          set({ pricing });
        });
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
            calculatePricingBreakdown(data.config).then((pricing) => {
              set({ pricing });
            });
            set({
              currentModel: data.config.model,
              config: data.config,
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
