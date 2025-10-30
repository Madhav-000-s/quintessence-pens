import type {
  BodyMaterial,
  BodyFinish,
  TrimFinish,
  ColorOption,
  EngravingFont,
  NibSize,
  NibMaterial,
} from "@/types/configurator";
import type {
  DBMaterial,
  DBDesign,
  DBCoating,
  DBEngraving,
  DBCapConfig,
  DBBarrelConfig,
} from "@/lib/supabase/configurator-api";

// Material adapter
export interface MaterialOption {
  value: string;
  label: string;
  description: string;
  cost: number;
  weight?: number;
  materialId: number;
}

// Helper: Deduplicate materials by name (keep lowest cost)
function deduplicateMaterials(materials: MaterialOption[]): MaterialOption[] {
  const uniqueMap = new Map<string, MaterialOption>();

  for (const material of materials) {
    const key = material.label.toLowerCase().trim();
    const existing = uniqueMap.get(key);

    // Keep the one with lower cost, or first one if costs are equal
    if (!existing || material.cost < existing.cost) {
      uniqueMap.set(key, material);
    }
  }

  return Array.from(uniqueMap.values());
}

export function adaptMaterialsToOptions(
  materials: DBMaterial[]
): MaterialOption[] {
  if (!materials || materials.length === 0) {
    // Fallback to hardcoded materials
    return [
      {
        value: "resin",
        label: "Resin",
        description: "Classic, lightweight, vibrant colors",
        cost: 0,
        materialId: 0,
      },
      {
        value: "metal",
        label: "Metal",
        description: "Premium weight, durable, elegant",
        cost: 150,
        materialId: 0,
      },
      {
        value: "wood",
        label: "Wood",
        description: "Natural grain, unique, warm feel",
        cost: 100,
        materialId: 0,
      },
      {
        value: "carbon-fiber",
        label: "Carbon Fiber",
        description: "Modern, strong, distinctive pattern",
        cost: 200,
        materialId: 0,
      },
      {
        value: "lacquer",
        label: "Urushi Lacquer",
        description: "Ultra-premium, glossy, Japanese tradition",
        cost: 250,
        materialId: 0,
      },
    ];
  }

  const mappedMaterials = materials.map((material) => ({
    value: `${(material.name || "unknown").toLowerCase().replace(/\s+/g, "-")}-${material.id}`,
    label: material.name || "Unknown Material",
    description: `Premium ${material.name} material`,
    cost: material.cost || 0,
    weight: material.weight || undefined,
    materialId: material.id,
  }));

  // Deduplicate by material name, keeping lowest cost option
  return deduplicateMaterials(mappedMaterials);
}

// Color + Design adapter
export interface ColorDesignOption extends ColorOption {
  designId: number;
  cost: number;
  font?: string;
}

// Helper: Deduplicate colors by hex code (keep lowest cost)
function deduplicateColors(colors: ColorDesignOption[]): ColorDesignOption[] {
  const uniqueMap = new Map<string, ColorDesignOption>();

  for (const color of colors) {
    const key = color.hex.toLowerCase();
    const existing = uniqueMap.get(key);

    // Keep the one with lower cost, or first one if costs are equal
    if (!existing || color.cost < existing.cost) {
      uniqueMap.set(key, color);
    }
  }

  return Array.from(uniqueMap.values());
}

