import { supabase } from "@/supabase-client";

export async function PATCH(request: Request) {
    const body = await request.json();
    const { orderId } = body;
    const { data, error } = await supabase
        .from("WorkOrder")
        .update({ isAccepted: true, status: "in production"})
        .eq("id", orderId)
        
    if(error) {
        return new Response(JSON.stringify(error), {status: 400});
    }
    return new Response(JSON.stringify("Order accepted"), {status: 200});
}