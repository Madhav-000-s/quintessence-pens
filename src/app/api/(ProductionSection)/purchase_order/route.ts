import { supabase } from "@/supabase-client";
import { getMaterialPriceAndVendor } from "@/app/lib/productionFunctions";

export async function POST(request: Request) {
    const body = await request.json();
    const insertEntry = [];
    for (const [key, value] of Object.entries(body))  {
        const result = await getMaterialPriceAndVendor(Number(key));
        const total = result?.price ? result?.price * Number(value) : 0;
        insertEntry.push({ 
            material: Number(key), 
            quantity: Number(value), 
            name: result?.name, 
            total_cost: total, 
            isReceived: false,
            vendor: result.vendor_id
        });
    };
    // console.log(insertEntry);
    const { data, error } = await supabase
        .from("PurchaseOrder")
        .insert(insertEntry)
        .select("*")
    
    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
    
    return Response.json({ message: "Purchase order created successfully", data: data }, { status: 201 });
}


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    let query = supabase.from("PurchaseOrder").select("*").order("created_at", { ascending: false });

    // If not showing all, only show pending orders
    if (!showAll) {
        query = query.eq("isReceived", false);
    }

    const { data, error } = await query;

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });

}