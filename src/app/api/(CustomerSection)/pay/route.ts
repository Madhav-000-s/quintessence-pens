import { getCustomerId } from "@/app/lib/customerFunctions";
import { supabase, serverClient } from "@/supabase-client";

export async function PUT(request: Request) {
    const body = await request.json();

    const serverSupa = await serverClient();
    const { data, error } = await serverSupa.auth.getUser();
    if(error){
        return Response.json(error, {status: 401})
    }


    const customer = await getCustomerId(data.user.id);

    const { error: carterror } = await supabase
        .from("Cart")
        .update({isActive: false})
        .eq("customer", customer);

    const { data: oderData, error: orderError } = await supabase
        .from("WorkOrder")
        .update({isAccepted:true, status: 'order accepted'})
        .eq('customer_id', customer);

    if(orderError) {
        return Response.json(orderError, {status:500})
    }

    return Response.json("Paymaent complete");
}