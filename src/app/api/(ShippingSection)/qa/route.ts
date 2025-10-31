import { serviceClient } from "@/supabase-client";
import { NextRequest } from "next/server";

// Get all QA records with work order, customer, and pen details (bypasses RLS for superadmin access)
export async function GET(request: NextRequest) {
    const adminClient = serviceClient();

    // First get QA records
    const { data: qaData, error: qaError } = await adminClient
        .from("QualityAssurance")
        .select("*")
        .order("inspection_date", { ascending: false });

    if (qaError) {
        return new Response(JSON.stringify(qaError), { status: 400 });
    }

    // Enrich with work order details
    const enrichedData = await Promise.all(
        (qaData || []).map(async (qa) => {
            if (!qa.work_order_id) return qa;

            // Fetch work order with customer and pen details
            const { data: woData } = await adminClient
                .from("WorkOrder")
                .select(`
                    id,
                    count,
                    defective,
                    status,
                    start_date,
                    end_date,
                    customer_id,
                    pen
                `)
                .eq("id", qa.work_order_id)
                .single();

            if (!woData) return qa;

            // Fetch customer details
            const { data: customerData } = await adminClient
                .from("Customers")
                .select("first_name, last_name, email")
                .eq("id", woData.customer_id)
                .single();

            // Fetch pen details
            const { data: penData } = await adminClient
                .from("Pen")
                .select("pentype, cost")
                .eq("id", woData.pen)
                .single();

            return {
                ...qa,
                work_order: {
                    ...woData,
                    customer: customerData,
                    pen_details: penData
                }
            };
        })
    );

    return new Response(JSON.stringify(enrichedData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}

// Create new QA record (bypasses RLS for superadmin access)
export async function POST(request: NextRequest) {
    const adminClient = serviceClient();
    const body = await request.json();

    const { data, error } = await adminClient
        .from("QualityAssurance")
        .insert([body])
        .select();

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
        status: 201,
        headers: { "Content-Type": "application/json" }
    });
}

// Update QA record (bypasses RLS for superadmin access)
export async function PATCH(request: NextRequest) {
    const adminClient = serviceClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response(JSON.stringify({ message: "Missing id" }), { status: 400 });
    }

    const body = await request.json();

    const { data, error } = await adminClient
        .from("QualityAssurance")
        .update(body)
        .eq("id", id)
        .select();

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}

// Delete QA record (bypasses RLS for superadmin access)
export async function DELETE(request: NextRequest) {
    const adminClient = serviceClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return new Response(JSON.stringify({ message: "Missing id" }), { status: 400 });
    }

    const { error } = await adminClient
        .from("QualityAssurance")
        .delete()
        .eq("id", id);

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify({ message: "QA record deleted" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
