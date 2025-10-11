import { LucideIcon } from "lucide-react";

// Pen Model Types
export type PenModel = "zeus" | "poseidon" | "hera";

// Material Types
export type BodyMaterial =
  | "resin"
  | "metal"
  | "wood"
  | "carbon-fiber"
  | "lacquer";

export type BodyPattern =
  | "solid"
  | "marble"
  | "wood-grain"
  | "carbon-weave"
  | "pearl";

export type BodyFinish = "matte" | "glossy" | "satin";

// Nib Types
export type NibSize = "EF" | "F" | "M" | "B" | "Stub";

export type NibMaterial =
  | "steel"
  | "gold-14k"
  | "gold-18k"
  | "gold-21k"
  | "platinum";

export type NibStyle = "standard" | "italic" | "flex" | "architect";

// Trim Types
export type TrimFinish =
  | "yellow-gold"
  | "rose-gold"
  | "platinum"
  | "rhodium"
  | "black-chrome"
  | "brushed-steel";

export type ClipStyle = "classic" | "modern" | "minimalist" | "arrow";

// Engraving Types
export type EngravingLocation = "cap" | "barrel" | "clip" | "none";

export type EngravingFont =
  | "script"
  | "rounded"
  | "grotesque"
  | "serif"
  | "monospace";

export interface EngravingConfig {
  location: EngravingLocation;
  font: EngravingFont;
  text: string;
  line2?: string;
  line3?: string;
}

// Ink Types
export type InkColor =
  | "midnight-black"
  | "royal-blue"
  | "oxford-blue"
  | "emerald-green"
  | "burgundy"
  | "sepia-brown"
  | "purple"
  | "turquoise"
  | "crimson"
  | "forest-green"
  | "amber"
  | "charcoal";

// Complete Configuration
export interface PenConfiguration {
  // Model
  model: PenModel;

  // Body
  bodyMaterial: BodyMaterial;
  bodyColor: string; // Hex color
  bodyPattern: BodyPattern;
  bodyFinish: BodyFinish;

  // Nib
  nibSize: NibSize;
  nibMaterial: NibMaterial;
  nibStyle: NibStyle;

  // Trim
  trimFinish: TrimFinish;
  clipStyle: ClipStyle;

  // Engraving
  engraving: EngravingConfig;

  // Ink
  inkColor: InkColor;

  // Preferences
  handPreference: "left" | "right";
  fillingMechanism: "cartridge-converter" | "piston" | "vacuum";

  // Database IDs (for pricing and tracking)
  materialId?: number;
  designId?: number;
  coatingId?: number;
  engravingId?: number;
  capConfigId?: number;
  barrelConfigId?: number;
}

// Pricing
export interface PricingBreakdown {
  basePrice: number;
  bodyMaterialCost: number;
  nibMaterialCost: number;
  engravingCost: number;
  trimCost: number;
  designCost: number;
  coatingCost: number;
  total: number;
}

// Material Properties for 3D Rendering
export interface MaterialProperties {
  color: string;
  metalness: number;
  roughness: number;
  emissive?: string;
  emissiveIntensity?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
}

// Configuration Section
export type ConfigSection =
  | "body"
  | "nib"
  | "trim"
  | "engraving"
  | "ink"
  | "review";

export interface ConfigSectionInfo {
  id: ConfigSection;
  title: string;
  description: string;
  icon: LucideIcon;
}

// Preset Configurations
export interface PresetConfig {
  name: string;
  description: string;
  config: PenConfiguration;
  thumbnail?: string;
  price: number;
}

// Pen Preset (for product catalog)
export interface PenPreset {
  id: string;
  name: string;
  model: PenModel;
  description: string;
  thumbnail?: string;
  basePrice: number;
  config: PenConfiguration;
  featured: boolean;
}

// Color Palette
export interface ColorOption {
  name: string;
  hex: string;
  category: "neutral" | "warm" | "cool" | "metallic" | "vibrant";
}

// Export/Share
export interface ConfigurationExport {
  version: string;
  timestamp: number;
  config: PenConfiguration;
  pricing: PricingBreakdown;
}
