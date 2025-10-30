import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabase = createClient(
    supabaseURL, supabaseAnonKey
);

export const serverClient = async () => {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return createServerClient(supabaseURL, supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options?: CookieOptions) {
                cookieStore.set({ name, value, ...options });
            },
            remove(name: string, options?: CookieOptions) {
                cookieStore.set({ name, value: '', ...options });
            }
        }
    });
}

// Service role client - bypasses RLS, use ONLY for admin operations
export const serviceClient = () => {
    return createClient(supabaseURL, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}