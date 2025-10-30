import { supabase } from "@/supabase-client"

export async function GET(request: Request) {
    const { data, error } = await supabase
        .from("Inventory")
        .select("*");
    
    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}