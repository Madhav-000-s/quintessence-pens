import { supabase } from "@/supabase-client";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const vendorId = params.id;

  const { data, error } = await supabase
    .from("Vendors")
    .select(
      `
      *,
      address:vendor_address(*)
    `
    )
    .eq("id", vendorId)
    .single();

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  // Get vendor's purchase orders count and materials
  const { data: poData } = await supabase
    .from("PurchaseOrder")
    .select("id, name")
    .eq("vendor", vendorId);

  const { data: inventoryData } = await supabase
    .from("Inventory")
    .select("material_name")
    .eq("vendor", vendorId)
    .eq("isPen", false);

  const responseData = {
    ...data,
    purchase_orders_count: poData?.length || 0,
    materials_supplied: inventoryData?.map((item) => item.material_name) || [],
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
