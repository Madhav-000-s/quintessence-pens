import type { PenConfiguration } from "@/types/configurator";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a pen configuration before submitting
 */
export function validateConfiguration(config: PenConfiguration): ValidationResult {
  const errors: string[] = [];

  // Model validation
  if (!config.model || !["zeus", "poseidon", "hera"].includes(config.model)) {
    errors.push("Please select a valid pen model");
  }

  // Body configuration
  if (!config.bodyMaterial || config.bodyMaterial.trim() === "") {
    errors.push("Body material is required");
  }

  if (!config.bodyColor || !isValidHexColor(config.bodyColor)) {
    errors.push("Valid body color is required");
  }

  if (!config.bodyPattern) {
    errors.push("Body pattern is required");
  }

  if (!config.bodyFinish) {
    errors.push("Body finish is required");
  }

  // Nib configuration
  if (!config.nibSize) {
    errors.push("Nib size is required");
  }

  if (!config.nibMaterial) {
    errors.push("Nib material is required");
  }

  if (!config.nibStyle) {
    errors.push("Nib style is required");
  }

  // Trim configuration
  if (!config.trimFinish) {
    errors.push("Trim finish is required");
  }

  if (!config.clipStyle) {
    errors.push("Clip style is required");
  }

  // Engraving configuration
  if (config.engraving) {
    if (config.engraving.location !== "none" && !config.engraving.text) {
      errors.push("Engraving text is required when engraving location is selected");
    }

    if (config.engraving.location !== "none" && config.engraving.text && config.engraving.text.length > 50) {
      errors.push("Engraving text must be 50 characters or less");
    }
  } else {
    errors.push("Engraving configuration is required");
  }

  // Ink configuration
  if (!config.inkColor) {
    errors.push("Ink color is required");
  }

  // Preferences
  if (!config.handPreference) {
    errors.push("Hand preference is required");
  }

  if (!config.fillingMechanism) {
    errors.push("Filling mechanism is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a hex color code
 */
function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validate engraving text for special characters
 */
export function validateEngravingText(text: string): ValidationResult {
  const errors: string[] = [];

  if (!text || text.trim() === "") {
    errors.push("Engraving text cannot be empty");
  }

  if (text.length > 50) {
    errors.push("Engraving text must be 50 characters or less");
  }

  // Check for special characters that might not be supported
  const unsupportedChars = /[<>{}[\]\\|]/;
  if (unsupportedChars.test(text)) {
    errors.push("Engraving text contains unsupported special characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get a user-friendly error message summary
 */
export function getErrorSummary(errors: string[]): string {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0];
  return `${errors.length} validation errors:\n- ${errors.join("\n- ")}`;
}

/**
 * Quick validation check (returns boolean only)
 */
export function isConfigurationValid(config: PenConfiguration): boolean {
  return validateConfiguration(config).valid;
}
