import { supabase } from "@/supabase-client";
import { NextRequest } from "next/server";

// Create a return request
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { order_id, reason, items, requested_at, status, notes } = body;

    const { data, error } = await supabase
        .from("Return")
        .insert({
            order_id,
            reason,
            items,
            requested_at,
            status: status ?? "requested",
            notes
        })
        .select("*");

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Return created", data }), { status: 201, headers: { "Content-Type": "application/json" } });
}

// List returns with optional filters: order_id, status
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");
    const status = searchParams.get("status");

    let query = supabase.from("Return").select("*");
    if (orderId) query = query.eq("order_id", orderId);
    if (status) query = query.eq("status", status);

    const { data, error } = await query;
    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}

// Update return by id
export async function PATCH(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ message: "Missing id" }), { status: 400 });
    }

    const body = await request.json();
    const { data, error } = await supabase
        .from("Return")
        .update(body)
        .eq("id", id)
        .select("*");

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Return updated", data }), { status: 200, headers: { "Content-Type": "application/json" } });
}