export function adaptDesignsToColors(
  designs: DBDesign[]
): ColorDesignOption[] {
  if (!designs || designs.length === 0) {
    // Fallback to hardcoded colors
    return [
      {
        name: "Midnight Black",
        hex: "#1a1a2e",
        category: "neutral",
        designId: 0,
        cost: 0,
      },
      {
        name: "Royal Blue",
        hex: "#002366",
        category: "cool",
        designId: 0,
        cost: 0,
      },
      {
        name: "Burgundy",
        hex: "#800020",
        category: "warm",
        designId: 0,
        cost: 0,
      },
    ];
  }

  const mappedColors = designs.map((design) => {
    // Fix hex code if needed (some have incorrect values in DB)
    let hexCode = design.hex_code || "#000000";
    if (!hexCode.startsWith("#")) {
      hexCode = "#" + hexCode;
    }
    // If hex is obviously wrong, use a fallback based on color name
    if (hexCode === "#0000FF" && design.colour !== "blue") {
      hexCode = getColorHexFallback(design.colour || "");
    }

    const cost = design.cost ? parseFloat(design.cost) : 0;

    return {
      name: design.colour || "Unknown Color",
      hex: hexCode,
      category: categorizeColor(design.colour || ""),
      designId: design.design_id,
      cost,
      font: design.font || undefined,
    };
  });

  // Deduplicate by hex code, keeping lowest cost option
  return deduplicateColors(mappedColors);
}

// Coating adapter
export interface CoatingOption {
  coatingId: number;
  colour: string;
  hexCode: string;
  finish: BodyFinish;
  cost: number;
}

export function adaptCoatingsToOptions(
  coatings: DBCoating[]
): CoatingOption[] {
  if (!coatings || coatings.length === 0) {
    return [];
  }

  return coatings.map((coating) => {
    let hexCode = coating.hex_code || "#FFFFFF";
    if (!hexCode.startsWith("#")) {
      hexCode = "#" + hexCode;
    }

    // Normalize finish type (handle "matt" vs "matte")
    let finish: BodyFinish = "glossy";
    const type = (coating.type || "").toLowerCase();
    if (type === "matte" || type === "matt") {
      finish = "matte";
    } else if (type === "satin") {
      finish = "satin";
    }

    return {
      coatingId: coating.coating_id,
      colour: coating.colour || "Unknown",
      hexCode,
      finish,
      cost: 0, // Coatings don't seem to have cost in current schema
    };
  });
}

// Engraving adapter
export interface EngravingOption {
  engravingId: number;
  typeName: string;
  font: EngravingFont;
  description: string;
  cost: number;
}

export function adaptEngravingsToOptions(
  engravings: DBEngraving[]
): EngravingOption[] {
  if (!engravings || engravings.length === 0) {
    return [
      {
        engravingId: 0,
        typeName: "Standard",
        font: "script",
        description: "Classic script engraving",
        cost: 50,
      },
    ];
  }

  return engravings.map((engraving) => {
    const cost = engraving.cost ? parseFloat(engraving.cost) : 50;
    const font = mapFontToEngravingFont(engraving.font || "Arial");

    return {
      engravingId: engraving.engraving_id,
      typeName: engraving.type_name || "Custom",
      font,
      description: engraving.description || "Custom engraving",
      cost,
    };
  });
}

// Trim finish adapter
export interface TrimOption {
  value: TrimFinish;
  label: string;
  cost: number;
  designId?: number;
}

// Helper: Deduplicate trim finishes by value (keep lowest cost)
function deduplicateTrimFinishes(trims: TrimOption[]): TrimOption[] {
  const uniqueMap = new Map<TrimFinish, TrimOption>();

  for (const trim of trims) {
    const existing = uniqueMap.get(trim.value);

    // Keep the one with lower cost, or first one if costs are equal
    if (!existing || trim.cost < existing.cost) {
      uniqueMap.set(trim.value, trim);
    }
  }

  return Array.from(uniqueMap.values());
}

