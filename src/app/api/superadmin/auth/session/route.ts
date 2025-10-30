import { serverClient, serviceClient } from "@/supabase-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await serverClient();
    const supabaseService = serviceClient(); // Service role bypasses RLS

    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json(
        { isAuthenticated: false, error: "No active session" },
        { status: 401 }
      );
    }

    // Check if user is a superadmin using service role
    const { data: superadmin, error: superadminError } = await supabaseService
      .from("Superadmins")
      .select("*")
      .eq("user_id", session.user.id)
      .single();

    if (superadminError || !superadmin) {
      return NextResponse.json(
        { isAuthenticated: false, error: "Not a superadmin" },
        { status: 403 }
      );
    }

    if (!superadmin.is_active) {
      return NextResponse.json(
        { isAuthenticated: false, error: "Account is inactive" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: superadmin,
    });
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { isAuthenticated: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}
