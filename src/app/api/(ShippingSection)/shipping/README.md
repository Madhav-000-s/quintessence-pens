Shipping API

Endpoints
- POST /api/(ShippingSection)/shipping: Create shipment
- GET /api/(ShippingSection)/shipping: List shipments (filters: order_id, status, carrier)
- PATCH /api/(ShippingSection)/shipping?id={id}: Update shipment fields

POST body
{
  "order_id": number,
  "carrier": string,
  "tracking_number": string,
  "shipped_at": string | null, // ISO date
  "expected_delivery": string | null, // ISO date
  "status": string | undefined, // defaults to "created"
  "notes": string | null
}

Notes
- Requires a Supabase table `Shipment` with columns at least: id, order_id, carrier, tracking_number, shipped_at, expected_delivery, status, notes, created_at.


