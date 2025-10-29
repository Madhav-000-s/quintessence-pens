import { supabase, serverClient } from "@/supabase-client";
import { getCustomerId } from "@/app/lib/customerFunctions";

export async function GET(request: Request) {
    const supaServer = await serverClient();
    const { data, error } = await supaServer.auth.getUser()
    console.log("hello");
    if(error) {
        console.error(error);
        return Response.json({error: error}, {status:401});
    }
    console.log("here");
    const customer = await getCustomerId(data.user.id);

    const { data: Gdata, error: Gerror } = await supabase
        .from("Grievances")
        .select("*")
        .eq("customer", customer)
    
    if(Gerror){
        console.error(Gerror)
        return Response.json(Gerror, {status: 500});
    }
    console.log("thre")
    return Response.json(Gdata);
}