import { supabase } from "@/supabase-client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const transactionId = params.id;

  const { data, error} = await supabase
    .from("Transactions")
    .select("*")
    .eq("id", transactionId)
    .single();

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  // Fetch related customer or vendor details if available
  let relatedData = { ...data };

  if (data.customer_id) {
    const { data: customerData } = await supabase
      .from("Customers")
      .select("id, first_name, last_name, email")
      .eq("id", data.customer_id)
      .single();

    if (customerData) {
      relatedData = {
        ...relatedData,
        customer_name: `${customerData.first_name} ${customerData.last_name}`,
        customer_email: customerData.email,
      };
    }
  }

  if (data.vendor_id) {
    const { data: vendorData } = await supabase
      .from("Vendors")
      .select("id, vendor_name, vendor_email")
      .eq("id", data.vendor_id)
      .single();

    if (vendorData) {
      relatedData = {
        ...relatedData,
        vendor_name: vendorData.vendor_name,
        vendor_email: vendorData.vendor_email,
      };
    }
  }

  return new Response(JSON.stringify(relatedData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
