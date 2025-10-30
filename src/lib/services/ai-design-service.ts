import { supabase } from "@/supabase-client";
import { getCustomerId } from "@/app/lib/customerFunctions";

// AI Design Response Types
export interface AIDesignResponse {
  design: {
    pen: {
      pentype: string;
      total_cost: number;
    };
    ink: {
      ink_type_id: number;
      type_name: string;
      description: string;
      color_name: string;
      hexcode: string;
      cost: number;
      hexcode_display: string;
    };
    barrel: {
      barrel_id: number;
      grip_type: string;
      shape: string;
      description: string;
      cost: number;
    };
    cap: {
      cap_type_id: number;
      description: string;
      cost: number;
    };
    nib: {
      nibtype_id: number;
      description: string;
      size: string;
      cost: number;
    };
    engraving: {
      engraving_id: number;
      font: string;
      type_name: string;
      description: string;
      cost: number;
    };
  };
  confidence_scores: Record<string, number>;
  user_preferences: Record<string, any>;
  why_suggested: string;
}

/**
 * Get current customer ID from Supabase auth
 * Fallback to customer ID 2 if not authenticated
 */
async function getCustomerIdWithFallback(): Promise<number> {
  try {
    // Try to get the authenticated user
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      console.log("No authenticated user, using fallback customer ID 2");
      return 2;
    }

    // Try to get customer ID from database
    const customerId = await getCustomerId(data.user.id);

    if (!customerId) {
      console.log("Customer ID not found for user, using fallback customer ID 2");
      return 2;
    }

    return customerId;
  } catch (error) {
    console.log("Error getting customer ID, using fallback customer ID 2:", error);
    return 2;
  }
}

/**
 * Fetch AI design suggestion from the backend
 */
export async function fetchAIDesignSuggestion(): Promise<AIDesignResponse> {
  const customerId = await getCustomerIdWithFallback();

  const response = await fetch("/api/design", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: customerId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `Failed to fetch AI design: ${response.status}`);
  }

  return response.json();
}

/**
 * Map AI nib size to configurator nib size enum
 */
export function mapNibSize(aiSize: string): "EF" | "F" | "M" | "B" | "Stub" {
  const sizeMap: Record<string, "EF" | "F" | "M" | "B" | "Stub"> = {
    "Extra Fine": "EF",
    "Fine": "F",
    "Medium": "M",
    "Broad": "B",
    "Stub": "Stub",
  };

  return sizeMap[aiSize] || "M"; // Default to Medium if unknown
}

/**
 * Map AI engraving font to configurator font enum
 */
export function mapEngravingFont(
  aiFont: string
): "script" | "serif" | "sans" | "monospace" {
  const fontMap: Record<string, "script" | "serif" | "sans" | "monospace"> = {
    Script: "script",
    Serif: "serif",
    "Sans Serif": "sans",
    Monospace: "monospace",
  };

  return fontMap[aiFont] || "script"; // Default to script if unknown
}
