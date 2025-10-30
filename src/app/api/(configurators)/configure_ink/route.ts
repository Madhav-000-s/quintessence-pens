import { supabase } from "@/supabase-client";
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { extractInkDetails } from "@/app/lib/configuratorFunctions";

const JWT_SECRET = process.env.JWT_SECRET;

export type Payload = {
    penId: number;
}

export async function POST(request:NextRequest) {
    const body = await request.json();
    if(!body) {
        return new Response(JSON.stringify("NO DATA SENT"),{
            headers: {"Content-Type": "application/json"},
            status: 400
        });
    }

    const { data:InkData, error:InkError } = await supabase
        .from("InkConfig")
        .insert({
            description: body.description,
            type_name: body.type_name,
            color_name: body.colour,
            hexcode: body.hex_code,
            cost: 1000
        }) 
        .select("ink_type_id, cost");
    
    if(InkError){
        return new Response(JSON.stringify(InkError));
    }

    const tokenCookie = request.cookies.get("pen");
    if(tokenCookie) {
        const decoded = jwt.verify(tokenCookie.value, JWT_SECRET!) as Payload; 
        if(!decoded) {
            return new Response(JSON.stringify("Unable to decode cookie"), {status: 400});
        }
        const {data: penData, error: penError} = await supabase
            .rpc('update_ink_details', {
                new_ink_id: InkData[0].ink_type_id,
                amount_to_add: InkData[0].cost,
                row_id: decoded.penId
            })
        
        if(penError) {
            return new Response(JSON.stringify(penError));
        }

        return Response.json("Pen updated successfully");
    }

    else {
        const result = await supabase
        .from("Pen")
        .insert({
            ink_type_id: InkData[0].ink_type_id,
            cost: InkData[0].cost,
        })
        .select("pen_id");

        if(!result.error) {
            const encoded = jwt.sign({penId: result.data[0].pen_id}, JWT_SECRET!, {"expiresIn": '48h'});
            const serializedCookie = serialize("pen", encoded, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: '/',
                maxAge: 60 * 60 * 24 * 2
            })
            return new NextResponse(JSON.stringify("New pen created with Ink"), {
                headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": serializedCookie
                },
                status: 201
            })
        }
        return new Response(JSON.stringify(result.error), {status: 400});
    }
}


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pen_Id = searchParams.get("pen_id");
    
    const tokenCookie = request.cookies.get("pen");
    if(tokenCookie && !pen_Id) {
        
        const decoded = jwt.verify(tokenCookie.value, JWT_SECRET!) as Payload; 
            if(!decoded) {
                return new Response(JSON.stringify("Unable to decode cookie"), {status: 400});
            }
            const { data, error } = await supabase
                .from("Pen")
                .select("ink_type_id")
                .eq("pen_id", decoded.penId);
            
            if(error) {
                console.error(error);
                return new Response(JSON.stringify(error), {status: 400});
            }

            const responseData = await extractInkDetails(data[0].ink_type_id)
            return new Response(JSON.stringify(responseData), {status: 200, headers: {"Content-Type": "application/json"}});
    }
    const { data, error } = await supabase
        .from("Pen")
        .select("ink_type_id")
        .eq("pen_id", pen_Id);
    
    if(error) {
        console.error(error);
        return new Response(JSON.stringify(error), {status: 400});
    }

    const responseData = await extractInkDetails(data[0].ink_type_id)
    return new Response(JSON.stringify(responseData), {status: 200, headers: {"Content-Type": "application/json"}});

}