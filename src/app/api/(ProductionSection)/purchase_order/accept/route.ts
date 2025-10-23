import { supabase } from "@/supabase-client";

export async function PATCH(request: Request) {
    const body = await request.json();

    const { data, error } = await supabase
        .from("PurchaseOrders")
        .update({ isReceived: true })
        .eq("id", body.id)
        .select("mateial_id, quantity");
    
    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }


    return Response.json("Purchase order accepted successfully", { status: 200 });
}