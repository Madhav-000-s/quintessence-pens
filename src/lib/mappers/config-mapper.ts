import type { PenConfiguration } from "@/types/configurator";
import type {
  CapConfigRequest,
  BarrelConfigRequest,
  NibConfigRequest,
  InkConfigRequest,
} from "@/types/api";

/**
 * Convert Zustand configurator state to Cap Configuration API request format
 */
export function zustandToCapConfigRequest(config: PenConfiguration): CapConfigRequest {
  return {
    description: `${config.model} cap with ${config.bodyMaterial} material and ${config.bodyFinish} finish`,
    material: {
      name: config.bodyMaterial,
    },
    design: {
      description: `${config.bodyPattern} pattern`,
      font: config.engraving.font,
      colour: extractColorName(config.bodyColor),
      hex_code: config.bodyColor,
    },
    engraving: {
      font: config.engraving.font,
      type_name: config.engraving.location !== "none" ? "Custom" : "None",
      description: config.engraving.text || "No engraving",
    },
    clip_design: {
      description: `${config.clipStyle} clip`,
      material: mapTrimToMaterial(config.trimFinish),
      design: {
        description: `${config.clipStyle} design`,
        font: "Sans-serif",
        colour: mapTrimToColor(config.trimFinish),
        hex_code: mapTrimToHex(config.trimFinish),
      },
      engraving: {
        font: config.engraving.font,
        type_name: "None",
        description: "No clip engraving",
      },
    },
    coating: {
      colour: config.bodyFinish,
      hex_code: config.bodyColor,
      type: mapFinishToCoatingType(config.bodyFinish),
    },
  };
}

/**
 * Convert Zustand configurator state to Barrel Configuration API request format
 */
export function zustandToBarrelConfigRequest(config: PenConfiguration): BarrelConfigRequest {
  return {
    description: `${config.model} barrel with ${config.bodyMaterial} material`,
    grip_type: config.fillingMechanism === "piston" ? "Textured" : "Smooth",
    shape: mapModelToBarrelShape(config.model),
    material: {
      name: config.bodyMaterial,
    },
    design: {
      description: `${config.bodyPattern} barrel pattern`,
      font: "Sans-serif",
      colour: extractColorName(config.bodyColor),
      hex_code: config.bodyColor,
    },
    engraving: {
      font: config.engraving.font,
      type_name: config.engraving.location === "barrel" ? "Custom" : "None",
      description: config.engraving.location === "barrel" ? config.engraving.text : "No engraving",
    },
    coating: {
      colour: config.bodyFinish,
      hex_code: config.bodyColor,
      type: mapFinishToCoatingType(config.bodyFinish),
    },
  };
}

/**
 * Convert Zustand configurator state to Nib Configuration API request format
 */
export function zustandToNibConfigRequest(config: PenConfiguration): NibConfigRequest {
  return {
    description: `${config.nibSize} ${config.nibMaterial} nib with ${config.nibStyle} style`,
    size: config.nibSize,
    material: {
      name: mapNibMaterialToName(config.nibMaterial),
    },
    design: {
      description: `${config.nibStyle} nib design`,
      font: "Serif",
      colour: mapNibMaterialToColor(config.nibMaterial),
      hex_code: mapNibMaterialToHex(config.nibMaterial),
    },
  };
}

/**
 * Convert Zustand configurator state to Ink Configuration API request format
 */
export function zustandToInkConfigRequest(config: PenConfiguration): InkConfigRequest {
  return {
    description: `${config.inkColor} fountain pen ink`,
    type_name: mapInkColorToType(config.inkColor),
    colour: config.inkColor,
    hex_code: mapInkColorToHex(config.inkColor),
  };
}

// ============================================
// Helper Mapping Functions
// ============================================

function extractColorName(hexColor: string): string {
  const colorMap: Record<string, string> = {
    "#1a1a2e": "Midnight Black",
    "#002366": "Royal Blue",
    "#800020": "Burgundy",
    "#2C5F2D": "Forest Green",
    "#4A0E0E": "Deep Red",
    "#1C1C1C": "Black",
    "#FFFFFF": "White",
    "#FFD700": "Gold",
    "#C0C0C0": "Silver",
  };

  return colorMap[hexColor] || "Custom Color";
}

