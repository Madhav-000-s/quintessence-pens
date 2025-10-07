import { supabase } from "@/supabase-client";
import { extractPenDetails } from "@/app/lib/configuratorFunctions";
import { getAmountDetails } from "@/app/lib/orderFunction";

export async function GET(request: Request) {
    const body = await request.json();
    const { data, error } = await supabase
    .from("WorkOrder")
    .select("*")
    .eq("pen", body.pen_id);

    if(error) {
        return new Response(JSON.stringify(error), {status: 400});
    }

    const finalData = {
        ...data[0],
        pen: await extractPenDetails(data[0].pen),
        cost_division: getAmountDetails()
    }

    return new Response(JSON.stringify(finalData), {status: 200});
}