import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase-client";
import type { BarrelConfigRequest, BarrelConfigResponse, ApiErrorResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body: BarrelConfigRequest = await request.json();

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

    // Step 3: Create or get Engraving
    const engraving = await createOrGetEngraving(body.engraving);
    if (!engraving) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create/get engraving" },
        { status: 500 }
      );
    }

    // Step 4: Create or get Coating
    const coating = await createOrGetCoating(body.coating);
    if (!coating) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create/get coating" },
        { status: 500 }
      );
    }

    // Step 5: Calculate total barrel cost
    const barrelCost =
      (material.cost || 0) +
      parseFloat(String(design.cost || 0)) +
      parseFloat(String(engraving.cost || 0));

    // Step 6: Create BarrelConfig
    const { data: barrelConfigData, error: barrelError } = await supabase
      .from("BarrelConfig")
      .insert({
        description: body.description,
        material_id: material.id,
        design_id: design.design_id,
        engraving_id: engraving.engraving_id,
        coating_id: coating.coating_id,
        grip_type: body.grip_type,
        shape: body.shape,
        cost: barrelCost,
      })
      .select()
      .single();

    if (barrelError || !barrelConfigData) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create barrel configuration", details: barrelError },
        { status: 500 }
      );
    }

    // Step 7: Build response with nested objects
    const response: BarrelConfigResponse = {
      barrel_id: barrelConfigData.barrel_id,
      description: barrelConfigData.description || "",
      shape: barrelConfigData.shape,
      cost: parseFloat(String(barrelConfigData.cost || 0)),
      grip_type: barrelConfigData.grip_type || "",
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
      engraving: {
        engraving_id: engraving.engraving_id,
        font: engraving.font || "",
        type_name: engraving.type_name || "",
        description: engraving.description || "",
        cost: parseFloat(String(engraving.cost || 0)),
      },
      coating: {
        coating_id: coating.coating_id,
        colour: coating.colour || "",
        hex_code: coating.hex_code || "",
        type: coating.type || "",
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in configure_barrel API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

// Helper functions to create or get existing records

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
      weight: 5,
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

async function createOrGetEngraving(engraving: { font: string; type_name: string; description: string }) {
  const { data: existing } = await supabase
    .from("Engravings")
    .select()
    .eq("type_name", engraving.type_name)
    .eq("description", engraving.description)
    .single();

  if (existing) return existing;

  const { data: newEngraving, error } = await supabase
    .from("Engravings")
    .insert({
      font: engraving.font,
      type_name: engraving.type_name,
      description: engraving.description,
      cost: engraving.type_name !== "None" ? 50 : 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating engraving:", error);
    return null;
  }

  return newEngraving;
}

async function createOrGetCoating(coating: { colour: string; hex_code: string; type: string }) {
  const { data: existing } = await supabase
    .from("Coating")
    .select()
    .eq("colour", coating.colour)
    .eq("type", coating.type)
    .single();

  if (existing) return existing;

  const { data: newCoating, error } = await supabase
    .from("Coating")
    .insert({
      colour: coating.colour,
      hex_code: coating.hex_code,
      type: coating.type,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating coating:", error);
    return null;
  }

  return newCoating;
}
