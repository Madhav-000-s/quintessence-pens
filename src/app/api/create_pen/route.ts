import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase-client";
import type { CreatePenRequest, CreatePenResponse, ApiErrorResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body: CreatePenRequest = await request.json();

    // Step 1: Fetch costs from all configuration records
    const [capConfig, barrelConfig, nibConfig, inkConfig] = await Promise.all([
      supabase.from("CapConfig").select("cost").eq("cap_type_id", body.cap_type_id).single(),
      supabase.from("BarrelConfig").select("cost").eq("barrel_id", body.barrel_id).single(),
      supabase.from("NibConfig").select("cost").eq("nibtype_id", body.nibtype_id).single(),
      supabase.from("InkConfig").select("cost").eq("ink_type_id", body.ink_type_id).single(),
    ]);

    if (capConfig.error || barrelConfig.error || nibConfig.error || inkConfig.error) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to fetch configuration costs" },
        { status: 500 }
      );
    }

    // Step 2: Calculate total pen cost
    const totalCost =
      parseFloat(String(capConfig.data?.cost || 0)) +
      parseFloat(String(barrelConfig.data?.cost || 0)) +
      parseFloat(String(nibConfig.data?.cost || 0)) +
      parseFloat(String(inkConfig.data?.cost || 0));

    // Step 3: Create Pen record
    const { data: penData, error: penError } = await supabase
      .from("Pen")
      .insert({
        pentype: body.pentype,
        nibtype_id: body.nibtype_id,
        ink_type_id: body.ink_type_id,
        cap_type_id: body.cap_type_id,
        barrel_id: body.barrel_id,
        cost: totalCost,
      })
      .select()
      .single();

    if (penError || !penData) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create pen", details: penError },
        { status: 500 }
      );
    }

    // Step 4: Build response
    const response: CreatePenResponse = {
      pen_id: penData.pen_id,
      pentype: penData.pentype || "",
      nibtype_id: penData.nibtype_id,
      ink_type_id: penData.ink_type_id,
      cap_type_id: penData.cap_type_id,
      barrel_id: penData.barrel_id,
      cost: parseFloat(String(penData.cost || 0)),
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in create_pen API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
