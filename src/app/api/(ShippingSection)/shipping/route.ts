import { serviceClient } from "@/supabase-client";
import { NextRequest } from "next/server";

// Get all shipping records (bypasses RLS for superadmin access)
export async function GET(request: NextRequest) {
    const adminClient = serviceClient();

    const { data, error } = await adminClient
        .from("Shipping")
        .select(`
          *,
          customer_details:Customers!Shipping_customer_fkey(first_name, last_name, email, phone),
          pen_details:Pen!Shipping_pen_fkey(pentype, cost)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
