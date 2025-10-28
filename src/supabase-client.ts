import { createClient } from "@supabase/supabase-js";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(
    supabaseURL, supabaseAnonKey
);

export const serverClient = async () => {
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