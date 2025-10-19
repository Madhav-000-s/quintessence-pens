import { calculatePayable, calculateManufacturingDuration, getPenMaterialsWeights, checkInventory } from "@/app/lib/orderFunction";
import { supabase } from "@/supabase-client";
import jwt from 'jsonwebtoken'
import { NextRequest } from "next/server";
import { Payload } from "@/app/api/(configurators)/configure_cap/route";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
    const body = await request.json();

    const tokenCookie = request.cookies.get("pen");
    if(!tokenCookie) {
        return new Response(JSON.stringify("Cookie not found"), {status: 400});
    }

    try {
        const decoded = jwt.verify(tokenCookie.value, JWT_SECRET!) as Payload; 
        if(!decoded) {
            return new Response(JSON.stringify("Unable to decode cookie"), {status: 400});
        }
    
    const { data: PenData, error: PenError } = await supabase
        .from("Pen")
        .select("cost")
        .eq("pen_id", decoded.penId);

    if(PenError) {
        console.error(PenError);
        return new Response(JSON.stringify(PenError), {status: 400});
    }
    
    const { subtotal, taxAmount, totalWithTax } = calculatePayable(PenData[0].cost, body.count, 18);
    
    const requiredMaterialsAndWts = await getPenMaterialsWeights(decoded.penId);
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
            pen: decoded.penId,
            isPaid: false,
            start_date: startDate,
            end_date: endDate,
            count: body.count,
            unit_cost: PenData[0].cost,
            subtotal: subtotal,
            tax_amt: taxAmount,
            grand_total: totalWithTax,
            isBusnies: body.isBusines,
            material_wts: requiredMaterialsAndWts
        });

    if(error || !data) {
        console.error(error);
        return new Response(JSON.stringify(error), {status: 400});
    }
    request.cookies.delete("pen");
    return new Response(JSON.stringify({message: "Work order created successfully.", pen_id: decoded.penId}), {status: 201});
    }
    catch {
        return new Response(JSON.stringify("Unable to decode"), {status: 400});
    }
}