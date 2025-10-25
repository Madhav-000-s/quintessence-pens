import type {
  BodyMaterial,
  TrimFinish,
  InkColor,
  MaterialProperties,
  ColorOption,
  NibSize,
  NibMaterial,
} from "@/types/configurator";

// Material properties for 3D rendering
export const getMaterialProperties = (
  material: BodyMaterial,
  color: string,
  finish: "matte" | "glossy" | "satin"
): MaterialProperties => {
  const baseProps: MaterialProperties = {
    color,
    metalness: 0,
    roughness: 0.5,
  };

  switch (material) {
    case "metal":
      return {
        ...baseProps,
        metalness: 1.0,
        roughness: finish === "matte" ? 0.4 : finish === "glossy" ? 0.05 : 0.2,
        clearcoat: finish === "glossy" ? 1 : finish === "satin" ? 0.3 : 0,
        clearcoatRoughness: 0.08,
        emissive: color,
        emissiveIntensity: 0.02,
      };

    case "resin":
      return {
        ...baseProps,
        metalness: 0,
        roughness: finish === "matte" ? 0.6 : finish === "glossy" ? 0.15 : 0.35,
        clearcoat: finish === "glossy" ? 1.0 : finish === "satin" ? 0.5 : 0.2,
        clearcoatRoughness: finish === "glossy" ? 0.1 : 0.3,
        emissive: color,
        emissiveIntensity: 0.05,
      };

    case "wood":
      return {
        ...baseProps,
        metalness: 0,
        roughness: finish === "matte" ? 0.8 : finish === "glossy" ? 0.25 : 0.5,
        clearcoat: finish === "glossy" ? 0.7 : finish === "satin" ? 0.3 : 0,
        clearcoatRoughness: finish === "glossy" ? 0.2 : 0.4,
      };

    case "carbon-fiber":
      return {
        ...baseProps,
        metalness: 0.4,
        roughness: finish === "matte" ? 0.5 : finish === "glossy" ? 0.2 : 0.35,
        clearcoat: finish === "glossy" ? 0.8 : finish === "satin" ? 0.4 : 0.2,
        clearcoatRoughness: 0.15,
        emissive: color,
        emissiveIntensity: 0.03,
      };

    case "lacquer":
      return {
        ...baseProps,
        metalness: 0,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        emissive: color,
        emissiveIntensity: 0.08,
      };

    default:
      return baseProps;
  }
};

// Trim finish properties
export const getTrimProperties = (finish: TrimFinish): MaterialProperties => {
  switch (finish) {
    case "yellow-gold":
      return {
        color: "#FFD700",
        metalness: 1,
        roughness: 0.12,
        emissive: "#FFD700",
        emissiveIntensity: 0.03,
      };

    case "rose-gold":
      return {
        color: "#B76E79",
        metalness: 1,
        roughness: 0.15,
        emissive: "#B76E79",
        emissiveIntensity: 0.025,
      };

    case "platinum":
      return {
        color: "#E5E4E2",
        metalness: 1,
        roughness: 0.08,
        emissive: "#E5E4E2",
        emissiveIntensity: 0.02,
      };

    case "rhodium":
      return {
        color: "#D4D4D4",
        metalness: 1,
        roughness: 0.06,
        emissive: "#D4D4D4",
        emissiveIntensity: 0.025,
      };

    case "black-chrome":
      return {
        color: "#1a1a1a",
        metalness: 1,
        roughness: 0.18,
        emissive: "#1a1a1a",
        emissiveIntensity: 0.01,
      };

    case "brushed-steel":
      return {
        color: "#C0C0C0",
        metalness: 0.9,
        roughness: 0.35,
      };

    default:
      return {
        color: "#C0C0C0",
        metalness: 1,
        roughness: 0.15,
      };
  }
};

