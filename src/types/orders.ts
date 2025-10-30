// Order and Bill of Material Types

export interface WorkOrder {
  id: number;
  created_at: string;
  status: string;
  count: number;
  start_date: string;
  end_date: string;
  pen: number;
  customer_id: number;
}

export interface Material {
  id: number;
  created_at: string;
  name: string;
  weight: number;
  cost: number;
}

export interface Design {
  design_id: number;
  description: string;
  font: string;
  cost: number;
  colour: string;
  hex_code: string;
}

export interface Engraving {
  engraving_id: number;
  font: string;
  type_name: string;
  description: string;
  cost: number;
}

export interface Coating {
  coating_id: number;
  colour: string;
  hex_code: string;
  type: string;
}

export interface ClipDesign {
  id: number;
  created_at: string;
  description: string;
  material: Material;
  design: Design;
  engraving: Engraving;
  cost: number;
}

export interface CapConfig {
  cap_type_id: number;
  description: string;
  material: Material;
  design: Design;
  engraving: Engraving;
  clip_design: ClipDesign;
  coating: Coating;
  cost: number;
}

export interface BarrelConfig {
  barrel_id: number;
  description: string;
  shape: string | null;
  cost: number;
  grip_type: string;
  material: Material;
  design: Design;
  engraving: Engraving;
  coating: Coating;
}

export interface InkConfig {
  ink_type_id: number;
  type_name: string;
  description: string;
  cost: number;
  hexcode: string;
}

export interface NibConfig {
  nib_id: number;
  description: string;
  size: string;
  cost: number;
  material: Material;
  design: Design;
}

export interface PenConfig {
  pen_id: number;
  cost: number;
  cap: CapConfig;
  barrel: BarrelConfig;
  ink: InkConfig;
  nib: NibConfig;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  credit_amount: number;
  address: string | null;
}

export interface CostDivision {
  currency: string;
  minimumProductionAmount: number;
  labourTotal: number;
  packagingCostPerUnit: number;
  shippingTotal: number;
  taxPercent: number;
}

export interface MaterialRequirement {
  material: string;
  requestedGrams: number;
  availableGrams: number;
  isAvailable: boolean;
}

export interface RequiredMaterials {
  items: MaterialRequirement[];
  unavailableMaterials: string[];
  allAvailable: boolean;
}

export interface TimeDetails {
  production: {
    description: string;
    standard_time_days: number;
  };
  raw_materials: {
    description: string;
    standard_ordering_days: number;
  };
  backlog_delay: {
    description: string;
    backlog_days: number;
  };
  shipping: {
    description: string;
    domestic_shipping_days: number;
    customs_clearance_days: number;
  };
  quality_control: {
    description: string;
    standard_qc_days: number;
  };
}

export interface BillOfMaterial {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  count: number;
  unit_cost: number;
  subtotal: number;
  tax_amt: number;
  grand_total: number;
  pen: PenConfig;
  cost_division: CostDivision;
  customer: Customer;
  isPaid: boolean;
  AllMaterials: Record<string, number>;
  requiredMaterials: RequiredMaterials;
  material_prices: Record<string, number>;
  amount_details: any;
  time_details: TimeDetails;
}

export interface Quote {
  id: number;
  start_date: string;
  end_date: string;
  status: string;
  count: number;
  unit_cost: number;
  subtotal: number;
  tax_amt: number;
  grand_total: number;
  pen: PenConfig;
  cost_division: CostDivision;
  customer: Customer;
  isPaid: boolean;
}
