import { serviceClient } from "@/supabase-client";
import { NextRequest } from "next/server";

// Get all shipping records with work order details (bypasses RLS for superadmin access)
export async function GET(request: NextRequest) {
    const adminClient = serviceClient();

    // Get shipping records
    const { data: shippingData, error: shippingError } = await adminClient
        .from("Shipping")
        .select("*")
        .order("created_at", { ascending: false });

    if (shippingError) {
        return new Response(JSON.stringify(shippingError), { status: 400 });
    }

    // Enrich with customer, pen, and work order details
    const enrichedData = await Promise.all(
        (shippingData || []).map(async (shipping) => {
            // Fetch customer details
            const { data: customerData } = await adminClient
                .from("Customers")
                .select("first_name, last_name, email, phone")
                .eq("id", shipping.customer)
                .single();

            // Fetch pen details
            const { data: penData } = await adminClient
                .from("Pen")
                .select("pentype, cost")
                .eq("id", shipping.pen)
                .single();

            // Fetch work order details if available
            let workOrderData = null;
            if (shipping.work_order_id) {
                const { data: woData } = await adminClient
                    .from("WorkOrder")
                    .select("id, count, defective, status, grand_total, unit_cost")
                    .eq("id", shipping.work_order_id)
                    .single();
                workOrderData = woData;
            }

            return {
                ...shipping,
                customer_details: customerData,
                pen_details: penData,
                work_order: workOrderData
            };
        })
    );

    return new Response(JSON.stringify(enrichedData), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
