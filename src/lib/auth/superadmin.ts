import { serverClient, serviceClient } from "@/supabase-client";
import type { Superadmin } from "@/types/superadmin";

/**
 * Verify if a user is an active superadmin
 */
export async function isSuperadmin(userId: string): Promise<boolean> {
  const supabaseService = serviceClient(); // Use service role to bypass RLS

  const { data, error } = await supabaseService
    .from("Superadmins")
    .select("is_active")
    .eq("user_id", userId)
    .single();

  if (error || !data) return false;
  return data.is_active;
}

/**
 * Get superadmin record by user ID
 */
export async function getSuperadmin(userId: string): Promise<Superadmin | null> {
  const supabaseService = serviceClient(); // Use service role to bypass RLS

  const { data, error } = await supabaseService
    .from("Superadmins")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Verify superadmin access from request
 * Returns superadmin data if valid, null otherwise
 */
export async function verifySuperadminAccess(): Promise<Superadmin | null> {
  const supabase = await serverClient();

  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return null;
  }

  // Check if user is superadmin using service role
  const superadmin = await getSuperadmin(session.user.id);

  if (!superadmin || !superadmin.is_active) {
    return null;
  }

  return superadmin;
}

/**
 * Generate a secure random password
 */
export function generateSecurePassword(length: number = 16): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  // Ensure at least one of each type
  password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  password += "0123456789"[Math.floor(Math.random() * 10)];
  password += "!@#$%^&*"[Math.floor(Math.random() * 8)];

  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}
