import { supabase } from "@/supabase-client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const workOrderId = searchParams.get("work_order_id");

    const { data, error } = await supabase
        .from("WorkOrder")
        .select("*")
        .eq("id", workOrderId);
}