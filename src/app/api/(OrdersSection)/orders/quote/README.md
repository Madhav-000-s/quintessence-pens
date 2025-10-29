## Quote API

Returns a detailed quote for a work order associated with a specific pen.

### Endpoint
- Method: GET
- Path: `/api/orders/quote`

### Request Body
Content-Type: `application/json`

Fields
- `pen_id` (string | number, required): Identifier of the pen to quote for. The handler queries the `WorkOrder` table by matching `pen` to this value.

#### cURL example (note: GET with a JSON body)
```bash
curl -X GET \
  'http://localhost:3000/api/orders/quote' \
  -H 'Content-Type: application/json' \
  --data '{"pen_id": 42}'
```

### Sample Request
```json
{
  "pen_id": 42
}
```

### Responses
- 200 OK: JSON payload with work order pricing and expanded details
- 400 Bad Request: JSON error payload from Supabase

#### 200 OK Response Shape
```json
{
  "id": 123,
  "start_date": "2025-10-10",
  "end_date": "2025-10-20",
  "status": "pending",
  "count": 500,
  "unit_cost": 2.5,
  "subtotal": 1250,
  "tax_amt": 225,
  "grand_total": 1475,
  "pen": { /* result of extractPenDetails(...) */ },
  "cost_division": { /* result of getAmountDetails() */ },
  "customer": { /* result of expandCustomer(...) */ }
}
```

### Notes
- This handler performs:
  - A `select *` from `WorkOrder` where `pen = pen_id`
  - Enrichment of `pen` via `extractPenDetails(pen)`
  - Inclusion of cost breakdown via `getAmountDetails()`
  - Expansion of `customer` via `expandCustomer(customer_id)`
- The route expects a JSON body even though it uses the GET method. Some HTTP clients/browsers may not support GET requests with a body. If you encounter issues, consider switching the endpoint to POST.
- If no matching work order exists for the given `pen_id`, the current implementation will attempt to access `data[0]` and may throw a runtime error (HTTP 500). Consider guarding for empty results or updating the handler to return 404.
- Ensure the `WorkOrder` table contains the fields referenced above (`id`, `start_date`, `end_date`, `status`, `count`, `unit_cost`, `subtotal`, `tax_amt`, `grand_total`, `pen`, `customer_id`).


