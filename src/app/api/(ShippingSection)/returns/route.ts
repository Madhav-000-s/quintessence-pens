import { supabase, serverClient } from "@/supabase-client";
import { NextRequest } from "next/server";


// Create a return request (schema: id, customerid, penid, refundcost)
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { pen, refund_cost } = body;
    const server_supa = await serverClient();
    const { data: userData, error: userError } = await server_supa.auth.getUser();

    if (userError) {
        return new Response(JSON.stringify(userError), { status: 400 });
    }

    if (!server_supa || !pen || typeof refund_cost !== "number") {
        return new Response(JSON.stringify({ message: "customerid, penid, refundcost are required" }), { status: 400 });
    }
    //extract customerid from server_Supa
    const customer = await getCustomerId(userData.user.id);

    // Ensure one return per pen
    const existing = await supabase
        .from("Return")
        .select("pen")
        .eq("pen", pen)
        .limit(1);

    if (existing.error) {
        return new Response(JSON.stringify(existing.error), { status: 400 });
    }

    if (existing.data && existing.data.length > 0) {
        return new Response(
            JSON.stringify({ message: "A return already exists for this pen" }),
            { status: 409, headers: { "Content-Type": "application/json" } }
        );
    }

    const { data, error } = await supabase
        .from("Return")
        .insert({
            customer,
            pen,
            refund_cost
        })
        .select("*");

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "Return created", data }), { status: 201, headers: { "Content-Type": "application/json" } });
}

// List returns with optional filters: customerid, penid
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const server_supa = await serverClient();
    const customer = server_supa.auth.getUser();
    const pen = searchParams.get("pen");

    let query = supabase.from("Return").select("*");
    if (customer) query = query.eq("customer", customer);
    if (pen) query = query.eq("pen", pen);

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

    // If changing penid, ensure one return per pen
    if (Object.prototype.hasOwnProperty.call(body, "penid") && body.penid !== undefined && body.penid !== null) {
        const existsForPen = await supabase
            .from("Return")
            .select("id")
            .eq("penid", body.penid)
            .neq("id", id)
            .limit(1);

        if (existsForPen.error) {
            return new Response(JSON.stringify(existsForPen.error), { status: 400 });
        }

        if (existsForPen.data && existsForPen.data.length > 0) {
            return new Response(
                JSON.stringify({ message: "A return already exists for this pen" }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }
    }
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



