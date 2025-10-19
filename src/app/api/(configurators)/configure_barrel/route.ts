import { supabase } from "@/supabase-client";
import jwt from 'jsonwebtoken'
import { createMaterial, createCoating, createDesign, createEngraving, extractBarrelDetails} from "@/app/lib/configuratorFunctions";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { json } from "stream/consumers";
// import { decode } from "node:querystring";

const JWT_SECRET = process.env.JWT_SECRET;

export type Payload = {
    penId: number;
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    if(!body) {
        return new Response(JSON.stringify("NO DATA SENT"),{
            headers: {"Content-Type": "application/json"},
            status: 400
        });
    }

    let material = null;
    let design = null;
    let engraving = null;
    let coating = null;

    if(body.material) {
        material = await createMaterial(body.material.name, 2);
    }
    if(body.design) {
        design = await createDesign(body.design.description, body.design.font, body.design.colour, body.design.hex_code);
    }
    if(body.engraving) {
        engraving = await createEngraving(body.engraving.font, body.engraving.type_name, body.engraving.description);
    }
    if(body.coating) {
        coating = await createCoating(body.coating.colour, body.coating.hex_code, body.coating.type);
    }

    const { data: BarrelData, error: BarrelError} = await supabase
        .from("BarrelConfig")
        .insert({
            description: body.description,
            grip_type: body.grip_type,
            shape: body.sahpe,
            design_id: design?.id,
            material_id: material?.id,
            engraving_id: engraving?.id,
            coating_id: coating,
            cost: material?.cost + engraving?.cost + design?.cost 
        })
        .select("barrel_id, cost");

    if(BarrelError) {
        return new Response(JSON.stringify(BarrelError));
    }

    const tokenCookie = request.cookies.get("pen");
    if(tokenCookie) {
        const decoded = jwt.verify(tokenCookie.value, JWT_SECRET!) as Payload; 
        if(!decoded) {
            return new Response(JSON.stringify("Unable to decode cookie"), {status: 400});
        }
        const {data: penData, error: penError} = await supabase
            .rpc('update_barrel_details', {
                new_barrel_id: BarrelData[0].barrel_id,
                amount_to_add: BarrelData[0].cost,
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
                cap_type_id: BarrelData[0].barrel_id,
                cost: BarrelData[0].cost,
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
                return new NextResponse(JSON.stringify("New pen created with barrel"), {
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
                .select("barrel_id")
                .eq("pen_id", decoded.penId);
            
            if(error) {
                console.error(error);
                return new Response(JSON.stringify(error), {status: 400});
            }

            const responseData = await extractBarrelDetails(data[0].barrel_id)
            return  Response.json(responseData)
    }
    const { data, error } = await supabase
        .from("Pen")
        .select("barrel_id")
        .eq("pen_id", pen_Id);
    
    if(error) {
        console.error(error);
        return new Response(JSON.stringify(error), {status: 400});
    }

    const responseData = await extractBarrelDetails(data[0].barrel_id)
    return Response.json(responseData)

}