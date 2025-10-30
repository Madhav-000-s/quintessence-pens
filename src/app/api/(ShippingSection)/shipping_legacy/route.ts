import { supabase } from "@/supabase-client";
import { NextRequest } from "next/server";

// Create a shipment
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { order_id, carrier, tracking_number, shipped_at, expected_delivery, status, notes } = body;

    const { data, error } = await supabase
        .from("Shipment")
        .insert({
            order_id,
            carrier,
            tracking_number,
            shipped_at,
            expected_delivery,
            status: status ?? "created",
            notes
        })
        .select("*");

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Shipment created", data }), { status: 201, headers: { "Content-Type": "application/json" } });
}

// List shipments with optional filters: order_id, status, carrier
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("status");
    const carrier = searchParams.get("carrier");

    let query = supabase.from("Shipment").select("*");
    if (orderId) query = query.eq("order_id", orderId);
    if (status) query = query.eq("status", status);
    if (carrier) query = query.eq("carrier", carrier);

    const { data, error } = await query;
    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}

// Update shipment by id
export async function PATCH(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ message: "Missing id" }), { status: 400 });
    }

    const body = await request.json();
    const { data, error } = await supabase
        .from("Shipment")
        .update(body)
        .eq("id", id)
        .select("*");

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Shipment updated", data }), { status: 200, headers: { "Content-Type": "application/json" } });
}



