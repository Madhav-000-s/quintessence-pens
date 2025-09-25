import { supabase } from "@/supabase-client";
import prices from "@/app/data/stone-price.json"

interface Material {
    id: number;
    cost: number;
}

export async function createDesign(description: string, font: string, colour:string, hex_code: string) {
    const { data, error } = await supabase
    .from("Design")
    .insert({
        description, 
        font, 
        cost: 800, 
        colour, 
        hex_code
    })
    .select("id, cost");

    if (error) { 
        console.error(error); 
        return null;
    }

    if(data && data.length > 0) { 
        console.log("inserted data: ", data);
        return {
            id: data[0].id,
            cost: data[0].cost,
        }
    }
}

export async function createMaterial(name: string, weight: number) {
    const cost_per_unit = prices[name as keyof typeof prices];
    const cost = cost_per_unit * weight;
    const { data, error } = await supabase
    .from("Material")
    .insert({
        name,
        weight,
        cost
    })
    .select("id, cost");

    if (error) { 
        console.error(error); 
        return null;
    }

    if(data && data.length > 0) { 
        console.log("inserted data: ", data);
        return {
            id: data[0].id,
            cost: data[0].cost 
        }
    }
}

export async function createEngraving(font: string, type_name: string, description: string, material: Material) {
    const { data, error } = await supabase
        .from("Engravings")
        .insert({
            font, 
            type_name,
            description,
            material_id: material.id,
            cost: material.cost + 1000
        })
        .select("engraving_id, cost");
    
    if(error) {
        console.error(error);
        return null;
    }
    
    return {
        id: data[0].engraving_id,
        cost: data[0].cost,
    };
}

export async function createCoating(color: string, hex_code: string, type: string) {
    const { data, error } = await supabase
    .from("Coating")
    .insert({
        color,
        hex_code,
        type
    })
    .select("coating_id");
    
    if(error) {
        console.error(error)
        return null;
    }
    
    return data[0].coating_id;
}