import { supabase } from "@/supabase-client";
import { getMaterialsBelowThreshold } from "@/app/lib/productionFunctions";

export async function GET(request: Request) {
    const { data, error } = await supabase
        .from("Inventory")
        .select("*")
        .eq("isPen", false);

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    const finalData = {
        allMaterials: data,
        lowStockMaterials: await getMaterialsBelowThreshold()
    }
    return new Response(JSON.stringify(finalData), { status: 200, headers: { "Content-Type": "application/json" } });
}