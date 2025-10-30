import { serviceClient } from "@/supabase-client";
import { NextRequest } from "next/server";

// Get detailed shipping record with related data for packing slip
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminClient = serviceClient();
    const shipmentId = params.id;

    try {
        // Fetch shipping record with customer and pen details
        const { data: shippingData, error: shippingError } = await adminClient
            .from("Shipping")
            .select(`
                *,
                customer_details:Customers!Shipping_customer_fkey(id, first_name, last_name, email, phone),
                pen_details:Pen!Shipping_pen_fkey(pentype, cost, nibtype_id, ink_type_id, cap_type_id, barrel_id)
            `)
            .eq("id", shipmentId)
            .single();

        if (shippingError) throw shippingError;

        // Fetch all QA records and get the most recent one
        const { data: qaData } = await adminClient
            .from("QualityAssurance")
            .select("inspector_name, inspection_date, status, defects_found, defect_description, work_order_id")
            .order("created_at", { ascending: false })
            .limit(1);

        // Fetch work order details if QA record exists
        let workOrderData = null;
        if (qaData && qaData.length > 0) {
            const { data: woData } = await adminClient
                .from("WorkOrder")
                .select("id, grand_total, unit_cost, subtotal, tax_amt, start_date, end_date")
                .eq("id", qaData[0].work_order_id)
                .single();
            workOrderData = woData;
        }

        const result = {
            ...shippingData,
            qa_record: qaData && qaData.length > 0 ? qaData[0] : undefined,
            work_order: workOrderData || undefined,
        };

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ message: err.message || "Failed to fetch shipment details" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
