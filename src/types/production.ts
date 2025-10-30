// Production and Inventory Types

export interface InventoryMaterial {
  id: number;
  created_at: string;
  isPen: boolean;
  pen_id: number | null;
  material_name: string;
  cost_p_gram: number;
  weight: number;
}

export interface LowStockMaterial {
  id: number;
  material_name: string;
  weight: number;
}

export interface MaterialsInventoryResponse {
  allMaterials: InventoryMaterial[];
  lowStockMaterials: LowStockMaterial[];
}

export interface WorkOrderDetail {
  id: string;
  status: string;
  start_date: string;
  end_date: string;
  count: number;
  materialsRequired: Record<string, number>;
  pen: any; // Can reuse PenConfig from orders.ts if needed
}

export interface PurchaseOrderItem {
  id: number;
  created_at: string;
  quantity: number;
  total_cost: number;
  isReceived: boolean;
  material: number;
  name: string;
  vendor: number;
}

export interface PurchaseOrderRequest {
  [inventoryId: string]: number; // inventory ID to quantity in grams
}
