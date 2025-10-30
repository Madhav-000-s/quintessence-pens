import { supabase, serverClient } from "@/supabase-client";
import { getCustomerId } from "@/app/lib/customerFunctions";

export async function GET(request: Request) {
    const supaServer = await serverClient();
    const { data, error } = await supaServer.auth.getUser();

    if(error) {
        return Response.json({error: error}, {status:401});
    }
    
    const customer = await getCustomerId(data.user?.id);

    const { data: cartData, error: cartError } = await supabase
        .from("WorkOrder")
        .select("isPaid, status, start_date, end_date, grand_total, pen")
        .eq("customer_id", customer)
        .eq("isAccepted", false);

    if (cartError) {
        return Response.json(error, {status:500})
    }
    return Response.json(cartData, {status: 200});
}
