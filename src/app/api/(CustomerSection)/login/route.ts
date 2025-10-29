// import { supabase } from "@/supabase-client";
import { serverClient } from '@/supabase-client';
import jwt from 'jsonwebtoken'
import { serialize } from "cookie";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
    const { email, password } = await request.json();
    const supabase = await serverClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return new Response(JSON.stringify({ error }), { status: 401 });
    }

    return NextResponse.json({ message: "Login successful" }, { status: 200 });

}
