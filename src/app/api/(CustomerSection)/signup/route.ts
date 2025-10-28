import { serverClient } from "@/supabase-client";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const body = await request.json();
    const requestUrl = new URL(request.url);
    const supabase = await serverClient();
    const emailRedirectTo = `${requestUrl.origin}/api/signup/confirm`;

    const { data: { user }, error } = await supabase.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
            emailRedirectTo: emailRedirectTo,
            data: {
                display_name: body.display_name,
                phone: body.phone || null,
                first_name: body.firstname || null,
                last_name: body.lastname || null,
            }
    }});

    if (error) {
        return new Response(JSON.stringify({ error }), { status: 400 });
    }


    return NextResponse.json({ message: "Signup successful! Please check your email to confirm." }, 
        { status: 200 });
}