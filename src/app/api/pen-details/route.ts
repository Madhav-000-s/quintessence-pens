import { supabase } from "@/supabase-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const penId = searchParams.get("pen_id");

  if (!penId) {
    return NextResponse.json(
      { error: "pen_id is required" },
      { status: 400 }
    );
  }

  try {
    // Fetch pen details with all related data
    const { data: penData, error: penError } = await supabase
      .from("Pen")
      .select(`
        pen_id,
        model,
        body_color,
        body_material,
        body_finish,
        trim_finish,
        nib_material,
        engraving_text,
        engraving_font,
        engraving_location
      `)
      .eq("pen_id", penId)
      .single();

    if (penError) {
      console.error("Error fetching pen details:", penError);
      return NextResponse.json(
        { error: "Failed to fetch pen details" },
        { status: 500 }
      );
    }

    if (!penData) {
      return NextResponse.json(
        { error: "Pen not found" },
        { status: 404 }
      );
    }

    // Transform to match PenConfiguration interface
    const penConfig = {
      model: penData.model || "zeus",
      bodyColor: penData.body_color || "#1a1a1a",
      bodyMaterial: penData.body_material || "resin",
      bodyFinish: penData.body_finish || "polished",
      trimFinish: penData.trim_finish || "silver",
      nibMaterial: penData.nib_material || "steel",
      engraving: penData.engraving_text ? {
        text: penData.engraving_text,
        font: penData.engraving_font || "script",
        location: penData.engraving_location || "barrel",
      } : undefined,
    };

    return NextResponse.json(penConfig);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
