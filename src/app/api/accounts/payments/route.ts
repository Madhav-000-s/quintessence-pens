import { supabase } from "@/supabase-client";
import type { PaymentRecord } from "@/types/accounts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "50";
  const customerId = searchParams.get("customer_id");
  const vendorId = searchParams.get("vendor_id");

  let query = supabase
    .from("Transactions")
    .select("*")
    .in("transaction_type", ["payment_received", "payment_made"])
    .order("transaction_date", { ascending: false })
    .limit(parseInt(limit, 10));

  if (customerId) {
    query = query.eq("customer_id", parseInt(customerId, 10));
  }
  if (vendorId) {
    query = query.eq("vendor_id", parseInt(vendorId, 10));
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const body: PaymentRecord = await request.json();

  // Validate required fields
  if (!body.amount || !body.payment_method || !body.transaction_date) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: amount, payment_method, transaction_date" }),
      { status: 400 }
    );
  }

  // Determine transaction type based on customer or vendor
  const transactionType = body.customer_id ? "payment_received" : body.vendor_id ? "payment_made" : null;

  if (!transactionType) {
    return new Response(
      JSON.stringify({ error: "Either customer_id or vendor_id must be provided" }),
      { status: 400 }
    );
  }

  // Determine category based on reference type
  let category = "other";
  let description = "";

  if (body.reference_type === "work_order") {
    category = "sales";
    description = `Payment received for Work Order #${body.reference_id}`;
  } else if (body.reference_type === "purchase_order") {
    category = "purchase_order";
    description = `Payment made for Purchase Order #${body.reference_id}`;
  } else if (body.reference_type === "invoice") {
    category = "sales";
    description = `Payment received for Invoice #${body.reference_id}`;
  }

  const { data: transaction, error: transactionError } = await supabase
    .from("Transactions")
    .insert({
      transaction_date: body.transaction_date,
      transaction_type: transactionType,
      category: category,
      amount: body.amount,
      description: description,
      reference_id: body.reference_id || null,
      reference_type: body.reference_type,
      payment_method: body.payment_method,
      customer_id: body.customer_id || null,
      vendor_id: body.vendor_id || null,
      status: "completed",
      notes: body.notes || null,
    })
    .select()
    .single();

  if (transactionError) {
    return new Response(JSON.stringify(transactionError), { status: 400 });
  }

  // If this is a payment for a work order, update the isPaid status
  if (body.reference_type === "work_order" && body.reference_id) {
    await supabase
      .from("WorkOrder")
      .update({ isPaid: true })
      .eq("id", body.reference_id);
  }

  return Response.json(
    { message: "Payment recorded successfully", data: transaction },
    { status: 201 }
  );
}
