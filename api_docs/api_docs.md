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

Retrieve all purchase orders.

**Endpoint:** `/api/purchase_order`

#### GET Request

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