import { supabase } from "@/supabase-client";


export async function GET(_request: Request) {
    const { data, error } = await supabase
        .from("WorkOrder")
        .select("id, created_at, status, count, start_date, end_date, pen, customer_id")
        .order("start_date", { ascending: true });

    if(error) {
        return new Response(JSON.stringify(error), {status: 400});
    }
    return new Response(JSON.stringify(data), {status: 200, headers: {"Content-Type": "application/json"}});
}