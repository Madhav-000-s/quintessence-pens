import { supabase } from "@/supabase-client";
import jwt from 'jsonwebtoken'
import { createMaterial, createDesign, extractNibDetails,  
 } from "@/app/lib/configuratorFunctions";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
// import { decode } from "node:querystring";

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

    let material = null;
    let design = null;

    if(body.material) {
        material = await createMaterial(body.material.name, 2);
    }
    if(body.design) {
        design = await createDesign(body.design.description, body.design.font, body.design.colour, body.design.hex_code);
    }

    const { data:NibData, error:NibError} = await supabase
        .from("NibConfig")
        .insert({
            description: body.description,
            size: body.size,
            material_id: material?.id,
            design_id: design?.id,
            cost: material?.cost + design?.cost
        })
        .select("nibtype_id, cost")
    
    if(NibError) {
        return new Response(JSON.stringify(NibError));
    }

    const tokenCookie = request.cookies.get("pen");
    if(tokenCookie) {
        const decoded = jwt.verify(tokenCookie.value, JWT_SECRET!) as Payload; 
        if(!decoded) {
            return new Response(JSON.stringify("Unable to decode cookie"), {status: 400});
        }
        const {data: penData, error: penError} = await supabase
            .rpc('update_nib_details', {
                new_nibtype_id: NibData[0].nibtype_id,
                amount_to_add: NibData[0].cost,
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
            cap_type_id: NibData[0].nibtype_id,
            cost: NibData[0].cost,
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
            return new NextResponse(JSON.stringify("New pen created with Nib"), {
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
    const body = await request.json();
        
        const tokenCookie = request.cookies.get("pen");
        if(tokenCookie && !body.pen_id) {
            try {
                const decoded = jwt.verify(tokenCookie.value, JWT_SECRET!) as Payload; 
                if(!decoded) {
                    return new Response(JSON.stringify("Unable to decode cookie"), {status: 400});
                }
                const { data, error} = await supabase
                    .from("Pen")
                    .select("nibtype_id")
                    .eq("pen_id", decoded.penId);
                
                if(error) {
                    console.error(error);
                    return new Response(JSON.stringify(error), {status: 400});
                }
    
                const responseData = await extractNibDetails(data[0].nibtype_id);
                return Response.json(responseData);
            }
            catch (e) {
                console.error(e);
                return Response.json("Error decoding");
            }
        }
    
        const result = await supabase
            .from("Pen")
            .select("nibtype_id")
            .eq("pen_id", body.pen_id);
        
        if(result.error) {
            console.error(result.error);
            return new Response(JSON.stringify(result.error), {status: 400});
        }
        
        const responseData = await extractNibDetails(result.data[0].nibtype_id);
        
        return Response.json(responseData);
}