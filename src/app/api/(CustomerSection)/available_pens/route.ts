import { supabase } from "@/supabase-client";

export async function GET(request: Request) {
    const { data, error } = await supabase
        .from("Inventory")
        .select("pen_id")
        .eq("isPen", true);

    if(error) {
        return Response.json(error, {status: 500})
    }

    return Response.json(data, {status: 200})
}