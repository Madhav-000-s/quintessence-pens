import type { PenConfiguration } from "@/types/configurator";
import type {
  CapConfigRequest,
  CapConfigResponse,
  BarrelConfigRequest,
  BarrelConfigResponse,
  NibConfigRequest,
  NibConfigResponse,
  InkConfigRequest,
  InkConfigResponse,
  CreatePenRequest,
  CreatePenResponse,
} from "@/types/api";
import {
  zustandToCapConfigRequest,
  zustandToBarrelConfigRequest,
  zustandToNibConfigRequest,
  zustandToInkConfigRequest,
} from "@/lib/mappers/config-mapper";

/**
 * Create a cap configuration via API
 */
export async function createCapConfiguration(config: CapConfigRequest): Promise<CapConfigResponse> {
  const response = await fetch("/api/configure_cap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create cap configuration");
  }

  return response.json();
}

/**
 * Create a barrel configuration via API
 */
export async function createBarrelConfiguration(config: BarrelConfigRequest): Promise<BarrelConfigResponse> {
  const response = await fetch("/api/configure_barrel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create barrel configuration");
  }

  return response.json();
}

/**
 * Create a nib configuration via API
 */
export async function createNibConfiguration(config: NibConfigRequest): Promise<NibConfigResponse> {
  const response = await fetch("/api/configure_nib", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create nib configuration");
  }

  return response.json();
}

/**
 * Create an ink configuration via API
 */
export async function createInkConfiguration(config: InkConfigRequest): Promise<InkConfigResponse> {
  const response = await fetch("/api/configure_ink", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create ink configuration");
  }

  return response.json();
}

/**
 * Create a complete pen record via API
 */
export async function createCompletePen(penRequest: CreatePenRequest): Promise<CreatePenResponse> {
  const response = await fetch("/api/create_pen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(penRequest),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create pen");
  }

  return response.json();
}

/**
 * Submit complete configuration from Zustand state
 * This orchestrates all 5 API calls in sequence:
 * 1. Create cap config
 * 2. Create barrel config
 * 3. Create nib config
 * 4. Create ink config
 * 5. Create pen record
 */
export async function submitCompleteConfiguration(
  config: PenConfiguration,
  onProgress?: (step: string) => void
): Promise<{ penId: number; cost: number }> {
  try {
    // Step 1: Create cap configuration
    onProgress?.("cap");
    const capConfig = await createCapConfiguration(zustandToCapConfigRequest(config));

    // Step 2: Create barrel configuration
    onProgress?.("barrel");
    const barrelConfig = await createBarrelConfiguration(zustandToBarrelConfigRequest(config));

    // Step 3: Create nib configuration
    onProgress?.("nib");
    const nibConfig = await createNibConfiguration(zustandToNibConfigRequest(config));

    // Step 4: Create ink configuration
    onProgress?.("ink");
    const inkConfig = await createInkConfiguration(zustandToInkConfigRequest(config));

    // Step 5: Create complete pen
    onProgress?.("pen");
    const pen = await createCompletePen({
      pentype: config.model,
      cap_type_id: capConfig.cap_type_id,
      barrel_id: barrelConfig.barrel_id,
      nibtype_id: nibConfig.nib_id,
      ink_type_id: inkConfig.ink_type_id,
    });

    return {
      penId: pen.pen_id,
      cost: pen.cost,
    };
  } catch (error) {
    console.error("Error in submitCompleteConfiguration:", error);
    throw error;
  }
}

/**
 * Retry wrapper for API calls
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt + 1} failed:`, error);

      if (attempt < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}