// Ink color palette
export const inkColors: Record<InkColor, string> = {
  "midnight-black": "#000000",
  "royal-blue": "#002366",
  "oxford-blue": "#002147",
  "emerald-green": "#046307",
  burgundy: "#800020",
  "sepia-brown": "#704214",
  purple: "#4B0082",
  turquoise: "#008B8B",
  crimson: "#DC143C",
  "forest-green": "#014421",
  amber: "#FFBF00",
  charcoal: "#36454F",
};

// Body color palette
export const bodyColorPalette: ColorOption[] = [
  // Neutrals
  { name: "Midnight Black", hex: "#1a1a2e", category: "neutral" },
  { name: "Charcoal", hex: "#2d3142", category: "neutral" },
  { name: "Slate Gray", hex: "#4f5d75", category: "neutral" },
  { name: "Pearl White", hex: "#f8f9fa", category: "neutral" },
  { name: "Ivory", hex: "#fffff0", category: "neutral" },

  // Warm
  { name: "Burgundy", hex: "#800020", category: "warm" },
  { name: "Deep Red", hex: "#8b0000", category: "warm" },
  { name: "Cognac", hex: "#9a3324", category: "warm" },
  { name: "Amber", hex: "#d4a574", category: "warm" },
  { name: "Copper", hex: "#b87333", category: "warm" },

  // Cool
  { name: "Navy Blue", hex: "#000080", category: "cool" },
  { name: "Royal Blue", hex: "#002366", category: "cool" },
  { name: "Teal", hex: "#008080", category: "cool" },
  { name: "Forest Green", hex: "#014421", category: "cool" },
  { name: "Deep Purple", hex: "#4b0082", category: "cool" },

  // Metallic
  { name: "Gunmetal", hex: "#2a3439", category: "metallic" },
  { name: "Bronze", hex: "#cd7f32", category: "metallic" },
  { name: "Champagne", hex: "#f7e7ce", category: "metallic" },
  { name: "Rose Gold", hex: "#b76e79", category: "metallic" },
  { name: "Silver", hex: "#c0c0c0", category: "metallic" },

  // Vibrant
  { name: "Emerald", hex: "#50c878", category: "vibrant" },
  { name: "Sapphire", hex: "#0f52ba", category: "vibrant" },
  { name: "Ruby", hex: "#e0115f", category: "vibrant" },
  { name: "Citrine", hex: "#e4d00a", category: "vibrant" },
  { name: "Amethyst", hex: "#9966cc", category: "vibrant" },
];

// Nib size descriptions
export const nibSizeDescriptions: Record<NibSize, string> = {
  EF: "Extra Fine - Precise, delicate lines (~0.4mm)",
  F: "Fine - Ideal for small handwriting (~0.5mm)",
  M: "Medium - Versatile, most popular (~0.6mm)",
  B: "Broad - Bold, expressive strokes (~0.8mm)",
  Stub: "Stub - Line variation for calligraphy (~1.0mm)",
};

// Nib material descriptions
export const nibMaterialDescriptions: Record<NibMaterial, string> = {
  steel: "Durable, consistent, great for daily use",
  "gold-14k": "Softer, develops character over time",
  "gold-18k": "Premium flexibility, smooth writing",
  "gold-21k": "Exceptional softness and line variation",
  platinum: "Ultra-premium, corrosion resistant",
};

// URL encoding for sharing
export const encodeConfigToURL = (config: any): string => {
  const encoded = btoa(JSON.stringify(config));
  return encoded;
};

export const decodeConfigFromURL = (encoded: string): any => {
  try {
    const decoded = atob(encoded);
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Failed to decode configuration:", error);
    return null;
  }
};

// Format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Validation
export const validateEngravingText = (
  text: string
): { valid: boolean; message?: string } => {
  if (text.length === 0) {
    return { valid: true };
  }

  if (text.length > 30) {
    return { valid: false, message: "Text too long (max 30 characters)" };
  }

  // Check for invalid characters
  const validPattern = /^[a-zA-Z0-9\s\-'".&]+$/;
  if (!validPattern.test(text)) {
    return { valid: false, message: "Contains invalid characters" };
  }

  return { valid: true };
};