function mapTrimToMaterial(trimFinish: string): string {
  const trimMap: Record<string, string> = {
    "yellow-gold": "Gold",
    "rose-gold": "Gold",
    "platinum": "Platinum",
    "rhodium": "Steel",
    "black-chrome": "Chrome",
    "brushed-steel": "Steel",
  };

  return trimMap[trimFinish] || "Steel";
}

function mapTrimToColor(trimFinish: string): string {
  const colorMap: Record<string, string> = {
    "yellow-gold": "Gold",
    "rose-gold": "Rose Gold",
    "platinum": "Silver",
    "rhodium": "Silver",
    "black-chrome": "Black",
    "brushed-steel": "Silver",
  };

  return colorMap[trimFinish] || "Silver";
}

function mapTrimToHex(trimFinish: string): string {
  const hexMap: Record<string, string> = {
    "yellow-gold": "#FFD700",
    "rose-gold": "#B76E79",
    "platinum": "#E5E4E2",
    "rhodium": "#C0C0C0",
    "black-chrome": "#1C1C1C",
    "brushed-steel": "#B0B0B0",
  };

  return hexMap[trimFinish] || "#C0C0C0";
}

function mapFinishToCoatingType(finish: string): string {
  const typeMap: Record<string, string> = {
    "matte": "Matte",
    "glossy": "Glossy",
    "satin": "Satin",
  };

  return typeMap[finish] || "Glossy";
}

function mapModelToBarrelShape(model: string): string {
  const shapeMap: Record<string, string> = {
    "zeus": "Cylindrical",
    "poseidon": "Torpedo",
    "hera": "Tapered",
    "athena": "Cigar",
  };

  return shapeMap[model] || "Cylindrical";
}

function mapNibMaterialToName(nibMaterial: string): string {
  const materialMap: Record<string, string> = {
    "steel": "Stainless Steel",
    "gold-14k": "14K Gold",
    "gold-18k": "18K Gold",
    "gold-21k": "21K Gold",
    "platinum": "Platinum",
  };

  return materialMap[nibMaterial] || "Stainless Steel";
}

function mapNibMaterialToColor(nibMaterial: string): string {
  const colorMap: Record<string, string> = {
    "steel": "Silver",
    "gold-14k": "Gold",
    "gold-18k": "Gold",
    "gold-21k": "Gold",
    "platinum": "Silver",
  };

  return colorMap[nibMaterial] || "Silver";
}

function mapNibMaterialToHex(nibMaterial: string): string {
  const hexMap: Record<string, string> = {
    "steel": "#C0C0C0",
    "gold-14k": "#FFD700",
    "gold-18k": "#FFD700",
    "gold-21k": "#FFD700",
    "platinum": "#E5E4E2",
  };

  return hexMap[nibMaterial] || "#C0C0C0";
}

function mapInkColorToType(inkColor: string): string {
  const typeMap: Record<string, string> = {
    "midnight-black": "Waterproof Black",
    "royal-blue": "Waterproof Blue",
    "oxford-blue": "Standard Blue",
    "emerald-green": "Standard Green",
    "burgundy": "Standard Red",
    "sepia-brown": "Standard Brown",
    "purple": "Standard Purple",
    "turquoise": "Standard Blue",
    "crimson": "Standard Red",
    "forest-green": "Standard Green",
    "amber": "Standard Brown",
    "charcoal": "Standard Black",
  };

  return typeMap[inkColor] || "Standard Black";
}

function mapInkColorToHex(inkColor: string): string {
  const hexMap: Record<string, string> = {
    "midnight-black": "#000000",
    "royal-blue": "#002366",
    "oxford-blue": "#002147",
    "emerald-green": "#50C878",
    "burgundy": "#800020",
    "sepia-brown": "#704214",
    "purple": "#800080",
    "turquoise": "#40E0D0",
    "crimson": "#DC143C",
    "forest-green": "#228B22",
    "amber": "#FFBF00",
    "charcoal": "#36454F",
  };

  return hexMap[inkColor] || "#000000";
}
