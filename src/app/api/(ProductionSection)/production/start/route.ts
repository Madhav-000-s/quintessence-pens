import { checkInventory } from "@/app/lib/orderFunction";
import { deductMaterialFromInventory } from "@/app/lib/productionFunctions";
import { supabase } from "@/supabase-client";

export async function POST(request: Request) {
    const body = await request.json();

    const { data, error } = await supabase
        .from("WorkOrder")
        .select("material_wts, pen, count")
        .eq("id", body.work_order_id)
        .single();
    
    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    const materialData = await checkInventory(data.material_wts, data.count);
    if(!materialData.allAvailable) {
        return new Response(JSON.stringify("Insufficient materials in inventory"), { status: 400 });
    }

    if(!await deductMaterialFromInventory(data.material_wts, data.count)) {
        return new Response(JSON.stringify("Error deducting materials from inventory"), { status: 500 });
   }

    const { data: updateData, error: updateError } = await supabase
        .from("WorkOrder")
        .update({ status: "in production", start_date: new Date().toISOString().split('T')[0]})
        .eq("id", body.work_order_id);
    if (updateError) {
        return new Response(JSON.stringify(updateError), { status: 400 });
    }
    return Response.json("Production started successfully", { status: 200 });
}