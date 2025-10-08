import { calculatePayable, calculateManufacturingDuration, getPenMaterialsWeights, checkInventory } from "@/app/lib/orderFunction";
import { supabase } from "@/supabase-client";

export async function POST(request: Request) {
    const body = await request.json();

    const { data: PenData, error: PenError } = await supabase
        .from("Pen")
        .select("cost")
        .eq("pen_id", body.pen_id);

    if(PenError) {
        console.error(PenError);
        return new Response(JSON.stringify(PenError), {status: 400});
    }
    
    const { subtotal, taxAmount, totalWithTax } = calculatePayable(PenData[0].cost, body.count, 18);
    
    const requiredMaterialsAndWts = await getPenMaterialsWeights(body.pen_id);
    const inventoryCheckResults = await checkInventory(requiredMaterialsAndWts);

    // Generate dates
    const today = new Date();
    const completionDay = await calculateManufacturingDuration(today, !inventoryCheckResults.allAvailable);
    
    // Format dates as YYYY-MM-DD for Supabase date fields
    const startDate = today.toISOString().split('T')[0]; // Today's date
    const endDate = completionDay.toISOString().split('T')[0]; // One week from today
    
    const { data, error } = await supabase
        .from("WorkOrder")
        .insert({
            customer_id: body.customer_id,
            pen: body.pen_id,
            isPaid: false,
            start_date: startDate,
            end_date: endDate,
            count: body.count,
            unit_cost: PenData[0].cost,
            subtotal: subtotal,
            tax_amt: taxAmount,
            grand_total: totalWithTax,
            isBusnies: body.isBusines
        });

    if(error || !data) {
        console.error(error);
        return new Response(JSON.stringify(error), {status: 400});
    }

    return new Response(JSON.stringify("Bill of Material created successfully"), {status: 201});
}