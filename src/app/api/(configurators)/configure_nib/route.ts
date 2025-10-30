import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase-client";
import type { NibConfigRequest, NibConfigResponse, ApiErrorResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body: NibConfigRequest = await request.json();

    // Step 1: Create or get Material
    const material = await createOrGetMaterial(body.material.name);
    if (!material) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create/get material" },
        { status: 500 }
      );
    }

    // Step 2: Create or get Design
    const design = await createOrGetDesign(body.design);
    if (!design) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create/get design" },
        { status: 500 }
      );
    }

    // Step 3: Calculate total nib cost
    const nibCost = (material.cost || 0) + parseFloat(String(design.cost || 0));

    // Step 4: Create NibConfig
    const { data: nibConfigData, error: nibError } = await supabase
      .from("NibConfig")
      .insert({
        description: body.description,
        size: body.size,
        material_id: material.id,
        design_id: design.design_id,
        cost: nibCost,
      })
      .select()
      .single();

    if (nibError || !nibConfigData) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create nib configuration", details: nibError },
        { status: 500 }
      );
    }

    // Step 5: Build response with nested objects
    const response: NibConfigResponse = {
      nib_id: nibConfigData.nibtype_id,
      description: nibConfigData.description || "",
      size: nibConfigData.size || "",
      cost: parseFloat(String(nibConfigData.cost || 0)),
      material: {
        id: material.id,
        created_at: material.created_at,
        name: material.name || "",
        weight: material.weight || 0,
        cost: material.cost || 0,
      },
      design: {
        design_id: design.design_id,
        description: design.description || "",
        font: design.font || "",
        cost: parseFloat(String(design.cost || 0)),
        colour: design.colour || "",
        hex_code: design.hex_code || "",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in configure_nib API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

// Helper functions

async function createOrGetMaterial(name: string) {
  const { data: existing } = await supabase
    .from("Material")
    .select()
    .eq("name", name)
    .single();

  if (existing) return existing;

  const { data: newMaterial, error } = await supabase
    .from("Material")
    .insert({
      name,
      weight: 2,
      cost: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating material:", error);
    return null;
  }

  return newMaterial;
}

async function createOrGetDesign(design: { description: string; font: string; colour: string; hex_code: string }) {
  const { data: existing } = await supabase
    .from("Design")
    .select()
    .eq("description", design.description)
    .eq("colour", design.colour)
    .single();

  if (existing) return existing;

  const { data: newDesign, error } = await supabase
    .from("Design")
    .insert({
      description: design.description,
      font: design.font,
      colour: design.colour,
      hex_code: design.hex_code,
      cost: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating design:", error);
    return null;
  }

  return newDesign;
}
