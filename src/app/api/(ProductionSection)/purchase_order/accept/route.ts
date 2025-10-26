import { supabase } from "@/supabase-client";
import { updateInventoryAfterReceipt } from "@/app/lib/productionFunctions";
import { useParams } from "next/navigation";

export async function PATCH(request: Request) {
    const body = await request.json();

    const { data, error } = await supabase
        .from("PurchaseOrders")
        .update({ isReceived: true })
        .eq("id", body.id)
        .select("mateial_id, quantity")
        .single();
    
    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    await updateInventoryAfterReceipt(data.mateial_id, data.quantity);
    return Response.json("Purchase order accepted successfully", { status: 200 });
}