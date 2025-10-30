import { supabase } from "@/supabase-client";
import type { TransactionFormData } from "@/types/accounts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Get filter parameters
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");
  const transactionType = searchParams.get("transaction_type");
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const customerId = searchParams.get("customer_id");
  const vendorId = searchParams.get("vendor_id");
  const search = searchParams.get("search");
  const limit = searchParams.get("limit") || "50";

  let query = supabase
    .from("Transactions")
    .select("*")
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(parseInt(limit, 10));

  // Apply filters
  if (startDate) {
    query = query.gte("transaction_date", startDate);
  }
  if (endDate) {
    query = query.lte("transaction_date", endDate);
  }
  if (transactionType) {
    query = query.eq("transaction_type", transactionType);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (customerId) {
    query = query.eq("customer_id", parseInt(customerId, 10));
  }
  if (vendorId) {
    query = query.eq("vendor_id", parseInt(vendorId, 10));
  }
  if (search) {
    query = query.or(`description.ilike.%${search}%,notes.ilike.%${search}%`);
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
  const body: TransactionFormData = await request.json();

  // Validate required fields
  if (!body.transaction_date || !body.transaction_type || !body.category || !body.amount) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: transaction_date, transaction_type, category, amount" }),
      { status: 400 }
    );
  }

  // Validate amount
  if (body.amount < 0) {
    return new Response(JSON.stringify({ error: "Amount must be positive" }), { status: 400 });
  }

  const { data, error } = await supabase
    .from("Transactions")
    .insert({
      transaction_date: body.transaction_date,
      transaction_type: body.transaction_type,
      category: body.category,
      amount: body.amount,
      description: body.description || null,
      reference_id: body.reference_id || null,
      reference_type: body.reference_type || null,
      payment_method: body.payment_method || null,
      customer_id: body.customer_id || null,
      vendor_id: body.vendor_id || null,
      status: body.status || "completed",
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return Response.json(
    { message: "Transaction created successfully", data: data },
    { status: 201 }
  );
}

export async function PUT(request: Request) {
  const body = await request.json();
  const transactionId = body.id;

  if (!transactionId) {
    return new Response(JSON.stringify({ error: "Transaction ID is required" }), {
      status: 400,
    });
  }

  // Remove id from update object
  const { id, created_at, ...updateData } = body;

  const { data, error } = await supabase
    .from("Transactions")
    .update(updateData)
    .eq("id", transactionId)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return Response.json(
    { message: "Transaction updated successfully", data: data },
    { status: 200 }
  );
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const transactionId = body.id;

  if (!transactionId) {
    return new Response(JSON.stringify({ error: "Transaction ID is required" }), {
      status: 400,
    });
  }

  // Soft delete by setting status to cancelled instead of hard delete
  const { data, error } = await supabase
    .from("Transactions")
    .update({ status: "cancelled" })
    .eq("id", transactionId)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  return Response.json(
    { message: "Transaction cancelled successfully", data: data },
    { status: 200 }
  );
}
