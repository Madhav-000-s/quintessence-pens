import { supabase } from "@/supabase-client";

// Compose a shipping invoice by work_order_id, optionally including a shipment id
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const workOrderId = searchParams.get("work_order_id");
    const shipmentId = searchParams.get("shipment_id");

    if (!workOrderId) {
        return new Response(JSON.stringify({ message: "Missing work_order_id" }), { status: 400 });
    }

    const { data: workOrders, error: workOrderError } = await supabase
        .from("WorkOrder")
        .select("*, Pen(*), Customer:customer_id(*)")
        .eq("id", workOrderId);

    if (workOrderError || !workOrders || workOrders.length === 0) {
        return new Response(JSON.stringify(workOrderError ?? { message: "Work order not found" }), { status: 400 });
    }

    let shipment = null as any;
    if (shipmentId) {
        const { data: shipments, error: shipmentError } = await supabase
            .from("Shipment")
            .select("*")
            .eq("id", shipmentId);
        if (shipmentError) {
            return new Response(JSON.stringify(shipmentError), { status: 400 });
        }
        shipment = shipments && shipments.length ? shipments[0] : null;
    } else {
        const { data: shipments } = await supabase
            .from("Shipment")
            .select("*")
            .eq("order_id", workOrders[0].id)
            .order("created_at", { ascending: false })
            .limit(1);
        shipment = shipments && shipments.length ? shipments[0] : null;
    }

    const workOrder = workOrders[0];

    const invoice = {
        invoice_type: "shipping",
        invoice_title: "Shipping Invoice",
        work_order_id: workOrder.id,
        order_status: workOrder.status,
        count: workOrder.count,
        unit_cost: workOrder.unit_cost,
        subtotal: workOrder.subtotal,
        tax_amt: workOrder.tax_amt,
        grand_total: workOrder.grand_total,
        customer: workOrder.Customer ?? workOrder.customer_id,
        pen_id: workOrder.pen,
        shipment: shipment,
        totals: {
            shipping_cost: shipment?.shipping_cost ?? 0,
            total_payable: (workOrder.grand_total ?? 0) + (shipment?.shipping_cost ?? 0)
        }
    };

    return new Response(JSON.stringify(invoice), { status: 200, headers: { "Content-Type": "application/json" } });
}



