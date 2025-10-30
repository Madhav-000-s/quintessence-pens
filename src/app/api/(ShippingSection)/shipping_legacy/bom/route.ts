import { supabase } from "@/supabase-client";
import { extractPenDetails } from "@/app/lib/configuratorFunctions";
import { expandCustomer } from "@/app/lib/customerFunctions";
import { getAmountDetails, checkInventory } from "@/app/lib/orderFunction";

import stone_prices from "@/app/data/stone-price.json";
import amount_details from "@/app/data/amount-details.json";
import time_details from "@/app/data/time-details.json";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const workOrderId = searchParams.get("work_order_id");

    if (!workOrderId) {
        return new Response(JSON.stringify({ message: "Missing work_order_id" }), { status: 400 });
    }

    const { data, error } = await supabase
        .from("WorkOrder")
        .select("*")
        .eq("id", workOrderId);

    if (error || !data || data.length === 0) {
        return new Response(JSON.stringify(error ?? { message: "Work order not found" }), { status: 400 });
    }

    const requiredMaterialsAndWts = await checkInventory(data[0].material_wts);

    const finalData = {
        id: data[0].id,
        start_date: data[0].start_date,
        end_date: data[0].end_date,
        status: data[0].status,
        count: data[0].count,
        unit_cost: data[0].unit_cost,
        subtotal: data[0].subtotal,
        tax_amt: data[0].tax_amt,
        grand_total: data[0].grand_total,
        pen: await extractPenDetails(data[0].pen),
        cost_division: getAmountDetails(),
        customer: await expandCustomer(data[0].customer_id),
        isPaid: data[0].isPaid,
        AllMaterials: data[0].material_wts,
        requiredMaterials: requiredMaterialsAndWts,
        material_prices: stone_prices,
        amount_details: amount_details,
        time_details: time_details
    };

    return new Response(JSON.stringify(finalData), { status: 200, headers: { "Content-Type": "application/json" } });
}



