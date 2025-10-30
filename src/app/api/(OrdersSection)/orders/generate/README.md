## Generate API

Creates a new work order (Bill of Material) with automatic pricing calculation, inventory checking, and manufacturing duration estimation.

### Endpoint
- Method: POST
- Path: `/api/orders/generate`

### Request Body
Content-Type: `application/json`

#### Required Fields
- `pen_id` (number, required): Identifier of the pen configuration to manufacture
- `customer_id` (number, required): Identifier of the customer placing the order
- `count` (number, required): Quantity of pens to manufacture
- `isBusines` (boolean, required): Business classification flag

### Sample Request
```json
{
  "pen_id": 42,
  "customer_id": 123,
  "count": 100,
  "isBusines": true
}
```

#### cURL Example
```bash
curl -X POST \
  'http://localhost:3000/api/orders/generate' \
  -H 'Content-Type: application/json' \
  --data '{
    "pen_id": 42,
    "customer_id": 123,
    "count": 100,
    "isBusines": true
  }'
```

### Process Flow

1. **Pen Cost Retrieval**: Fetches base cost from `Pen` table
2. **Price Calculation**: Calculates subtotal, tax, and total using `calculatePayable()`
3. **Material Analysis**: Determines required materials and weights via `getPenMaterialsWeights()`
4. **Inventory Check**: Verifies material availability using `checkInventory()`
5. **Duration Calculation**: Estimates manufacturing time based on inventory status and backlog
6. **Work Order Creation**: Inserts new record into `WorkOrder` table

### Response

#### 201 Created
```json
"Bill of Material created successfully"
```

#### 400 Bad Request
```json
{
  "code": "error_code",
  "message": "Error description",
  "details": "Additional error information"
}
```

### Work Order Fields Created

The API creates a `WorkOrder` record with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `customer_id` | number | Customer identifier |
| `pen` | number | Pen configuration ID |
| `isPaid` | boolean | Payment status (always `false` for new orders) |
| `start_date` | string | Manufacturing start date (today) |
| `end_date` | string | Estimated completion date |
| `count` | number | Quantity ordered |
| `unit_cost` | number | Base pen cost |
| `subtotal` | number | Pre-tax total |
| `tax_amt` | number | Tax amount (18%) |
| `grand_total` | number | Final amount including tax |
| `isBusnies` | boolean | Business classification |
| `material_wts` | object | Required materials and weights |

### Manufacturing Duration Logic

The completion date is calculated based on:

- **Base Production Time**: 7 days (from `time-details.json`)
- **Material Purchase Time**: +3 days if inventory unavailable
- **Quality Control**: +1 day (always included)
- **Backlog Delay**: +2 days if >3 orders are "In Production"

### Inventory Integration

- Automatically checks material availability for the specified pen
- Calculates required material weights for all components
- Adjusts manufacturing timeline if materials need to be ordered

### Error Handling

- **Pen Not Found**: Returns 400 if `pen_id` doesn't exist
- **Database Errors**: Returns 400 with Supabase error details
- **Invalid Data**: Handles missing or malformed request fields

### Dependencies

- `calculatePayable()`: Price calculation with labor, packaging, shipping, and tax
- `getPenMaterialsWeights()`: Material requirement analysis
- `checkInventory()`: Inventory availability verification
- `calculateManufacturingDuration()`: Timeline estimation with backlog consideration

### Notes

- All monetary values are calculated automatically based on current pricing configuration
- Manufacturing timeline adapts to current production backlog
- Material requirements are determined from pen configuration (cap, barrel, nib, engravings)
- The API creates a complete work order ready for production scheduling
