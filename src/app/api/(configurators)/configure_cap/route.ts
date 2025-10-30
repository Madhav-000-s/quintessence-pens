import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/supabase-client";
import type { CapConfigRequest, CapConfigResponse, ApiErrorResponse } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body: CapConfigRequest = await request.json();

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

    // Step 5: Create ClipDesign with nested objects
    const clipMaterial = await createOrGetMaterial(body.clip_design.material);
    const clipDesign = await createOrGetDesign(body.clip_design.design);
    const clipEngraving = await createOrGetEngraving(body.clip_design.engraving);

    if (!clipMaterial || !clipDesign || !clipEngraving) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create/get clip design components" },
        { status: 500 }
      );
    }

    const clipCost = (clipMaterial.cost || 0) + parseFloat(String(clipDesign.cost || 0)) + parseFloat(String(clipEngraving.cost || 0));

    const { data: clipDesignData, error: clipError } = await supabase
      .from("ClipDesign")
      .insert({
        description: body.clip_design.description,
        material: clipMaterial.id,
        design: clipDesign.design_id,
        engraving: clipEngraving.engraving_id,
        cost: clipCost,
      })
      .select()
      .single();

    if (clipError || !clipDesignData) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create clip design", details: clipError },
        { status: 500 }
      );
    }

    // Step 6: Calculate total cap cost
    const capCost =
      (material.cost || 0) +
      parseFloat(String(design.cost || 0)) +
      parseFloat(String(engraving.cost || 0)) +
      clipCost;

    // Step 7: Create CapConfig
    const { data: capConfigData, error: capError } = await supabase
      .from("CapConfig")
      .insert({
        description: body.description,
        material_id: material.id,
        design_id: design.design_id,
        engraving_id: engraving.engraving_id,
        coating_id: coating.coating_id,
        clip_design: clipDesignData.id,
        cost: capCost,
      })
      .select()
      .single();

    if (capError || !capConfigData) {
      return NextResponse.json<ApiErrorResponse>(
        { error: "Failed to create cap configuration", details: capError },
        { status: 500 }
      );
    }

    // Step 8: Build response with nested objects
    const response: CapConfigResponse = {
      cap_type_id: capConfigData.cap_type_id,
      description: capConfigData.description || "",
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
      clip_design: {
        id: clipDesignData.id,
        created_at: clipDesignData.created_at,
        description: clipDesignData.description || "",
        material: {
          id: clipMaterial.id,
          created_at: clipMaterial.created_at,
          name: clipMaterial.name || "",
          weight: clipMaterial.weight || 0,
          cost: clipMaterial.cost || 0,
        },
        design: {
          design_id: clipDesign.design_id,
          description: clipDesign.description || "",
          font: clipDesign.font || "",
          cost: parseFloat(String(clipDesign.cost || 0)),
          colour: clipDesign.colour || "",
          hex_code: clipDesign.hex_code || "",
        },
        engraving: {
          engraving_id: clipEngraving.engraving_id,
          font: clipEngraving.font || "",
          type_name: clipEngraving.type_name || "",
          description: clipEngraving.description || "",
          cost: parseFloat(String(clipEngraving.cost || 0)),
        },
        cost: clipCost,
      },
      coating: {
        coating_id: coating.coating_id,
        colour: coating.colour || "",
        hex_code: coating.hex_code || "",
        type: coating.type || "",
      },
      cost: capCost,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in configure_cap API:", error);
    return NextResponse.json<ApiErrorResponse>(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

// Helper functions to create or get existing records

async function createOrGetMaterial(name: string) {
  // Check if material exists
  const { data: existing } = await supabase
    .from("Material")
    .select()
    .eq("name", name)
    .single();

  if (existing) return existing;

  // Create new material with default values
  const { data: newMaterial, error } = await supabase
    .from("Material")
    .insert({
      name,
      weight: 5, // Default weight
      cost: 0, // Default cost
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
  // Check if design exists
  const { data: existing } = await supabase
    .from("Design")
    .select()
    .eq("description", design.description)
    .eq("colour", design.colour)
    .single();

  if (existing) return existing;

  // Create new design
  const { data: newDesign, error } = await supabase
    .from("Design")
    .insert({
      description: design.description,
      font: design.font,
      colour: design.colour,
      hex_code: design.hex_code,
      cost: 0, // Default cost
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
  // Check if engraving exists
  const { data: existing } = await supabase
    .from("Engravings")
    .select()
    .eq("type_name", engraving.type_name)
    .eq("description", engraving.description)
    .single();

  if (existing) return existing;

  // Create new engraving
  const { data: newEngraving, error } = await supabase
    .from("Engravings")
    .insert({
      font: engraving.font,
      type_name: engraving.type_name,
      description: engraving.description,
      cost: engraving.type_name !== "None" ? 50 : 0, // Default cost for engraving
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
  // Check if coating exists
  const { data: existing } = await supabase
    .from("Coating")
    .select()
    .eq("colour", coating.colour)
    .eq("type", coating.type)
    .single();

  if (existing) return existing;

  // Create new coating
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
