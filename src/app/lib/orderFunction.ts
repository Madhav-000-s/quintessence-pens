import amountDetails from "../data/amount-details.json";
import timeDetails from "../data/time-details.json";
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

export async function checkInventory(materialWeights: InventoryInput, count?: number): Promise<InventoryAvailabilityResult> {
  const requestedEntries = Object.entries(materialWeights).filter(([, v]) => typeof v === "number" && Number.isFinite(v) && v > 0);
  if (requestedEntries.length === 0) {
    return { items: [], unavailableMaterials: [], allAvailable: true };
  }

  const requestedMaterials = requestedEntries.map(([name]) => name);

  const { data, error } = await supabase
    .from("Inventory")
    .select("material_name, weight")
    .eq("isPen", false)
    .in("material_name", requestedMaterials);

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
    if (row && typeof row.material_name === "string" && typeof row.weight === "number") {
      nameToAvailable[row.material_name.toLowerCase()] = row.weight;
    }
  }

  const items: InventoryAvailabilityItem[] = requestedEntries.map(([material, requestedGrams]) => {
    const availableGrams = typeof nameToAvailable[material] === "number" ? nameToAvailable[material] : 0;
    const isAvailable = availableGrams >= requestedGrams * (count || 1);
    return { material, requestedGrams, availableGrams, isAvailable };
  });

  const unavailableMaterials = items.filter(i => !i.isAvailable).map(i => i.material);
  const allAvailable = unavailableMaterials.length === 0;

  return { items, unavailableMaterials, allAvailable };
}

// Fetch all materials and their weights required for a given pen
export async function getPenMaterialsWeights(penId: number): Promise<Record<string, number>> {
  if (!Number.isFinite(penId) || penId <= 0) return {};

  // Fetch pen to get component IDs
  const { data: penData, error: penError } = await supabase
    .from("Pen")
    .select("pen_id, cap_type:cap_type_id (cap_type_id, clip_design), barrel_id, nibtype_id")
    .eq("pen_id", penId)
    .limit(1)
    .maybeSingle();

  if (penError || !penData) {
    console.error("Failed to fetch pen:", penError);
    return {};
  }
  console.log("clips", penData.cap_type);
  // Normalize cap_type which may be returned as an array or a single object
  const capType = Array.isArray(penData.cap_type) ? penData.cap_type[0] : penData.cap_type;

  // Fetch component configs in parallel
  const [capRes, barrelRes, nibRes, clipRes] = await Promise.all([
    supabase.from("CapConfig").select("material_id").eq("cap_type_id", capType?.cap_type_id).limit(1).maybeSingle(),
    supabase.from("BarrelConfig").select("material_id").eq("barrel_id", penData.barrel_id).limit(1).maybeSingle(),
    supabase.from("NibConfig").select("material_id").eq("nibtype_id", penData.nibtype_id).limit(1).maybeSingle(),
    supabase.from("ClipDesign").select("material").eq("id", capType?.clip_design).limit(1).maybeSingle(),
  ]);

  const cap = capRes.data ?? null;
  const barrel = barrelRes.data ?? null;
  const nib = nibRes.data ?? null;
  const clip = clipRes.data ?? null;

  const materialIds = new Set<number>();

  if (cap?.material_id && Number.isFinite(cap.material_id)) materialIds.add(cap.material_id as number);
  if (barrel?.material_id && Number.isFinite(barrel.material_id)) materialIds.add(barrel.material_id as number);
  if (nib?.material_id && Number.isFinite(nib.material_id)) materialIds.add(nib.material_id as number);
  if (clip?.material && Number.isFinite(clip.material)) materialIds.add(clip.material as number);

  if (materialIds.size === 0) return {};

  // Fetch material rows and build name->weight map
  const { data: materials, error: matErr } = await supabase
    .from("Material")
    .select("name, weight")
    .in("id", Array.from(materialIds));

  if (matErr || !materials) {
    console.error("Failed to fetch materials:", matErr);
    return {};
  }

  const result: Record<string, number> = {};
  for (const m of materials) {
    if (!m || typeof m.name !== "string" || typeof m.weight !== "number") continue;
    const key = m.name.toLowerCase();
    result[key] = (result[key] ?? 0) + m.weight;
  }

  return result;
}

// Manufacturing duration calculation function
export async function calculateManufacturingDuration(
  currentDate: Date,
  requiresMaterialPurchase: boolean
): Promise<Date> {
  let totalDays = 0;

  // Add production time
  totalDays += timeDetails.production.standard_time_days;

  // Add raw materials time if purchase is required
  if (requiresMaterialPurchase) {
    totalDays += timeDetails.raw_materials.standard_ordering_days;
  }

  // Add quality control time
  totalDays += timeDetails.quality_control.standard_qc_days;

  // Check for backlog by counting "In Production" work orders
  const { data: backlogData, error: backlogError } = await supabase
    .from("WorkOrder")
    .select("id", { count: "exact" })
    .eq("status", "In Production");

  if (!backlogError && backlogData && backlogData.length > 3) {
    totalDays += timeDetails.backlog_delay.backlog_days;
  }

  // Calculate the new date by adding total days
  const newDate = new Date(currentDate);
  newDate.setDate(currentDate.getDate() + totalDays);

  return newDate;
}

