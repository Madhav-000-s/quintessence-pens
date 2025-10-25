import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase-client";
import type { AddToCartRequest, CartItemResponse, UpdateCartRequest, ApiErrorResponse } from "@/types/api";

// GET: Fetch cart items for a customer
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get("customer_id");

    if (!customerId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "customer_id query parameter is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("Cart")
      .select("*")
      .eq("customer", parseInt(customerId))
      .eq("isActive", true);

    if (error) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to fetch cart items", details: error },
        { status: 500 }
      );
    }

    const cartItems: CartItemResponse[] = data.map((item) => ({
      id: item.id,
      created_at: item.created_at,
      total_price: item.total_price || 0,
      isActive: item.isActive,
      customer: item.customer,
      pen: item.pen,
      count: item.count || 1,
    }));

    return NextResponse.json(cartItems, { status: 200 });
  } catch (error) {
    console.error("Error in GET cart API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

// POST: Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body: AddToCartRequest = await request.json();

    const { data, error } = await supabase
      .from("Cart")
      .insert({
        customer: body.customer,
        pen: body.pen,
        count: body.count,
        total_price: body.total_price,
        isActive: body.isActive !== undefined ? body.isActive : true,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to add item to cart", details: error },
        { status: 500 }
      );
    }

    const cartItem: CartItemResponse = {
      id: data.id,
      created_at: data.created_at,
      total_price: data.total_price || 0,
      isActive: data.isActive,
      customer: data.customer,
      pen: data.pen,
      count: data.count || 1,
    };

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Error in POST cart API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

// PUT: Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body: UpdateCartRequest = await request.json();

    const { data, error } = await supabase
      .from("Cart")
      .update({ count: body.count })
      .eq("id", body.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to update cart item", details: error },
        { status: 500 }
      );
    }

    const cartItem: CartItemResponse = {
      id: data.id,
      created_at: data.created_at,
      total_price: data.total_price || 0,
      isActive: data.isActive,
      customer: data.customer,
      pen: data.pen,
      count: data.count || 1,
    };

    return NextResponse.json(cartItem, { status: 200 });
  } catch (error) {
    console.error("Error in PUT cart API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

// DELETE: Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cartId = searchParams.get("id");

    if (!cartId) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "id query parameter is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("Cart")
      .delete()
      .eq("id", parseInt(cartId));

    if (error) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to delete cart item", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in DELETE cart API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
