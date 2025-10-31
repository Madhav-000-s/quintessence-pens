import { calculatePayable, calculateManufacturingDuration, getPenMaterialsWeights, checkInventory } from "@/app/lib/orderFunction";
import { supabase } from "@/supabase-client";
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from "next/server";
// import { Payload } from "@/app/api/(configurators)/configure_cap/route";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: NextRequest) {
    const body = await request.json();

    
    const { data: PenData, error: PenError } = await supabase
        .from("Pen")
        .select("cost")
        .eq("pen_id", body.penId);

    if(PenError) {
        console.error(PenError);
        return new Response(JSON.stringify(PenError), {status: 400});
    }
    console.log("1st");
    const { subtotal, taxAmount, totalWithTax } = calculatePayable(PenData[0].cost, body.count, 18);
    
    const requiredMaterialsAndWts = await getPenMaterialsWeights(body.penId);
    const inventoryCheckResults = await checkInventory(requiredMaterialsAndWts);

    // Generate dates
    const today = new Date();
    const completionDay = await calculateManufacturingDuration(today, !inventoryCheckResults.allAvailable);
    
    // Format dates as YYYY-MM-DD for Supabase date fields
    const startDate = today.toISOString().split('T')[0]; // Today's date
    const endDate = completionDay.toISOString().split('T')[0]; // One week from today
    console.log("2nd");
    const { data, error } = await supabase
        .from("WorkOrder")
        .insert({
            customer_id: body.customer_id,
            pen: body.penId,
            isPaid: false,
            start_date: startDate,
            end_date: endDate,
            count: body.count,
            unit_cost: PenData[0].cost,
            subtotal: subtotal,
            tax_amt: taxAmount,
            grand_total: totalWithTax,
            isBusiness: body.isBusines,
            status: "awaiting confirmation",
            material_wts: requiredMaterialsAndWts
        });

    if(error) {
        console.log("3rd");
        console.error(error);
        return new Response(JSON.stringify(error), {status: 400});
    }
    const cookieOptions = {
        name: 'pen',
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: '/',
    }
    const response = NextResponse.json(
        { message: "Work order created successfully.", pen_id: body.penId },
        { status: 201 }
    );
    return response;
}