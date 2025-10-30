import { serverClient, serviceClient } from "@/supabase-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: "Email and password are required" } },
        { status: 400 }
      );
    }

    const supabase = await serverClient();
    const supabaseService = serviceClient(); // Service role bypasses RLS

    // Attempt to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      return NextResponse.json(
        { error: { message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    // Verify user is a superadmin using service role (bypasses RLS)
    const { data: superadmin, error: superadminError } = await supabaseService
      .from("Superadmins")
      .select("*")
      .eq("user_id", authData.user.id)
      .single();

    if (superadminError || !superadmin) {
      // User exists but is not a superadmin, sign them out
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: { message: "Unauthorized: Not a superadmin" } },
        { status: 403 }
      );
    }

    if (!superadmin.is_active) {
      // Superadmin is inactive
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: { message: "Account is inactive" } },
        { status: 403 }
      );
    }

    // Update last login timestamp using service role
    await supabaseService
      .from("Superadmins")
      .update({ last_login: new Date().toISOString() })
      .eq("id", superadmin.id);

    return NextResponse.json({
      message: "Login successful",
      user: superadmin,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: { message: "An error occurred during login" } },
      { status: 500 }
    );
  }
}
