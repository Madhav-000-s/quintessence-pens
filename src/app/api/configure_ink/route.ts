import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase-client";
import type { InkConfigRequest, InkConfigResponse, ApiErrorResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body: InkConfigRequest = await request.json();

    // Create InkConfig
    const { data: inkConfigData, error: inkError } = await supabase
      .from("InkConfig")
      .insert({
        type_name: body.type_name,
        description: body.description,
        color_name: body.colour,
        hexcode: body.hex_code,
        cost: 10, // Default ink cost
      })
      .select()
      .single();

    if (inkError || !inkConfigData) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create ink configuration", details: inkError },
        { status: 500 }
      );
    }

    // Build response
    const response: InkConfigResponse = {
      ink_type_id: inkConfigData.ink_type_id,
      type_name: inkConfigData.type_name,
      description: inkConfigData.description || "",
      cost: parseFloat(String(inkConfigData.cost || 0)),
      hexcode: inkConfigData.hexcode || "",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in configure_ink API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
