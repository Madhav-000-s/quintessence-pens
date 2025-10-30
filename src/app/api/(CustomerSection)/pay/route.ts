import { supabase, serverClient } from "@/supabase-client";

export async function PUT(request: Request) {
    const body = await request.json();

    const serverSupa = await serverClient();
    const { data, error } = await serverSupa.auth.getUser();
    if(error){
        return Response.json(error, {status: 401})
    }
    const { data: oderData, error: orderError } = await supabase
        .from("WorkOrder")
        .update({isAccepted:true})
        .eq('customer_id', 1);

    if(orderError) {
        return Response.json(orderError, {status:500})
    }

    return Response.json("Paymaent complete");
}