import amountDetails from "../data/amount-details.json";
import { supabase } from "@/supabase-client";

type LabourCharges = {
  manufacture?: number;
  assembly?: number;
  finishing?: number;
  total?: number;
  // Allow potential future keys
  [key: string]: number | undefined;
};

type ShippingCharges = {
  baseCost?: number;
  perUnitCost?: number;
  total?: number;
};

type AmountDetails = {
  currency?: string;
  minimumProductionAmount?: number;
  labourCharges?: LabourCharges;
  overheads?: Record<string, number>;
  packagingCostPerUnit?: number;
  shipping?: ShippingCharges;
  tax?: number;
  updatedAt?: string;
};

const details: AmountDetails = amountDetails as AmountDetails;

function getLabourTotal(labour?: LabourCharges): number {
  if (!labour) return 0;
  if (typeof labour.total === "number") return labour.total;
  return ["manufacture", "assembly", "finishing"]
    .map((k) => labour[k])
    .filter((v): v is number => typeof v === "number")
    .reduce((sum, v) => sum + v, 0);
}

function getShippingTotal(shipping?: ShippingCharges): number {
  if (!shipping) return 0;
  if (typeof shipping.total === "number") return shipping.total;
  const base = typeof shipping.baseCost === "number" ? shipping.baseCost : 0;
  const perUnit = typeof shipping.perUnitCost === "number" ? shipping.perUnitCost : 0;
  return base + perUnit;
}

function getPackaging(): number {
  return typeof details.packagingCostPerUnit === "number" ? details.packagingCostPerUnit : 0;
}

export function calculatePayable(cost: number, quantity: number, taxPercent?: number) {
  const labourTotal = getLabourTotal(details.labourCharges);
  const packaging = getPackaging();
  const shippingTotal = getShippingTotal(details.shipping);

  // Ignore overheads and minimumProductionAmount per requirements
  const perItemTotal = cost + labourTotal + packaging + shippingTotal;

  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
  const subtotal = perItemTotal * safeQuantity;

  const configuredTax: number = typeof details.tax === "number" && Number.isFinite(details.tax) && details.tax >= 0 ? details.tax : 0;
  const providedTax: number | null = typeof taxPercent === "number" && Number.isFinite(taxPercent) && taxPercent >= 0 ? taxPercent : null;
  const safeTaxPercent: number = providedTax !== null ? providedTax : configuredTax;
  const taxAmount = subtotal * (safeTaxPercent / 100);

  const totalWithTax = subtotal + taxAmount;
  return {subtotal, taxAmount, totalWithTax};
}

export type AmountSummary = {
  currency?: string;
  minimumProductionAmount?: number;
  labourTotal: number;
  packagingCostPerUnit: number;
  shippingTotal: number;
  taxPercent: number;
}

export function getAmountDetails(): AmountSummary {
  const labourTotal = getLabourTotal(details.labourCharges);
  const packagingCostPerUnit = getPackaging();
  const shippingTotal = getShippingTotal(details.shipping);
  return {
    currency: details.currency,
    minimumProductionAmount: details.minimumProductionAmount,
    labourTotal,
    packagingCostPerUnit,
    shippingTotal,
    taxPercent: typeof details.tax === "number" ? details.tax : 0,
  };
}


// Inventory check functions
export type InventoryInput = Record<string, number>;

export type InventoryAvailabilityItem = {
  material: string;
  requestedGrams: number;
  availableGrams: number;
  isAvailable: boolean;
};

export type InventoryAvailabilityResult = {
  items: InventoryAvailabilityItem[];
  unavailableMaterials: string[];
  allAvailable: boolean;
};

export async function checkInventory(materialWeights: InventoryInput): Promise<InventoryAvailabilityResult> {
  const requestedEntries = Object.entries(materialWeights).filter(([, v]) => typeof v === "number" && Number.isFinite(v) && v > 0);
  if (requestedEntries.length === 0) {
    return { items: [], unavailableMaterials: [], allAvailable: true };
  }

  const requestedMaterials = requestedEntries.map(([name]) => name);

  const { data, error } = await supabase
    .from("Inventory")
    .select("name, weight")
    .in("name", requestedMaterials);

  if (error) {
    console.error("Failed to fetch inventory:", error);
    // Conservatively treat as unavailable if we cannot verify
    const items: InventoryAvailabilityItem[] = requestedEntries.map(([material, requestedGrams]) => ({
      material,
      requestedGrams,
      availableGrams: 0,
      isAvailable: false,
    }));
    return { items, unavailableMaterials: items.map(i => i.material), allAvailable: false };
  }

  const nameToAvailable: Record<string, number> = {};
  for (const row of data ?? []) {
    // Expecting columns: name (string), weight (grams)
    if (row && typeof row.name === "string" && typeof row.weight === "number") {
      nameToAvailable[row.name] = row.weight;
    }
  }

  const items: InventoryAvailabilityItem[] = requestedEntries.map(([material, requestedGrams]) => {
    const availableGrams = typeof nameToAvailable[material] === "number" ? nameToAvailable[material] : 0;
    const isAvailable = availableGrams >= requestedGrams;
    return { material, requestedGrams, availableGrams, isAvailable };
  });

  const unavailableMaterials = items.filter(i => !i.isAvailable).map(i => i.material);
  const allAvailable = unavailableMaterials.length === 0;

  return { items, unavailableMaterials, allAvailable };
}

