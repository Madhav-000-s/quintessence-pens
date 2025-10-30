import { extractPenDetails } from "@/app/lib/configuratorFunctions";
import { supabase } from "@/supabase-client";
import { count } from "console";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const work_id = searchParams.get("work_order_id");
    
    const { data, error } = await supabase
        .from("WorkOrder")
        .select("*")
        .eq("id", work_id)
        .single();
        
    if(error) {
        return new Response(JSON.stringify(error), {status:400});
    }

    const finalData = {
        id: work_id,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        count: data.count,  
        isBusines: data.isBusines,
        materialsRequired: data.material_wts,
        pen: await extractPenDetails(data.pen)
    }

    return Response.json(finalData, {status:200});
}