export function adaptDesignsToTrimFinishes(
  designs: DBDesign[]
): TrimOption[] {
  if (!designs || designs.length === 0) {
    // Fallback to hardcoded trim finishes
    return [
      { value: "rhodium", label: "Rhodium", cost: 0 },
      { value: "yellow-gold", label: "Yellow Gold", cost: 100 },
      { value: "rose-gold", label: "Rose Gold", cost: 100 },
      { value: "platinum", label: "Platinum", cost: 150 },
      { value: "black-chrome", label: "Black Chrome", cost: 50 },
      { value: "brushed-steel", label: "Brushed Steel", cost: 0 },
    ];
  }

  // Map design colors to trim finishes
  const trimMap: Record<string, TrimFinish> = {
    gold: "yellow-gold",
    silver: "rhodium",
    blue: "rhodium",
    green: "rhodium",
  };

  const mappedTrims = designs
    .filter((design) => design.colour && trimMap[design.colour.toLowerCase()])
    .map((design) => {
      const colour = design.colour?.toLowerCase() || "";
      const value = trimMap[colour] || "rhodium";
      const cost = design.cost ? parseFloat(design.cost) : 0;

      return {
        value,
        label: capitalizeWords(design.colour || ""),
        cost,
        designId: design.design_id,
      };
    });

  // Deduplicate by trim finish value, keeping lowest cost option
  return deduplicateTrimFinishes(mappedTrims);
}

// Helper functions
function categorizeColor(
  colorName: string
): "neutral" | "warm" | "cool" | "metallic" | "vibrant" {
  const name = colorName.toLowerCase();

  if (["black", "white", "gray", "grey", "silver"].some((c) => name.includes(c))) {
    return "neutral";
  }
  if (["gold", "bronze", "copper"].some((c) => name.includes(c))) {
    return "metallic";
  }
  if (["red", "orange", "yellow", "amber"].some((c) => name.includes(c))) {
    return "warm";
  }
  if (["blue", "green", "purple", "teal"].some((c) => name.includes(c))) {
    return "cool";
  }
  return "vibrant";
}

function getColorHexFallback(colorName: string): string {
  const colorMap: Record<string, string> = {
    blue: "#0000FF",
    green: "#00FF00",
    red: "#FF0000",
    silver: "#C0C0C0",
    gold: "#FFD700",
    black: "#000000",
    white: "#FFFFFF",
  };

  const name = colorName.toLowerCase();
  for (const [key, hex] of Object.entries(colorMap)) {
    if (name.includes(key)) {
      return hex;
    }
  }

  return "#808080"; // Gray fallback
}

function mapFontToEngravingFont(fontName: string): EngravingFont {
  const font = fontName.toLowerCase();

  if (font.includes("script") || font.includes("cursive")) {
    return "script";
  }
  if (font.includes("serif")) {
    return "serif";
  }
  if (font.includes("mono")) {
    return "monospace";
  }
  if (font.includes("round")) {
    return "rounded";
  }

  return "script"; // Default
}

function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Calculate configuration cost from database
export interface ConfigCostBreakdown {
  materialCost: number;
  designCost: number;
  coatingCost: number;
  engravingCost: number;
  total: number;
}

export function calculateConfigCost(
  materialId: number | null,
  designId: number | null,
  coatingId: number | null,
  engravingId: number | null,
  materials: DBMaterial[],
  designs: DBDesign[],
  coatings: DBCoating[],
  engravings: DBEngraving[]
): ConfigCostBreakdown {
  let materialCost = 0;
  let designCost = 0;
  let coatingCost = 0;
  let engravingCost = 0;

  if (materialId) {
    const material = materials.find((m) => m.id === materialId);
    materialCost = material?.cost || 0;
  }

  if (designId) {
    const design = designs.find((d) => d.design_id === designId);
    designCost = design?.cost ? parseFloat(design.cost) : 0;
  }

  if (coatingId) {
    const coating = coatings.find((c) => c.coating_id === coatingId);
    // Coatings don't have cost field in current schema
    coatingCost = 0;
  }

  if (engravingId) {
    const engraving = engravings.find((e) => e.engraving_id === engravingId);
    engravingCost = engraving?.cost ? parseFloat(engraving.cost) : 0;
  }

  const total = materialCost + designCost + coatingCost + engravingCost;

  return {
    materialCost,
    designCost,
    coatingCost,
    engravingCost,
    total,
  };
}
