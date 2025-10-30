import { deductMaterialFromInventory } from "@/app/lib/productionFunctions";
import { supabase, serviceClient } from "@/supabase-client";

export async function POST(request: Request) {
    const body = await request.json();
    const defective = body.defective ? body.defective : 0;
    const { data, error } = await supabase
        .from("WorkOrder")
        .update({isFinished: true, status: "production complete", defective: defective, end_date: new Date().toISOString().split('T')[0]})
        .eq("id", body.work_order_id)
        .select("count, customer_id, material_wts")
        .single();
    
    if (error) {
        return new Response(JSON.stringify(error), {status: 400});
    }

    if (defective>0) {
        const message = `Dear Customer,\nWe regret to inform you that ${defective} out of the ${data.count} pens you ordered were found to be defective. We sincerely apologize for the inconvenience caused.Please let us know if you would prefer to cancel the shipment or receive the remaining non-defective pens. We appreciate your understanding and will act promptly based on your preference.`
        const { data: GrievanceData, error: GrievanceError} = await supabase
            .from("Grievances")
            .insert({"message": message, defective_count: defective, customer:data.customer_id})

        if(GrievanceError){
            return new Response(JSON.stringify(GrievanceError), {status:400});
        }

        const response = await deductMaterialFromInventory(data.material_wts, defective*-1);
        if (!response) {
            return new Response(JSON.stringify("Error adding defective materials back to inventory"), { status: 500 });
        }
    }

    // Automatically create QA record for this work order using service client (bypasses RLS)
    const adminClient = serviceClient();
    const { error: qaError } = await adminClient
        .from("QualityAssurance")
        .insert({
            work_order_id: body.work_order_id,
            inspector_name: "Awaiting Assignment",
            inspection_date: new Date().toISOString().split('T')[0],
            status: "pending",
            defects_found: 0,
            notes: "Auto-generated QA record after production completion"
        });

    if (qaError) {
        return new Response(JSON.stringify(qaError), {status: 400});
    }

    return Response.json("status updated");
}