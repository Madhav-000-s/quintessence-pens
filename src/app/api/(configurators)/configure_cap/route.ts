import { supabase } from "@/supabase-client";
import jwt from 'jsonwebtoken'
import { createMaterial, createCoating, createDesign, createEngraving,
    materialData, designData, coatingData, engravingData    
 } from "@/app/lib/configuratorFunctions";
import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
// import { decode } from "node:querystring";

const JWT_SECRET = process.env.JWT_SECRET;

interface Payload {
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
    let clip_design = null;
    let coating = null;

    if(body.material) {
        material = await createMaterial(body.material.name, body.material.weight);
    }
    if(body.design) {
        design = await createDesign(body.design.description, body.design.font, body.design.colour, body.design.hex_code);
    }
    if(body.engraving) {
        const engraving_material = await createMaterial(body.engraving.material.name, body.engraving.material.weight);
        engraving = await createEngraving(body.engraving.font, body.engraving.type_name, body.engraving.description, engraving_material!);
    }
    if(body.clip_design) {
        clip_design = await createDesign(body.clip_design.description, body.clip_design.font, body.clip_design.colour, body.clip_design.hex_code)
    }
    if(body.coating) {
        coating = await createCoating(body.coating.colour, body.coating.hex_code, body.coating.type);
    }

    
        const { data, error } = await supabase
            .from("CapConfig")
            .insert({
                description: body.description,
                material_id: material?.id,
                design_id: design?.id,
                engraving_id: engraving?.id,
                clip_design_id: clip_design?.id,
                coating_id: coating,
                cost: material?.cost + design?.cost + clip_design?.cost + engraving?.cost,
            })
            .select("cap_type_id, cost");
        
        if(!error) {
            const tokenCookie = request.cookies.get("pen");
            if(tokenCookie) {
                try {
                    const decoded = jwt.verify(tokenCookie.value, JWT_SECRET!) as Payload; 
                    if(!decoded) {
                        return new Response(JSON.stringify("Unable to decode cookie"), {status: 400});
                    }
                    const result = await supabase
                        .rpc('update_cap_details', {
                            new_cap_id: data[0].cap_type_id,
                            amount_to_add: data[0].cost,
                            row_id: decoded.penId
                        })
                    
                    if(!result.error) {
                        return Response.json("Cap added to Pen");
                    }
                    return new Response(JSON.stringify("Error updating pen"), {status: 400});
                }
                catch(err) {
                    console.log(err);
                    return new Response(JSON.stringify("Not able to decode token"), {status: 404});
                }
            }

            else {
                const result = await supabase
                .from("Pen")
                .insert({
                    cap_type_id: data[0].cap_type_id,
                    cost: data[0].cost,
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
                    return new NextResponse(JSON.stringify("New pen created with cap"), {
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
        return new Response(JSON.stringify(error), {status: 400});
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
            const result = await supabase
                .from("Pen")
                .select("cap_type_id")
                .eq("pen_id", decoded.penId);
            
            if(result.error) {
                console.error(result.error);
                return new Response(JSON.stringify(result.error), {status: 400});
            }

            const { data, error } = await supabase
                .from("CapConfig")
                .select("*")
                .eq("cap_type_id", result.data[0].cap_type_id);

            if(error) {
                console.error(error);
                return new Response(JSON.stringify(error), {status : 400});
            }
            const responseData = {
                cap_type_id: data[0].cap_type_id,
                description: data[0].description,
                material: await materialData(data[0].material_id),
                design: await designData(data[0].design_id),
                engraving: await engravingData(data[0].engraving_id),
                clip_design: await designData(data[0].clip_design_id),
                coating: await coatingData(data[0].coating_id),
                cost: data[0].cost
            }
            return Response.json(responseData);
        }
        catch (e) {
            console.error(e);
            return Response.json("Error decoding");
        }
    }
    
    if( body.pen_id === -1 ) {
        request.cookies.delete("pen");
        return Response.json({
            cap_type_id: null,
            description: null,
            material: null,
            design: null,
            engraving: null,
            clip_design: null,
            coating: null,
            cost: null
        })
    }

    const result = await supabase
        .from("Pen")
        .select("cap_type_id")
        .eq("pen_id", body.pen_id);
    
    if(result.error) {
        console.error(result.error);
        return new Response(JSON.stringify(result.error), {status: 400});
    }
    
    const { data, error } = await supabase
        .from("CapConfig")
        .select("*")
        .eq("cap_type_id", result.data[0].cap_type_id);

    if(error) {
        console.error(error);
        return new Response(JSON.stringify(error), {status : 400});
    }
    const responseData = {
        cap_type_id: data[0].cap_type_id,
        description: data[0].description,
        material: await materialData(data[0].material_id),
        design: await designData(data[0].design_id),
        engraving: await engravingData(data[0].engraving_id),
        clip_design: await designData(data[0].clip_design_id),
        coating: await coatingData(data[0].coating_id),
        cost: data[0].cost
    }
    return Response.json(responseData);
}