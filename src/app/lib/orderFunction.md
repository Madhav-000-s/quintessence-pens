## orderFunction.ts overview

Utilities for pricing, amount configuration, inventory checks, and material aggregation.

Notes
- Unless specified, weights are in grams and currency is `INR`.
- Errors in data fetching are handled conservatively (e.g., inventory treated as unavailable on fetch errors).

### calculatePayable
- Signature: `(cost: number, quantity: number, taxPercent?: number) => { subtotal: number; taxAmount: number; totalWithTax: number }`
- Description: Computes per-item total as base `cost + labour + packaging + shipping` from `amount-details.json`, multiplies by `quantity`, then applies tax. If `taxPercent` is omitted, uses configured `tax` from `amount-details.json` (defaults to 0 if missing).
- Parameters
  - `cost`: number (base cost per item)
  - `quantity`: number (> 0, defaults to 1 if invalid)
  - `taxPercent?`: number (>= 0). Optional; falls back to configured tax.
- Returns
```ts
{
  subtotal: number;      // per-item total * quantity, before tax
  taxAmount: number;     // subtotal * (taxPercent / 100)
  totalWithTax: number;  // subtotal + taxAmount
}
```
- Example
```ts
const { subtotal, taxAmount, totalWithTax } = calculatePayable(2000, 3); // uses configured tax
```

### getAmountDetails
- Signature: `() => { currency?: string; minimumProductionAmount?: number; labourTotal: number; packagingCostPerUnit: number; shippingTotal: number; taxPercent: number }`
- Description: Returns a summarized view of `amount-details.json`, computing `labourTotal` and `shippingTotal` if not explicitly provided. `taxPercent` defaults to 0 when not configured.
- Returns
```ts
{
  currency?: string;
  minimumProductionAmount?: number;
  labourTotal: number;
  packagingCostPerUnit: number;
  shippingTotal: number;
  taxPercent: number;
}
```
- Example
```ts
const summary = getAmountDetails();
```

### checkInventory
- Signature: `(materialWeights: Record<string, number>) => Promise<{ items: { material: string; requestedGrams: number; availableGrams: number; isAvailable: boolean }[]; unavailableMaterials: string[]; allAvailable: boolean }>`
- Description: Checks Supabase `Inventory` table to verify whether requested `material -> grams` can be fulfilled. Marks a material unavailable when `requestedGrams > availableGrams`.
- Parameters
  - `materialWeights`: object map; keys are material names, values are requested weights in grams (> 0).
- Returns
```ts
{
  items: Array<{
    material: string;
    requestedGrams: number;
    availableGrams: number;
    isAvailable: boolean;
  }>;
  unavailableMaterials: string[];
  allAvailable: boolean;
}
```
- Example
```ts
const res = await checkInventory({ gold: 10, diamond: 2 });
```

### getPenMaterialsWeights
- Signature: `(penId: number) => Promise<Record<string, number>>`
- Description: Aggregates all materials and their weights for the given pen by fetching related configs (`Pen`, `CapConfig`, `BarrelConfig`, `NibConfig`, and any linked `Engravings`), then returning a map of `materialName -> totalWeightGrams`.
- Parameters
  - `penId`: number (> 0)
- Returns
```ts
{ [materialNameLower: string]: number }
```
- Example
```ts
const materials = await getPenMaterialsWeights(42);
// e.g., { gold: 12, diamond: 2.5 }
```


