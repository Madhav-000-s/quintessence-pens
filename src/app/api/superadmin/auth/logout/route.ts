import { serverClient } from "@/supabase-client";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabase = await serverClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: { message: "Failed to logout" } },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: { message: "An error occurred during logout" } },
      { status: 500 }
    );
  }
}
