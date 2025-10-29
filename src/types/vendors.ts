// Vendor and Address Types

export interface Address {
  id: number;
  created_at: string;
  state: string | null;
  city: string | null;
  pincode: number | null;
  address_line: string | null;
}

export interface Vendor {
  id: number;
  created_at: string;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_address: number;
}

export interface VendorWithAddress extends Vendor {
  address: Address | null;
}

export interface VendorDetail extends VendorWithAddress {
  purchase_orders_count: number;
  materials_supplied: string[];
}

export interface VendorFormData {
  id?: number;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_address_id?: number;
  address?: {
    state: string;
    city: string;
    pincode: number;
    address_line: string;
  };
}
