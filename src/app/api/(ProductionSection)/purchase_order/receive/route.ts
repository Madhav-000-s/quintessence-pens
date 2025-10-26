import { supabase } from "@/supabase-client";
import { updateInventoryAfterReceipt } from "@/app/lib/productionFunctions";

export async function PATCH(request: Request) {
    const body = await request.json();

    const { data, error } = await supabase
        .from("PurchaseOrder")
        .update({ isReceived: true })
        .eq("id", body.order_id)  
        .select("material, quantity")
        .single();
    
    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    if(!await updateInventoryAfterReceipt(data.material, data.quantity)) {
        return new Response(JSON.stringify("Failed to update inventory"), { status: 500 });
    }
    return Response.json("Purchase order accepted successfully", { status: 200 });
}