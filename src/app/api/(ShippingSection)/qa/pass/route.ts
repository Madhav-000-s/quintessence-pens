import { serviceClient } from "@/supabase-client";
import { NextRequest } from "next/server";

// Pass QA and create shipping record
export async function POST(request: NextRequest) {
    const adminClient = serviceClient();
    const body = await request.json();
    const { qa_id, work_order_id } = body;

    if (!qa_id || !work_order_id) {
        return new Response(JSON.stringify({ message: "Missing qa_id or work_order_id" }), { status: 400 });
    }

    try {
        // Update QA status to passed
        const { error: qaError } = await adminClient
            .from("QualityAssurance")
            .update({ status: "passed" })
            .eq("id", qa_id);

        if (qaError) throw qaError;

        // Fetch work order details to create shipping record
        const { data: workOrder, error: woError } = await adminClient
            .from("WorkOrder")
            .select("customer_id, pen, count, defective")
            .eq("id", work_order_id)
            .single();

        if (woError) throw woError;

        // Calculate shipped count (total - defective)
        const shippedCount = (workOrder.count || 0) - (workOrder.defective || 0);

        // Calculate estimated arrival date (7 days from now)
        const arrivalDate = new Date();
        arrivalDate.setDate(arrivalDate.getDate() + 7);

        // Create shipping record
        const { error: shippingError } = await adminClient
            .from("Shipping")
            .insert({
                customer: workOrder.customer_id,
                pen: workOrder.pen,
                total_count: workOrder.count,
                defective_count: workOrder.defective || 0,
                shipped_count: shippedCount,
                arival_date: arrivalDate.toISOString().split('T')[0]
            });

        if (shippingError) throw shippingError;

        return new Response(JSON.stringify({ message: "QA passed and shipping record created" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Failed to pass QA" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
