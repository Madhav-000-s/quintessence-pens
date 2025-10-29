import { serverClient } from "@/supabase-client";
import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as EmailOtpType | null;
    const next = searchParams.get('next') ?? '/';

    const supabase = await serverClient();

    if(token_hash && type) {
        console.log("here 1");
        const { data, error } = await supabase.auth.verifyOtp({
            type:type,
            token_hash:token_hash,
        });

        if (!error) {
            console.log("here 2");
            const user = data.user!;
            const { error: customerError } = await supabase
                .from('Customers')
                .insert({ 
                    email: user.email!,
                    phone: user.user_metadata.phone || null,
                    first_name: user.user_metadata.first_name || null,
                    last_name: user.user_metadata.last_name || null,
                    isBusiness: user.user_metadata.isBusiness || false,
                    user: user.id,
                })
            
            if (customerError) {
                return NextResponse.json({ error: customerError }, { status: 400 });
            }

            return NextResponse.redirect(new URL('/'));
        }
    }
        console.log("here 3");
    const errorUrl = new URL('/auth-error', request.url);
    errorUrl.searchParams.set('message', 'Invalid or expired confirmation link.');
    return NextResponse.redirect(errorUrl);
}