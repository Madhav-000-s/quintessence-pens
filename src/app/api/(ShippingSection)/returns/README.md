Returns API

Endpoints
- POST /api/(ShippingSection)/returns: Create return request
- GET /api/(ShippingSection)/returns: List returns (filters: order_id, status)
- PATCH /api/(ShippingSection)/returns?id={id}: Update return fields

POST body
{
  "order_id": number,
  "reason": string,
  "items": any, // JSON of items/quantities being returned
  "requested_at": string | null, // ISO date
  "status": string | undefined, // defaults to "requested"
  "notes": string | null
}

Notes
- Requires a Supabase table `Return` with columns at least: id, order_id, reason, items (json), requested_at, status, notes, created_at.


