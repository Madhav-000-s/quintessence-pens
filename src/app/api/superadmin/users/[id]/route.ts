import { serviceClient } from "@/supabase-client";
import { verifySuperadminAccess } from "@/lib/auth/superadmin";
import { NextResponse } from "next/server";

// PATCH - Update superadmin
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify caller is a superadmin
    const caller = await verifySuperadminAccess();
    if (!caller) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 403 }
      );
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: { message: "Invalid ID" } },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { is_active, full_name } = body;

    const supabaseService = serviceClient(); // Use service role to bypass RLS

    // Get the target superadmin
    const { data: targetAdmin, error: fetchError } = await supabaseService
      .from("Superadmins")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !targetAdmin) {
      return NextResponse.json(
        { error: { message: "Superadmin not found" } },
        { status: 404 }
      );
    }

    // Prevent deactivating yourself
    if (
      typeof is_active === "boolean" &&
      !is_active &&
      targetAdmin.user_id === caller.user_id
    ) {
      return NextResponse.json(
        { error: { message: "Cannot deactivate your own account" } },
        { status: 400 }
      );
    }

    // Prevent deactivating the last active superadmin
    if (typeof is_active === "boolean" && !is_active && targetAdmin.is_active) {
      const { count } = await supabaseService
        .from("Superadmins")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      if (count === 1) {
        return NextResponse.json(
          { error: { message: "Cannot deactivate the last active superadmin" } },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updates: any = {};
    if (typeof is_active === "boolean") {
      updates.is_active = is_active;
    }
    if (full_name !== undefined) {
      updates.full_name = full_name || null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: { message: "No valid fields to update" } },
        { status: 400 }
      );
    }

    // Update the record using service role
    const { data: updated, error: updateError } = await supabaseService
      .from("Superadmins")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: { message: "Failed to update superadmin" } },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Update superadmin error:", error);
    return NextResponse.json(
      { error: { message: "An error occurred" } },
      { status: 500 }
    );
  }
}
