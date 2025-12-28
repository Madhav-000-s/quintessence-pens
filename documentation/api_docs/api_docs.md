# Pen Manufacturing System - API Documentation

## Base URL
```
http://localhost:3000
```

---

## Table of Contents

1. [Configurator APIs](#configurator-apis)
   - [Cap Configuration](#cap-configuration)
   - [Barrel Configuration](#barrel-configuration)
   - [Ink Configuration](#ink-configuration)
   - [Nib Configuration](#nib-configuration)
2. [Order Section APIs](#order-section-apis)
   - [Generate Bill of Material](#generate-bill-of-material)
   - [List All Bills of Material](#list-all-bills-of-material)
   - [Display Detailed Bill of Material](#display-detailed-bill-of-material)
   - [Display Quote](#display-quote)
   - [Change Schedule](#change-schedule)
   - [Accept Order](#accept-order)
3. [Production Section APIs](#production-section-apis)
   - [Display All Materials](#display-all-materials)
   - [Display Work Order in Detail](#display-work-order-in-detail)
   - [Start Production](#start-production)
   - [Finish Production](#finish-production)
4. [Purchase Order APIs](#purchase-order-apis)
   - [Create Purchase Order](#create-purchase-order)
   - [View All Purchase Orders](#view-all-purchase-orders)
   - [Receive Orders](#receive-orders)
5. [Inventory APIs](#inventory-apis)
   - [Get All Inventory](#get-all-inventory)
6. [Vendor Management APIs](#vendor-management-apis)
   - [List All Vendors](#list-all-vendors)
   - [Get Vendor Details](#get-vendor-details)
   - [Create Vendor](#create-vendor)
   - [Update Vendor](#update-vendor)
   - [Delete Vendor](#delete-vendor)
7. [Financial Accounts APIs](#financial-accounts-apis)
   - [List Transactions](#list-transactions)
   - [Get Transaction Details](#get-transaction-details)
   - [Create Transaction](#create-transaction)
   - [Update Transaction](#update-transaction)
   - [Cancel Transaction](#cancel-transaction)
   - [Get Financial Summary](#get-financial-summary)
   - [List Payments](#list-payments)
   - [Record Payment](#record-payment)
   - [Get Analytics](#get-analytics)

---

## Configurator APIs

### Cap Configuration

Configure a custom pen cap with materials, designs, engravings, clip, and coating.

**Endpoint:** `/api/configure_cap`

#### POST Request

**Request Body:**
```json
{
  "description": "Premium gold cap with custom engraving",
  "material": {
    "name": "Gold"
  },
  "design": {
    "description": "Elegant swirl pattern",
    "font": "Times New Roman",
    "colour": "Gold",
    "hex_code": "#FFD700"
  },
  "engraving": {
    "font": "Script",
    "type_name": "Laser",
    "description": "Personal monogram"
  },
  "clip_design": {
    "description": "Classic clip with logo",
    "material": "Gold",
    "design": {
      "description": "Elegant criss-cross pattern",
      "font": "Times New Roman",
      "colour": "Gold",
      "hex_code": "#FFD700"
    },
    "engraving": {
      "font": "Script",
      "type_name": "Laser",
      "description": "Personal monogram"
    }
  },
  "coating": {
    "colour": "Matte",
    "hex_code": "#C0C0C0",
    "type": "Protective"
  }
}
```

#### GET Response

**Response Body:**
```json
{
  "cap_type_id": 8,
  "description": "Premium gold cap with custom engraving",
  "material": {
    "id": 29,
    "created_at": "2025-10-19T18:16:06.800281+00:00",
    "name": "Gold",
    "weight": 2,
    "cost": 9000
  },
  "design": {
    "design_id": 31,
    "description": "Elegant swirl pattern",
    "font": "Times New Roman",
    "cost": 800,
    "colour": "Gold",
    "hex_code": "#FFD700"
  },
  "engraving": {
    "engraving_id": 15,
    "font": "Script",
    "type_name": "Laser",
    "description": "Personal monogram",
    "cost": 1000
  },
  "clip_design": {
    "id": 3,
    "created_at": "2025-10-19T18:16:07.77518+00:00",
    "description": "Classic clip with logo",
    "material": {
      "id": 30,
      "created_at": "2025-10-19T18:16:07.227046+00:00",
      "name": "Gold",
      "weight": 5,
      "cost": 22500
    },
    "design": {
      "design_id": 32,
      "description": "Gold",
      "font": "Times New Roman",
      "cost": 800,
      "colour": "Gold",
      "hex_code": "#FFD700"
    },
    "engraving": {
      "engraving_id": 16,
      "font": "Script",
      "type_name": "Laser",
      "description": "Personal monogram",
      "cost": 1000
    },
    "cost": 25300
  },
  "coating": {
    "coating_id": 16,
    "colour": "Matte",
    "hex_code": "#C0C0C0",
    "type": "Protective"
  },
  "cost": 36100
}
```

---

### Barrel Configuration

Configure a custom pen barrel with materials, designs, engravings, and coating.

**Endpoint:** `/api/configure_barrel`

#### POST Request

**Request Body:**
```json
{
  "description": "Premium barrel with ergonomic grip",
  "grip_type": "Rubber",
  "shape": "Tapered",
  "material": {
    "name": "Aluminum"
  },
  "design": {
    "description": "Textured grip pattern",
    "font": "Arial",
    "colour": "Black",
    "hex_code": "#000000"
  },
  "engraving": {
    "font": "Bold",
    "type_name": "Laser",
    "description": "Company name"
  },
  "coating": {
    "colour": "Matte",
    "hex_code": "#2C2C2C",
    "type": "Anti-slip"
  }
}
```

#### GET Response

**Response Body:**
```json
{
  "barrel_id": 1,
  "description": "Premium barrel with ergonomic grip",
  "shape": null,
  "cost": 1800,
  "grip_type": "Rubber",
  "material": {
    "id": 24,
    "created_at": "2025-10-19T17:45:45.303811+00:00",
    "name": "Aluminum",
    "weight": 2,
    "cost": 1000
  },
  "design": {
    "design_id": 26,
    "description": "Textured grip pattern",
    "font": "Arial",
    "cost": 800,
    "colour": "Black",
    "hex_code": "#000000"
  },
  "engraving": {
    "engraving_id": 10,
    "font": "Bold",
    "type_name": "Laser",
    "description": "Company name",
    "cost": 1000
  },
  "coating": {
    "coating_id": 13,
    "colour": "Matte",
    "hex_code": "#2C2C2C",
    "type": "Anti-slip"
  }
}
```

---

### Ink Configuration

Configure custom fountain pen ink.

**Endpoint:** `/api/configure_ink`

#### POST Request

**Request Body:**
```json
{
  "description": "Premium blue fountain pen ink",
  "type_name": "Waterproof Blue",
  "colour": "Royal Blue",
  "hex_code": "#4169E1"
}
```

#### GET Response

**Response Body:**
```json
{
  "ink_type_id": 1,
  "type_name": "Waterproof Blue",
  "description": "Premium blue fountain pen ink",
  "cost": 1000,
  "hexcode": "#4169E1"
}
```

---

### Nib Configuration

Configure a custom pen nib with materials and designs.

**Endpoint:** `/api/configure_nib`

#### POST Request

**Request Body:**
```json
{
  "description": "Premium gold nib with fine point",
  "size": "Fine",
  "material": {
    "name": "Gold"
  },
  "design": {
    "description": "Classic nib design with scroll pattern",
    "font": "Serif",
    "colour": "Gold",
    "hex_code": "#FFD700"
  }
}
```

#### GET Response

**Response Body:**
```json
{
  "nib_id": 2,
  "description": "Premium gold nib with fine point",
  "size": "Fine",
  "cost": 800,
  "material": {
    "id": 20,
    "created_at": "2025-10-19T17:39:35.999236+00:00",
    "name": "Gold",
    "weight": 2,
    "cost": 18000
  },
  "design": {
    "design_id": 22,
    "description": "Classic nib design with scroll pattern",
    "font": "Serif",
    "cost": 800,
    "colour": "Gold",
    "hex_code": "#FFD700"
  }
}
```

---

## Order Section APIs

### Generate Bill of Material

Generate a bill of material for a customer order.

**Endpoint:** `/api/orders/generate`

#### POST Request

**Request Body:**
```json
{
  "customer_id": 2,
  "count": 2,
  "isBusiness": false
}
```

**Response:** Returns a detailed bill of material with cost breakdown and material requirements.

---

### List All Bills of Material

Retrieve a list of all bills of material.

**Endpoint:** `/api/orders/bill_of_material/list`

#### GET Request

**Response Body:**
```json
[
  {
    "id": 5,
    "created_at": "2025-10-20T09:46:47.917972+00:00",
    "status": "awaiting confirmation",
    "count": 2,
    "start_date": "2025-10-20",
    "end_date": "2025-10-31",
    "pen": 5,
    "customer_id": 2
  },
  {
    "id": 7,
    "created_at": "2025-10-21T02:13:53.447348+00:00",
    "status": "awaiting confirmation",
    "count": 2,
    "start_date": "2025-10-21",
    "end_date": "2025-11-01",
    "pen": 5,
    "customer_id": 2
  }
]
```

---

### Display Detailed Bill of Material

Retrieve detailed information about a specific bill of material.

**Endpoint:** `/api/orders/bill_of_material`

#### GET Request

**Query Parameters:**
- `work_order_id` (integer, required): The ID of the work order

**Response Body:**
```json
{
  "id": 5,
  "start_date": "2025-10-20",
  "end_date": "2025-10-31",
  "status": "awaiting confirmation",
  "count": 2,
  "unit_cost": 73000,
  "subtotal": 175700,
  "tax_amt": 31626,
  "grand_total": 207326,
  "pen": {
    "pen_id": 5,
    "cost": 73000,
    "cap": { "..." },
    "barrel": { "..." },
    "ink": { "..." },
    "nib": { "..." }
  },
  "cost_division": {
    "currency": "INR",
    "minimumProductionAmount": 50000,
    "labourTotal": 2250,
    "packagingCostPerUnit": 100,
    "shippingTotal": 12500,
    "taxPercent": 18
  },
  "customer": {
    "id": 2,
    "first_name": "madhav",
    "last_name": "madhav",
    "email": "supermadhav8@gmail.com",
    "phone": "1023456789",
    "credit_amount": 0,
    "address": null
  },
  "isPaid": false,
  "AllMaterials": {
    "gold": 4,
    "aluminum": 2
  },
  "requiredMaterials": {
    "items": [
      {
        "material": "gold",
        "requestedGrams": 4,
        "availableGrams": 1500,
        "isAvailable": true
      },
      {
        "material": "aluminum",
        "requestedGrams": 2,
        "availableGrams": 0,
        "isAvailable": false
      }
    ],
    "unavailableMaterials": ["aluminum"],
    "allAvailable": false
  },
  "material_prices": {
    "diamond": 5000,
    "ruby": 2000,
    "emerald": 1500,
    "gold": 4500,
    "sapphire": 1600,
    "aluminium": 500
  },
  "amount_details": {
    "currency": "INR",
    "minimumProductionAmount": 50000,
    "labourCharges": {
      "manufacture": 1500,
      "assembly": 500,
      "finishing": 250,
      "total": 2250
    },
    "tax": 18,
    "packagingCostPerUnit": 100,
    "shipping": {
      "baseCost": 7500,
      "perUnitCost": 500,
      "total": 12500
    },
    "updatedAt": "2025-10-07T00:00:00.000Z"
  },
  "time_details": {
    "production": {
      "description": "Time taken for manufacturing and production processes",
      "standard_time_days": 7
    },
    "raw_materials": {
      "description": "Time taken to order and receive raw materials",
      "standard_ordering_days": 3
    },
    "backlog_delay": {
      "description": "Additional time due to production backlog",
      "backlog_days": 2
    },
    "shipping": {
      "description": "Time taken for packaging and shipping",
      "domestic_shipping_days": 2,
      "customs_clearance_days": 2
    },
    "quality_control": {
      "description": "Time taken for quality checks and testing",
      "standard_qc_days": 1
    }
  }
}
```

---

### Display Quote

Retrieve a quote for a specific pen configuration.

**Endpoint:** `/api/orders/quote`

#### GET Request

**Query Parameters:**
- `pen_id` (integer, required): The ID of the pen configuration

**Response Body:**
```json
{
  "id": 5,
  "start_date": "2025-10-20",
  "end_date": "2025-10-31",
  "status": "awaiting confirmation",
  "count": 2,
  "unit_cost": 73000,
  "subtotal": 175700,
  "tax_amt": 31626,
  "grand_total": 207326,
  "pen": {
    "pen_id": 5,
    "cost": 73000,
    "cap": { "..." },
    "barrel": { "..." },
    "ink": { "..." },
    "nib": { "..." }
  },
  "cost_division": {
    "currency": "INR",
    "minimumProductionAmount": 50000,
    "labourTotal": 2250,
    "packagingCostPerUnit": 100,
    "shippingTotal": 12500,
    "taxPercent": 18
  },
  "customer": {
    "id": 2,
    "first_name": "madhav",
    "last_name": "madhav",
    "email": "supermadhav8@gmail.com",
    "phone": "1023456789",
    "credit_amount": 0,
    "address": null
  },
  "isPaid": false
}
```

---

### Change Schedule

Update the production schedule for an order.

**Endpoint:** `/api/orders/schedule`

#### PATCH Request

**Request Body:**
```json
{
  "id": 6,
  "start_date": "2025-10-22",
  "end_date": "2025-10-30"
}
```

---

### Accept Order

Accept a customer order and move it to production.

**Endpoint:** `/api/orders/accept`

#### PATCH Request

**Request Body:**
```json
{
  "orderId": 5
}
```

---

## Production Section APIs

### Display All Materials

Retrieve all materials in inventory, including low stock alerts.

**Endpoint:** `/api/inventory/materials`

#### GET Request

**Response Body:**
```json
{
  "allMaterials": [
    {
      "id": 1,
      "created_at": "2025-10-20T09:31:11.982435+00:00",
      "isPen": false,
      "pen_id": null,
      "material_name": "gold",
      "cost_p_gram": 9000,
      "weight": 1500
    },
    {
      "id": 2,
      "created_at": "2025-10-26T06:24:40.578198+00:00",
      "isPen": false,
      "pen_id": null,
      "material_name": "diamond",
      "cost_p_gram": 5000,
      "weight": 1500
    },
    {
      "id": 3,
      "created_at": "2025-10-26T06:25:38.342008+00:00",
      "isPen": false,
      "pen_id": null,
      "material_name": "aluminium",
      "cost_p_gram": 500,
      "weight": 50
    }
  ],
  "lowStockMaterials": [
    {
      "id": 3,
      "material_name": "aluminium",
      "weight": 50
    }
  ]
}
```

---

### Display Work Order in Detail

Retrieve detailed information about a specific work order.

**Endpoint:** `/api/production/work_order`

#### GET Request

**Query Parameters:**
- `work_order_id` (integer, required): The ID of the work order

**Response Body:**
```json
{
  "id": "7",
  "status": "awaiting confirmation",
  "start_date": "2025-10-21",
  "end_date": "2025-11-01",
  "count": 12,
  "materialsRequired": {
    "gold": 9,
    "aluminum": 2
  },
  "pen": {
    "pen_id": 5,
    "cost": 73000,
    "cap": { "..." },
    "barrel": { "..." },
    "ink": { "..." },
    "nib": { "..." }
  }
}
```

---

### Start Production

Start production for a work order.

**Endpoint:** `/api/production/start`

#### POST Request

**Request Body:**
```json
{
  "work_order_id": 5
}
```

**Possible Error Messages:**
- `"Insufficient materials in inventory"`
- `"Error deducting materials from inventory"`

---

### Finish Production

Mark production as finished and handle defective items.

**Endpoint:** `/api/production/finish`

#### POST Request

**Request Body:**
```json
{
  "work_order_id": 6,
  "defective": 5
}
```

**Possible Messages:**
- `"Error adding defective materials back to inventory"`
- `"status updated"`

---

## Purchase Order APIs

### Create Purchase Order

Create a new purchase order for materials.

**Endpoint:** `/api/purchase_order`

#### POST Request

**Request Body:**
```json
{
  "1": 100,
  "2": 300
}
```

**Note:** Keys are inventory IDs, values are the weights required in grams.

**Response Body:**
```json
{
  "message": "Purchase order created successfully",
  "data": [
    {
      "id": 5,
      "created_at": "2025-10-26T11:05:39.307327+00:00",
      "quantity": 100,
      "total_cost": 900000,
      "isReceived": false,
      "material": 1,
      "name": "gold",
      "vendor": 2
    },
    {
      "id": 6,
      "created_at": "2025-10-26T11:05:39.307327+00:00",
      "quantity": 300,
      "total_cost": 1500000,
      "isReceived": false,
      "material": 2,
      "name": "diamond",
      "vendor": 2
    }
  ]
}
```

---

### View All Purchase Orders

Retrieve all purchase orders or filter by status.

**Endpoint:** `/api/purchase_order`

#### GET Request

**Query Parameters:**
- `all` (boolean, optional): If set to "true", returns all purchase orders including received ones. If omitted or "false", returns only pending orders.

**Example Requests:**
```
GET /api/purchase_order          # Returns only pending orders
GET /api/purchase_order?all=true # Returns all orders
```

**Response Body:**
```json
[
  {
    "id": 5,
    "created_at": "2025-10-26T11:05:39.307327+00:00",
    "quantity": 100,
    "total_cost": 900000,
    "isReceived": false,
    "material": 1,
    "name": "gold",
    "vendor": 2
  },
  {
    "id": 6,
    "created_at": "2025-10-26T11:05:39.307327+00:00",
    "quantity": 300,
    "total_cost": 1500000,
    "isReceived": false,
    "material": 2,
    "name": "diamond",
    "vendor": 2
  }
]
```

---

### Receive Orders

Mark a purchase order as received and update inventory.

**Endpoint:** `/api/purchase_order/receive`

#### PATCH Request

**Request Body:**
```json
{
  "order_id": 6
}
```

---

## Inventory APIs

### Get All Inventory

Retrieve all inventory items including raw materials and finished pens.

**Endpoint:** `/api/inventory`

#### GET Request

**Response Body:**
```json
[
  {
    "id": 1,
    "created_at": "2025-10-20T09:31:11.982435+00:00",
    "isPen": false,
    "pen_id": null,
    "material_name": "gold",
    "cost_p_gram": 9000,
    "weight": 1500
  },
  {
    "id": 2,
    "created_at": "2025-10-26T06:24:40.578198+00:00",
    "isPen": false,
    "pen_id": null,
    "material_name": "diamond",
    "cost_p_gram": 5000,
    "weight": 1500
  },
  {
    "id": 10,
    "created_at": "2025-10-26T12:30:00.000000+00:00",
    "isPen": true,
    "pen_id": 5,
    "material_name": "Zeus Executive Pen",
    "cost_p_gram": null,
    "weight": 1
  }
]
```

**Note:**
- Items with `isPen: false` are raw materials with cost per gram and weight in grams
- Items with `isPen: true` are finished pens where `weight` represents quantity and `pen_id` references the pen configuration

---

## Vendor Management APIs

### List All Vendors

Retrieve all vendors with their address information.

**Endpoint:** `/api/vendors`

#### GET Request

**Response Body:**
```json
[
  {
    "id": 1,
    "created_at": "2025-10-26T14:00:00.000000+00:00",
    "vendor_name": "Premium Materials Inc",
    "vendor_email": "contact@premiummaterials.com",
    "vendor_phone": "+91 98765 43210",
    "vendor_address": 5,
    "vendor_address": {
      "id": 5,
      "created_at": "2025-10-26T14:00:00.000000+00:00",
      "state": "Maharashtra",
      "city": "Mumbai",
      "pincode": 400001,
      "address_line": "123 Business District, Andheri East"
    }
  },
  {
    "id": 2,
    "created_at": "2025-10-26T14:30:00.000000+00:00",
    "vendor_name": "Gold Suppliers Co",
    "vendor_email": "sales@goldsuppliers.com",
    "vendor_phone": "+91 99887 76655",
    "vendor_address": 6,
    "vendor_address": {
      "id": 6,
      "created_at": "2025-10-26T14:30:00.000000+00:00",
      "state": "Karnataka",
      "city": "Bangalore",
      "pincode": 560001,
      "address_line": "456 Industrial Area, Whitefield"
    }
  }
]
```

---

### Get Vendor Details

Retrieve detailed information about a specific vendor including purchase history and materials supplied.

**Endpoint:** `/api/vendors/[id]`

#### GET Request

**Path Parameters:**
- `id` (integer, required): The vendor ID

**Example Request:**
```
GET /api/vendors/1
```

**Response Body:**
```json
{
  "id": 1,
  "created_at": "2025-10-26T14:00:00.000000+00:00",
  "vendor_name": "Premium Materials Inc",
  "vendor_email": "contact@premiummaterials.com",
  "vendor_phone": "+91 98765 43210",
  "vendor_address": 5,
  "vendor_address": {
    "id": 5,
    "created_at": "2025-10-26T14:00:00.000000+00:00",
    "state": "Maharashtra",
    "city": "Mumbai",
    "pincode": 400001,
    "address_line": "123 Business District, Andheri East"
  },
  "purchase_orders_count": 15,
  "materials_supplied": ["gold", "diamond", "platinum"]
}
```

---

### Create Vendor

Create a new vendor with address information.

**Endpoint:** `/api/vendors`

#### POST Request

**Request Body:**
```json
{
  "vendor_name": "New Supplier Ltd",
  "vendor_email": "info@newsupplier.com",
  "vendor_phone": "+91 88776 65544",
  "address": {
    "state": "Delhi",
    "city": "New Delhi",
    "pincode": 110001,
    "address_line": "789 Trade Center, Connaught Place"
  }
}
```

**Response Body:**
```json
{
  "id": 3,
  "created_at": "2025-10-26T15:00:00.000000+00:00",
  "vendor_name": "New Supplier Ltd",
  "vendor_email": "info@newsupplier.com",
  "vendor_phone": "+91 88776 65544",
  "vendor_address": 7,
  "vendor_address": {
    "id": 7,
    "created_at": "2025-10-26T15:00:00.000000+00:00",
    "state": "Delhi",
    "city": "New Delhi",
    "pincode": 110001,
    "address_line": "789 Trade Center, Connaught Place"
  }
}
```

**Status Code:** `201 Created`

---

### Update Vendor

Update an existing vendor's information.

**Endpoint:** `/api/vendors`

#### PUT Request

**Request Body:**
```json
{
  "id": 3,
  "vendor_name": "Updated Supplier Ltd",
  "vendor_email": "contact@updatedsupplier.com",
  "vendor_phone": "+91 88776 65544",
  "vendor_address_id": 7,
  "address": {
    "state": "Delhi",
    "city": "New Delhi",
    "pincode": 110002,
    "address_line": "999 Updated Address, Connaught Place"
  }
}
```

**Response Body:**
```json
{
  "id": 3,
  "created_at": "2025-10-26T15:00:00.000000+00:00",
  "vendor_name": "Updated Supplier Ltd",
  "vendor_email": "contact@updatedsupplier.com",
  "vendor_phone": "+91 88776 65544",
  "vendor_address": 7,
  "vendor_address": {
    "id": 7,
    "created_at": "2025-10-26T15:00:00.000000+00:00",
    "state": "Delhi",
    "city": "New Delhi",
    "pincode": 110002,
    "address_line": "999 Updated Address, Connaught Place"
  }
}
```

**Status Code:** `200 OK`

---

### Delete Vendor

Delete a vendor from the system.

**Endpoint:** `/api/vendors`

#### DELETE Request

**Request Body:**
```json
{
  "vendor_id": 3
}
```

**Response Body:**
```json
{
  "message": "Vendor deleted successfully"
}
```

**Status Code:** `200 OK`

**Possible Error Messages:**
- `"Cannot delete vendor with active purchase orders"` - Returned when vendor has associated purchase orders
- `"Vendor not found"` - Returned when vendor ID doesn't exist

---

## Financial Accounts APIs

### List Transactions

Retrieve all financial transactions with optional filters.

**Endpoint:** `/api/accounts/transactions`

#### GET Request

**Query Parameters:**
- `start_date` (string, optional): Filter transactions from this date (YYYY-MM-DD)
- `end_date` (string, optional): Filter transactions until this date (YYYY-MM-DD)
- `transaction_type` (string, optional): Filter by type - "income", "expense", "payment_received", "payment_made"
- `category` (string, optional): Filter by category - "sales", "purchase_order", "labor", "shipping", "materials", "utilities", "rent", "salaries", "other"
- `status` (string, optional): Filter by status - "completed", "pending", "cancelled"
- `customer_id` (integer, optional): Filter by customer ID
- `vendor_id` (integer, optional): Filter by vendor ID
- `search` (string, optional): Search in description or notes
- `limit` (integer, optional): Limit number of results (default: 50)

**Example Requests:**
```
GET /api/accounts/transactions
GET /api/accounts/transactions?start_date=2025-01-01&end_date=2025-01-31
GET /api/accounts/transactions?transaction_type=income&limit=20
GET /api/accounts/transactions?category=sales&status=completed
```

**Response Body:**
```json
[
  {
    "id": 1,
    "created_at": "2025-01-15T10:30:00.000Z",
    "transaction_date": "2025-01-15",
    "transaction_type": "payment_received",
    "category": "sales",
    "amount": 50000,
    "description": "Payment for Work Order #5",
    "reference_id": 5,
    "reference_type": "work_order",
    "payment_method": "bank_transfer",
    "customer_id": 2,
    "vendor_id": null,
    "status": "completed",
    "notes": "Full payment received"
  }
]
```

---

### Get Transaction Details

Retrieve detailed information about a specific transaction including related customer/vendor data.

**Endpoint:** `/api/accounts/transactions/[id]`

#### GET Request

**Path Parameters:**
- `id` (integer, required): The transaction ID

**Example Request:**
```
GET /api/accounts/transactions/1
```

**Response Body:**
```json
{
  "id": 1,
  "created_at": "2025-01-15T10:30:00.000Z",
  "transaction_date": "2025-01-15",
  "transaction_type": "payment_received",
  "category": "sales",
  "amount": 50000,
  "description": "Payment for Work Order #5",
  "reference_id": 5,
  "reference_type": "work_order",
  "payment_method": "bank_transfer",
  "customer_id": 2,
  "vendor_id": null,
  "status": "completed",
  "notes": "Full payment received",
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```

---

### Create Transaction

Create a new financial transaction.

**Endpoint:** `/api/accounts/transactions`

#### POST Request

**Request Body:**
```json
{
  "transaction_date": "2025-01-20",
  "transaction_type": "expense",
  "category": "utilities",
  "amount": 15000,
  "description": "Monthly electricity bill",
  "payment_method": "bank_transfer",
  "status": "completed",
  "notes": "January 2025 electricity"
}
```

**Required Fields:**
- `transaction_date` (string): Date in YYYY-MM-DD format
- `transaction_type` (string): "income", "expense", "payment_received", or "payment_made"
- `category` (string): Transaction category
- `amount` (number): Amount (must be positive)

**Optional Fields:**
- `description` (string): Brief description
- `reference_id` (integer): ID of related work order, purchase order, or invoice
- `reference_type` (string): Type of reference - "work_order", "purchase_order", "invoice", "manual"
- `payment_method` (string): "cash", "card", "bank_transfer", "credit", "cheque"
- `customer_id` (integer): Related customer ID
- `vendor_id` (integer): Related vendor ID
- `status` (string): "completed" (default), "pending", or "cancelled"
- `notes` (string): Additional notes

**Response Body:**
```json
{
  "message": "Transaction created successfully",
  "data": {
    "id": 10,
    "created_at": "2025-01-20T14:30:00.000Z",
    "transaction_date": "2025-01-20",
    "transaction_type": "expense",
    "category": "utilities",
    "amount": 15000,
    "description": "Monthly electricity bill",
    "payment_method": "bank_transfer",
    "status": "completed"
  }
}
```

**Status Code:** `201 Created`

---

### Update Transaction

Update an existing transaction.

**Endpoint:** `/api/accounts/transactions`

#### PUT Request

**Request Body:**
```json
{
  "id": 10,
  "amount": 16000,
  "description": "Revised electricity bill amount",
  "notes": "Amount updated after meter reading"
}
```

**Note:** Only include the fields you want to update. The `id` field is required.

**Response Body:**
```json
{
  "message": "Transaction updated successfully",
  "data": {
    "id": 10,
    "amount": 16000,
    "description": "Revised electricity bill amount",
    "notes": "Amount updated after meter reading"
  }
}
```

**Status Code:** `200 OK`

---

### Cancel Transaction

Cancel (soft delete) a transaction by setting its status to "cancelled".

**Endpoint:** `/api/accounts/transactions`

#### DELETE Request

**Request Body:**
```json
{
  "id": 10
}
```

**Response Body:**
```json
{
  "message": "Transaction cancelled successfully",
  "data": {
    "id": 10,
    "status": "cancelled"
  }
}
```

**Status Code:** `200 OK`

---

### Get Financial Summary

Retrieve financial summary including revenue, expenses, profit, and pending payments.

**Endpoint:** `/api/accounts/summary`

#### GET Request

**Query Parameters:**
- `period` (string, optional): "current_month" (default), "previous_month", "current_year", "custom"
- `start_date` (string, optional): Required if period is "custom" (YYYY-MM-DD)
- `end_date` (string, optional): Required if period is "custom" (YYYY-MM-DD)

**Example Requests:**
```
GET /api/accounts/summary
GET /api/accounts/summary?period=current_month
GET /api/accounts/summary?period=custom&start_date=2025-01-01&end_date=2025-01-31
```

**Response Body:**
```json
{
  "current_month_revenue": 250000,
  "current_month_expenses": 180000,
  "current_month_profit": 70000,
  "previous_month_revenue": 220000,
  "previous_month_expenses": 160000,
  "previous_month_profit": 60000,
  "revenue_change_percent": 13.64,
  "expense_change_percent": 12.50,
  "profit_change_percent": 16.67,
  "pending_receivables": 125000,
  "pending_payables": 45000,
  "total_transactions": 156
}
```

**Field Descriptions:**
- `current_month_revenue`: Total income for current period
- `current_month_expenses`: Total expenses for current period
- `current_month_profit`: Net profit (revenue - expenses)
- `previous_month_*`: Same metrics for comparison period
- `*_change_percent`: Percentage change from previous period
- `pending_receivables`: Unpaid work orders (from customers)
- `pending_payables`: Unreceived purchase orders (to vendors)
- `total_transactions`: Total number of transactions all-time

---

### List Payments

Retrieve payment transactions (received or made).

**Endpoint:** `/api/accounts/payments`

#### GET Request

**Query Parameters:**
- `customer_id` (integer, optional): Filter by customer
- `vendor_id` (integer, optional): Filter by vendor
- `limit` (integer, optional): Limit results (default: 50)

**Example Requests:**
```
GET /api/accounts/payments
GET /api/accounts/payments?customer_id=2
GET /api/accounts/payments?vendor_id=3&limit=10
```

**Response Body:**
```json
[
  {
    "id": 15,
    "created_at": "2025-01-18T09:00:00.000Z",
    "transaction_date": "2025-01-18",
    "transaction_type": "payment_received",
    "category": "sales",
    "amount": 75000,
    "description": "Payment for Work Order #7",
    "reference_id": 7,
    "reference_type": "work_order",
    "payment_method": "card",
    "customer_id": 2,
    "vendor_id": null,
    "status": "completed",
    "notes": null
  }
]
```

---

### Record Payment

Record a payment received from customer or made to vendor.

**Endpoint:** `/api/accounts/payments`

#### POST Request

**Request Body (Payment from Customer):**
```json
{
  "amount": 100000,
  "payment_method": "bank_transfer",
  "transaction_date": "2025-01-25",
  "customer_id": 2,
  "reference_type": "work_order",
  "reference_id": 8,
  "notes": "Full payment received for custom order"
}
```

**Request Body (Payment to Vendor):**
```json
{
  "amount": 50000,
  "payment_method": "cheque",
  "transaction_date": "2025-01-25",
  "vendor_id": 3,
  "reference_type": "purchase_order",
  "reference_id": 12,
  "notes": "Payment for material delivery"
}
```

**Required Fields:**
- `amount` (number): Payment amount
- `payment_method` (string): Payment method
- `transaction_date` (string): Date of payment (YYYY-MM-DD)
- Either `customer_id` OR `vendor_id` must be provided

**Optional Fields:**
- `reference_id` (integer): Related order/invoice ID
- `reference_type` (string): "work_order", "purchase_order", or "invoice"
- `notes` (string): Additional notes

**Response Body:**
```json
{
  "message": "Payment recorded successfully",
  "data": {
    "id": 25,
    "transaction_type": "payment_received",
    "category": "sales",
    "amount": 100000,
    "customer_id": 2,
    "status": "completed"
  }
}
```

**Status Code:** `201 Created`

**Note:** If `reference_type` is "work_order", the system automatically updates the work order's `isPaid` status to `true`.

---

### Get Analytics

Retrieve analytics data including category breakdown, monthly trends, and top customers/vendors.

**Endpoint:** `/api/accounts/analytics`

#### GET Request

**Query Parameters:**
- `months` (integer, optional): Number of months to include (default: 6)

**Example Requests:**
```
GET /api/accounts/analytics
GET /api/accounts/analytics?months=12
```

**Response Body:**
```json
{
  "category_breakdown": [
    {
      "category": "purchase_order",
      "amount": 350000,
      "percentage": 45.5,
      "count": 15
    },
    {
      "category": "salaries",
      "amount": 200000,
      "percentage": 26.0,
      "count": 6
    },
    {
      "category": "utilities",
      "amount": 80000,
      "percentage": 10.4,
      "count": 6
    }
  ],
  "monthly_trends": [
    {
      "month": "2024-08",
      "revenue": 180000,
      "expenses": 120000,
      "profit": 60000
    },
    {
      "month": "2024-09",
      "revenue": 220000,
      "expenses": 150000,
      "profit": 70000
    },
    {
      "month": "2024-10",
      "revenue": 250000,
      "expenses": 170000,
      "profit": 80000
    }
  ],
  "top_customers": [
    {
      "customer_id": 2,
      "customer_name": "John Doe",
      "total_amount": 500000,
      "transaction_count": 8
    },
    {
      "customer_id": 5,
      "customer_name": "Jane Smith",
      "total_amount": 350000,
      "transaction_count": 5
    }
  ],
  "top_vendors": [
    {
      "vendor_id": 1,
      "vendor_name": "Premium Materials Inc",
      "total_amount": 280000,
      "transaction_count": 12
    },
    {
      "vendor_id": 2,
      "vendor_name": "Gold Suppliers Co",
      "total_amount": 150000,
      "transaction_count": 8
    }
  ]
}
```

**Field Descriptions:**
- `category_breakdown`: Expense distribution by category with percentages
- `monthly_trends`: Revenue, expenses, and profit for each month in the period
- `top_customers`: Top 5 customers by total revenue
- `top_vendors`: Top 5 vendors by total spending

---

## Common Data Types

### Material Object
```json
{
  "id": 29,
  "created_at": "2025-10-19T18:16:06.800281+00:00",
  "name": "Gold",
  "weight": 2,
  "cost": 9000
}
```

### Design Object
```json
{
  "design_id": 31,
  "description": "Elegant swirl pattern",
  "font": "Times New Roman",
  "cost": 800,
  "colour": "Gold",
  "hex_code": "#FFD700"
}
```

### Engraving Object
```json
{
  "engraving_id": 15,
  "font": "Script",
  "type_name": "Laser",
  "description": "Personal monogram",
  "cost": 1000
}
```

### Coating Object
```json
{
  "coating_id": 16,
  "colour": "Matte",
  "hex_code": "#C0C0C0",
  "type": "Protective"
}
```

---

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Notes

1. All monetary values are in INR (Indian Rupees)
2. All weights are in grams
3. Dates are in ISO 8601 format (YYYY-MM-DD)
4. Timestamps are in ISO 8601 format with timezone
5. Color hex codes should include the `#` prefix
6. The system uses a minimum production amount of ₹50,000
7. Tax is applied at 18% for all orders

---

## Authentication

Currently, the API does not require authentication. This should be implemented in production environments.

---

## Rate Limiting

No rate limiting is currently implemented. Consider adding rate limiting for production deployment.

---

## Versioning

Current API Version: v1 (implicit in base URL)

Future versions should be explicitly versioned (e.g., `/api/v2/...`)