// API Request and Response Types
// These types match the backend API specification

// ============================================
// Nested Object Types
// ============================================

export interface MaterialInput {
  name: string;
}

export interface MaterialResponse {
  id: number;
  created_at: string;
  name: string;
  weight: number;
  cost: number;
}

export interface DesignInput {
  description: string;
  font: string;
  colour: string;
  hex_code: string;
}

export interface DesignResponse {
  design_id: number;
  description: string;
  font: string;
  cost: number;
  colour: string;
  hex_code: string;
}

export interface EngravingInput {
  font: string;
  type_name: string;
  description: string;
}

export interface EngravingResponse {
  engraving_id: number;
  font: string;
  type_name: string;
  description: string;
  cost: number;
}

export interface CoatingInput {
  colour: string;
  hex_code: string;
  type: string;
}

export interface CoatingResponse {
  coating_id: number;
  colour: string;
  hex_code: string;
  type: string;
}

export interface ClipDesignInput {
  description: string;
  material: string;
  design: DesignInput;
  engraving: EngravingInput;
}

export interface ClipDesignResponse {
  id: number;
  created_at: string;
  description: string;
  material: MaterialResponse;
  design: DesignResponse;
  engraving: EngravingResponse;
  cost: number;
}

// ============================================
// Cap Configuration
// ============================================

export interface CapConfigRequest {
  description: string;
  material: MaterialInput;
  design: DesignInput;
  engraving: EngravingInput;
  clip_design: ClipDesignInput;
  coating: CoatingInput;
}

export interface CapConfigResponse {
  cap_type_id: number;
  description: string;
  material: MaterialResponse;
  design: DesignResponse;
  engraving: EngravingResponse;
  clip_design: ClipDesignResponse;
  coating: CoatingResponse;
  cost: number;
}

// ============================================
// Barrel Configuration
// ============================================

export interface BarrelConfigRequest {
  description: string;
  grip_type: string;
  shape: string;
  material: MaterialInput;
  design: DesignInput;
  engraving: EngravingInput;
  coating: CoatingInput;
}

export interface BarrelConfigResponse {
  barrel_id: number;
  description: string;
  shape: string | null;
  cost: number;
  grip_type: string;
  material: MaterialResponse;
  design: DesignResponse;
  engraving: EngravingResponse;
  coating: CoatingResponse;
}

// ============================================
// Nib Configuration
// ============================================

export interface NibConfigRequest {
  description: string;
  size: string;
  material: MaterialInput;
  design: DesignInput;
}

export interface NibConfigResponse {
  nib_id: number;
  description: string;
  size: string;
  cost: number;
  material: MaterialResponse;
  design: DesignResponse;
}

// ============================================
// Ink Configuration
// ============================================

export interface InkConfigRequest {
  description: string;
  type_name: string;
  colour: string;
  hex_code: string;
}

export interface InkConfigResponse {
  ink_type_id: number;
  type_name: string;
  description: string;
  cost: number;
  hexcode: string;
}

// ============================================
// Complete Pen
// ============================================

export interface CreatePenRequest {
  pentype: string;
  nibtype_id: number;
  ink_type_id: number;
  cap_type_id: number;
  barrel_id: number;
}

export interface CreatePenResponse {
  pen_id: number;
  pentype: string;
  nibtype_id: number;
  ink_type_id: number;
  cap_type_id: number;
  barrel_id: number;
  cost: number;
}

// ============================================
// Cart
// ============================================

export interface AddToCartRequest {
  customer: number;
  pen: number;
  count: number;
  total_price: number;
  isActive?: boolean;
}

export interface CartItemResponse {
  id: number;
  created_at: string;
  total_price: number;
  isActive: boolean;
  customer: number;
  pen: number;
  count: number;
}

export interface UpdateCartRequest {
  id: number;
  count: number;
}

// ============================================
// API Error Response
// ============================================

export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: unknown;
}

// ============================================
// Complete Configuration (for fetching)
// ============================================

export interface PenCompleteResponse extends CreatePenResponse {
  cap_config: CapConfigResponse;
  barrel_config: BarrelConfigResponse;
  nib_config: NibConfigResponse;
  ink_config: InkConfigResponse;
}
