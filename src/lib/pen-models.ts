import type { PenModel } from "@/types/configurator";

export interface PenModelMetadata {
  id: PenModel;
  name: string;
  tagline: string;
  description: string;
  personality: string;
  basePrice: number;
  features: string[];
  targetAudience: string;
}

export const PEN_MODELS: Record<PenModel, PenModelMetadata> = {
  zeus: {
    id: "zeus",
    name: "Zeus",
    tagline: "Command Authority",
    description:
      "Bold and powerful, the Zeus pen embodies executive presence. With its substantial weight and commanding proportions, this is the pen that seals the most important deals.",
    personality: "Powerful, authoritative, masculine, executive",
    basePrice: 1499,
    features: [
      "Hexagonal faceted cap design",
      "Larger executive-size proportions",
      "Crown-detailed clip",
      "Substantial weight for presence",
      "Premium piston filling mechanism",
    ],
    targetAudience: "CEOs, executives, professionals seeking power statement",
  },

  poseidon: {
    id: "poseidon",
    name: "Poseidon",
    tagline: "Flow with Elegance",
    description:
      "Streamlined and fluid, the Poseidon pen channels the grace of ocean waves. Its balanced proportions and flowing design make it perfect for extended writing sessions.",
    personality: "Flowing, balanced, versatile, nautical",
    basePrice: 1299,
    features: [
      "Streamlined torpedo shape",
      "Wave-inspired decorative bands",
      "Trident-motif clip design",
      "Perfect weight distribution",
      "Smooth, effortless writing experience",
    ],
    targetAudience: "Writers, creatives, professionals valuing balance",
  },

  hera: {
    id: "hera",
    name: "Hera",
    tagline: "Refined Grace",
    description:
      "Delicate yet confident, the Hera pen represents refined sophistication. Its slender profile and elegant details make it a timeless statement of grace.",
    personality: "Elegant, refined, graceful, feminine",
    basePrice: 999,
    features: [
      "Slimmer, elegant proportions",
      "Delicate filigree patterns",
      "Pearl and jewel accent options",
      "Softer, graceful curves",
      "Lightweight for extended use",
    ],
    targetAudience: "Professionals, writers, those appreciating refined aesthetics",
  },
};

export const getModelMetadata = (model: PenModel): PenModelMetadata => {
  return PEN_MODELS[model];
};

export const getAllModels = (): PenModelMetadata[] => {
  return Object.values(PEN_MODELS);
};
