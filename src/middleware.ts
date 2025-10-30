import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Protect all /superadmin routes except /superadmin/login
  if (pathname.startsWith("/superadmin") && !pathname.startsWith("/superadmin/login")) {
    // Check session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // No session, redirect to login
      const url = new URL("/superadmin/login", request.url);
      return NextResponse.redirect(url);
    }

    // Check if user is a superadmin
    const { data: superadmin, error } = await supabase
      .from("Superadmins")
      .select("is_active")
      .eq("user_id", session.user.id)
      .single();

    if (error || !superadmin || !superadmin.is_active) {
      // Not a superadmin or inactive, sign out and redirect
      await supabase.auth.signOut();
      const url = new URL("/superadmin/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: "/superadmin/:path*",
};
