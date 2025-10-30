## configuratorFunctions overview

This module interacts with Supabase tables to create and fetch configuration data for pens and related entities.

Notes
- All async functions return either the described object or `null` on error.
- IDs map to Supabase rows; costs are numbers in INR unless otherwise noted.

### createDesign
- Parameters: `(description: string, font: string, colour: string, hex_code: string)`
- Returns: `{ id: number; cost: number } | null`
- Behavior: Inserts into `Design` with a fixed base cost of 800.

Example
```ts
const res = await createDesign("wavy lines", "Serif", "Blue", "#0000FF");
// { id: number, cost: 800 }
```

### createMaterial
- Parameters: `(name: string, weight: number)` where `weight` is in grams
- Returns: `{ id: number; cost: number } | null`
- Behavior: Computes `cost = stone-price[name] * weight`, inserts into `Material`.

### createEngraving
- Parameters: `(font: string, type_name: string, description: string, material: { id: number; cost: number })`
- Returns: `{ id: number; cost: number } | null`
- Behavior: Inserts into `Engravings` with `material_id = material.id` and `cost = material.cost + 1000`.

### createCoating
- Parameters: `(colour: string, hex_code: string, type: string)`
- Returns: `number | null` (the `coating_id`)
- Behavior: Inserts into `Coating` and returns the new `coating_id`.

### materialData
- Parameters: `(id: number)`
- Returns: `Material row | null` (shape depends on Supabase `Material` schema)
- Behavior: `SELECT * FROM Material WHERE id = :id`.

### designData
- Parameters: `(id: number)`
- Returns: `Design row | null`
- Behavior: `SELECT * FROM Design WHERE design_id = :id`.

### coatingData
- Parameters: `(id: number)`
- Returns: `Coating row | null`
- Behavior: `SELECT * FROM Coating WHERE coating_id = :id`.

### engravingData
- Parameters: `(id: number)`
- Returns: `Engravings row with material expanded | null`
- Behavior: Fetches `Engravings` row by `engraving_id` and augments the result with `material_id` replaced by the full `Material` row.

Return shape example
```ts
{
  // original fields from Engravings table ...,
  material_id: { /* Material row */ }
}
```

### extractCapDetails
- Parameters: `(capId: number)`
- Returns:
```ts
{
  cap_type_id: number;
  description: string;
  material: any; // Material row
  design: any;   // Design row
  engraving: any;// Engravings row with expanded material
  clip_design: any; // Design row
  coating: any;  // Coating row
  cost: number;
} | null
```
- Behavior: Joins IDs in `CapConfig` to fetch related rows.

### extractBarrelDetails
- Parameters: `(barrelId: number)`
- Returns:
```ts
{
  barrel_id: number;
  description: string;
  shape: string;
  cost: number;
  grip_type: string;
  material: any; // Material row
  design: any;   // Design row
  engraving: any;// Engravings row with expanded material
  coating: any;  // Coating row
} | null
```

### extractInkDetails
- Parameters: `(inkId: number)`
- Returns:
```ts
{
  ink_type_id: number;
  type_name: string;
  description: string;
  cost: number;
  colour: string;
  hexcode: string;
} | null
```

### extractNibDetails
- Parameters: `(nibId: number)`
- Returns:
```ts
{
  nib_id: number;
  description: string;
  size: string;
  cost: number;
  material: any; // Material row
  design: any;   // Design row
} | null
```

### extractPenDetails
- Parameters: `(penId: number)`
- Returns:
```ts
{
  pen_id: number;
  pen_type: string;
  cap: ReturnType<typeof extractCapDetails> | null;
  barrel: ReturnType<typeof extractBarrelDetails> | null;
  ink: ReturnType<typeof extractInkDetails> | null;
  nib: ReturnType<typeof extractNibDetails> | null;
} | null
```
- Behavior: Fetches `Pen` row and resolves related subcomponents via the corresponding extract functions.


