import { supabase } from "@/supabase-client";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
    const body = await request.json();
    const { data, error } = await supabase
        .from("WorkOrder")
        .update({
            start_date: body.start_date,
            end_date: body.end_date,
        })
        .eq("id", body.id);
    
    if(error) {
        return new Response(JSON.stringify(error), {status: 400});
    }

    return Response.json("Work order schedule updated");
}
