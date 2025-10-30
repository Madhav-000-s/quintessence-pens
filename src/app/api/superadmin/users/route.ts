import { serverClient, serviceClient } from "@/supabase-client";
import { verifySuperadminAccess, generateSecurePassword } from "@/lib/auth/superadmin";
import { NextResponse } from "next/server";
import type { CreateSuperadminRequest } from "@/types/superadmin";

// GET - List all superadmins
export async function GET() {
  try {
    // Verify caller is a superadmin
    const caller = await verifySuperadminAccess();
    if (!caller) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 403 }
      );
    }

    const supabaseService = serviceClient(); // Use service role to bypass RLS

    // Get all superadmins
    const { data: superadmins, error } = await supabaseService
      .from("Superadmins")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch superadmins error:", error);
      return NextResponse.json(
        { error: { message: "Failed to fetch superadmins" } },
        { status: 500 }
      );
    }

    // Get creator information separately for each superadmin
    const enrichedData = await Promise.all(
      (superadmins || []).map(async (admin: any) => {
        if (admin.created_by) {
          const { data: creator } = await supabaseService
            .from("Superadmins")
            .select("email, full_name")
            .eq("user_id", admin.created_by)
            .single();

          return {
            ...admin,
            creator_email: creator?.email || null,
            creator_name: creator?.full_name || null,
          };
        }
        return {
          ...admin,
          creator_email: null,
          creator_name: null,
        };
      })
    );

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error("List superadmins error:", error);
    return NextResponse.json(
      { error: { message: "An error occurred" } },
      { status: 500 }
    );
  }
}

// POST - Create new superadmin
export async function POST(request: Request) {
  try {
    // Verify caller is a superadmin
    const caller = await verifySuperadminAccess();
    if (!caller) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 403 }
      );
    }

    const body: CreateSuperadminRequest = await request.json();
    const { email, full_name, password } = body;

    if (!email) {
      return NextResponse.json(
        { error: { message: "Email is required" } },
        { status: 400 }
      );
    }

    const supabaseService = serviceClient(); // Use service role for all operations

    // Generate password if not provided
    const finalPassword = password || generateSecurePassword();

    // Check if email already exists using service role
    const { data: existing } = await supabaseService
      .from("Superadmins")
      .select("email")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: { message: "Email already exists" } },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth using service role
    const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
      email,
      password: finalPassword,
      email_confirm: true, // Auto-confirm email
    });

    if (authError || !authData.user) {
      console.error("Auth create error:", authError);
      return NextResponse.json(
        { error: { message: authError?.message || "Failed to create user" } },
        { status: 500 }
      );
    }

    // Create superadmin record using service role
    const { data: superadmin, error: superadminError } = await supabaseService
      .from("Superadmins")
      .insert({
        user_id: authData.user.id,
        email,
        full_name: full_name || null,
        is_active: true,
        created_by: caller.user_id,
      })
      .select()
      .single();

    if (superadminError) {
      // Rollback: delete the auth user using service role
      await supabaseService.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: { message: "Failed to create superadmin record" } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user: superadmin,
      temporary_password: finalPassword,
    }, { status: 201 });
  } catch (error) {
    console.error("Create superadmin error:", error);
    return NextResponse.json(
      { error: { message: "An error occurred" } },
      { status: 500 }
    );
  }
}
