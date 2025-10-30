import { getCustomerId } from "@/app/lib/customerFunctions";
import { supabase, serverClient } from "@/supabase-client";

export async function GET(request: Request) {
    const supaServer = await serverClient();
    const { data, error } = await supaServer.auth.getUser();
    if(error){
        return Response.json("Login required", {status: 401});
    }

    const customer = await getCustomerId(data.user.id);
    const { data: Order, error: OrderError } = await supabase
        .from("WorkOrder")
        .select("status, start_date, end_date, grand_total, pen, created_at, count")
        .eq("customer_id", customer)
    
    if(OrderError) {
        return Response.json(OrderError, {status: 500});
    }

    return Response.json(Order);
}