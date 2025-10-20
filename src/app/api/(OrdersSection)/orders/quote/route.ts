import { supabase } from "@/supabase-client";
import { extractPenDetails } from "@/app/lib/configuratorFunctions";
import { getAmountDetails } from "@/app/lib/orderFunction";
import { expandCustomer } from "@/app/lib/customerFunctions";

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
        id: data[0].id,
        start_date: data[0].start_date,
        end_date: data[0].end_date,
        status: data[0].status,
        count: data[0].count,
        unit_cost: data[0].unit_cost,
        subtotal: data[0].subtotal,
        tax_amt: data[0].tax_amt,
        grand_total: data[0].grand_total,
        pen: await extractPenDetails(data[0].pen),
        cost_division: getAmountDetails(),
        customer: await expandCustomer(data[0].customer_id),
        isPaid: data[0].isPaid
    }

    return new Response(JSON.stringify(finalData), {status: 200});
}