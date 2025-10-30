import { supabase } from "@/supabase-client";

export async function GET() {
  const { data, error } = await supabase
    .from("Vendors")
    .select(`
      *,
      address:vendor_address(*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  // First create the address if provided
  let addressId = null;
  if (body.address) {
    const { data: addressData, error: addressError } = await supabase
      .from("Address")
      .insert({
        state: body.address.state,
        city: body.address.city,
        pincode: body.address.pincode,
        address_line: body.address.address_line,
      })
      .select()
      .single();

    if (addressError) {
      return new Response(JSON.stringify(addressError), { status: 400 });
    }

    addressId = addressData.id;
  }

  // Create the vendor
  const { data, error } = await supabase
    .from("Vendors")
    .insert({
      vendor_name: body.vendor_name,
      vendor_email: body.vendor_email,
      vendor_phone: body.vendor_phone,
      vendor_address: addressId,
    })
    .select(
      `
      *,
      address:vendor_address(*)
    `
    )
    .single();

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return Response.json(
    { message: "Vendor created successfully", data: data },
    { status: 201 }
  );
}

export async function PUT(request: Request) {
  const body = await request.json();
  const vendorId = body.id;

  if (!vendorId) {
    return new Response(JSON.stringify({ error: "Vendor ID is required" }), {
      status: 400,
    });
  }

  // Update address if provided
  if (body.address && body.vendor_address_id) {
    const { error: addressError } = await supabase
      .from("Address")
      .update({
        state: body.address.state,
        city: body.address.city,
        pincode: body.address.pincode,
        address_line: body.address.address_line,
      })
      .eq("id", body.vendor_address_id);

    if (addressError) {
      return new Response(JSON.stringify(addressError), { status: 400 });
    }
  }

  // Update vendor
  const { data, error } = await supabase
    .from("Vendors")
    .update({
      vendor_name: body.vendor_name,
      vendor_email: body.vendor_email,
      vendor_phone: body.vendor_phone,
    })
    .eq("id", vendorId)
    .select(
      `
      *,
      address:vendor_address(*)
    `
    )
    .single();

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return Response.json(
    { message: "Vendor updated successfully", data: data },
    { status: 200 }
  );
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const vendorId = body.id;

  if (!vendorId) {
    return new Response(JSON.stringify({ error: "Vendor ID is required" }), {
      status: 400,
    });
  }

  // Check if vendor has any purchase orders
  const { data: poData } = await supabase
    .from("PurchaseOrder")
    .select("id")
    .eq("vendor", vendorId)
    .limit(1);

  if (poData && poData.length > 0) {
    return new Response(
      JSON.stringify({
        error: "Cannot delete vendor with existing purchase orders",
      }),
      { status: 400 }
    );
  }

  const { error } = await supabase.from("Vendors").delete().eq("id", vendorId);

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return Response.json({ message: "Vendor deleted successfully" }, { status: 200 });
}
