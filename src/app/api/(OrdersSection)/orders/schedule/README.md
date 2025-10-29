## Schedule API

Updates the schedule (start and end dates) for an existing work order.

### Endpoint
- Method: POST
- Path: `/api/orders/schedule`

### Request Body
Content-Type: `application/json`

Fields
- `id` (number, required): Work order ID to update
- `start_date` (string, required): ISO 8601 date string, e.g. `2025-10-10`
- `end_date` (string, required): ISO 8601 date string, e.g. `2025-10-20`

### Sample Request
```json
{
  "id": 123,
  "start_date": "2025-10-10",
  "end_date": "2025-10-20"
}
```

### Responses
- 200 OK: `"Work order schedule updated"`
- 400 Bad Request: JSON error payload from Supabase

### Notes
- The handler updates the `WorkOrder` table by matching the `id` and setting `start_date` and `end_date`.
- Ensure dates conform to your database column types (e.g., `date` or `timestamp`).

