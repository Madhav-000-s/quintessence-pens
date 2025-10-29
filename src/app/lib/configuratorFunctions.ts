import { supabase } from "@/supabase-client";
import prices from "@/app/data/stone-price.json"


export type Design = {
    description: string;
    font: string;
    colour: string;
    hex_code: string;
}

export type Engraving = {
    font: string;
    type_name: string;
    description: string;
}
// CREATE OPERATIONS

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
    .select("design_id, cost");

    if (error) { 
        console.error(error); 
        return null;
    }

    return {
        id: data[0].design_id,
        cost: data[0].cost,
    }

}



export async function createMaterial(name: string, weight: number) {
    const cost_per_unit = prices[(name.toLowerCase()) as keyof typeof prices];
    console.log("cost per unit", cost_per_unit);
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

   
    return {
        id: data[0].id,
        cost: data[0].cost 
    }
    
}

export async function createEngraving(font: string, type_name: string, description: string) {
    const { data, error } = await supabase
        .from("Engravings")
        .insert({
            font, 
            type_name,
            description,
            cost: 1000
        })
        .select("engraving_id, cost");
    
    if(error) {
        console.error("error: ", error);
        return null;
    }
    
    return {
        id: data[0].engraving_id,
        cost: data[0].cost,
    };
}

export async function createClipDesign(description: string, material: string, design: Design, engraving: Engraving) {
    const newMaterial = await createMaterial(material, 5);
    const newDesign = await createDesign(design.colour, design.font, design.colour, design.hex_code);
    const newEngraving = await createEngraving(engraving.font, engraving.type_name, engraving.description);
    const { data, error } = await supabase
        .from("ClipDesign")
        .insert({
            description,
            cost: 1000 + newMaterial?.cost + newDesign?.cost + newEngraving?.cost,
            material: newMaterial?.id,
            design: newDesign?.id,
            engraving: newEngraving?.id
        })
        .select("id, cost");
    
    if(error) {
        console.error(error);
        return null;
    }

    return {id: data[0].id, cost: data[0].cost};
}

export async function createCoating(colour: string, hex_code: string, type: string) {
    const { data, error } = await supabase
    .from("Coating")
    .insert({
        colour,
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


// SELECT OPERATIONS

export async function materialData(id: number) {
    const { data, error } = await supabase
        .from("Material")
        .select("*")
        .eq("id", id);
    
    if(error) {
        console.error(error)
        return null;
    }

    return data[0];
}

export async function designData(id: number) {
    const { data, error } = await supabase
        .from("Design")
        .select("*")
        .eq("design_id", id);
    
    if(error) {
        console.error(error)
        return null;
    }

    return data[0];
}

export async function coatingData(id: number) {
    const { data, error } = await supabase
        .from("Coating")
        .select("*")
        .eq("coating_id", id);
    
    if(error) {
        console.error(error)
        return null;
    }

    return data[0];
}


export async function engravingData(id: number) {
    const { data, error } = await supabase
        .from("Engravings")
        .select("*")
        .eq("engraving_id", id);
    
    if (error) {
        console.error(error);
        return null;
    }
    return data[0]; 
}

export async function clipDesignData(id: number) {
    const {  data, error } = await supabase
        .from("ClipDesign")
        .select("*")
        .eq("id", id)
    
    if(error) {
        console.error(error);
        return null;
    }

    const newData = {
        ...data[0],
        material: await materialData(data[0].material),
        design: await designData(data[0].design),
        engraving: await engravingData(data[0].engraving)
    }
    return newData;
}

// Pen details extraction functions
export async function extractCapDetails(capId: number) {
    const { data, error } = await supabase
        .from("CapConfig")
        .select("*")
        .eq("cap_type_id", capId);

    if(error) {
        console.error(error);
        return null;
    }
    const responseData = {
        cap_type_id: data[0].cap_type_id,
        description: data[0].description,
        material: await materialData(data[0].material_id),
        design: await designData(data[0].design_id),
        engraving: await engravingData(data[0].engraving_id),
        clip_design: await clipDesignData(data[0].clip_design),
        coating: await coatingData(data[0].coating_id),
        cost: data[0].cost
    }
    return responseData;
}

export async function extractBarrelDetails(barrelId: number) {
    const { data, error } = await supabase
        .from("BarrelConfig")
        .select("*")
        .eq("barrel_id", barrelId);

    if(error) {
        console.error(error);
        return null;
    }
    const responseData = {
        barrel_id: data[0].barrel_id,
        description: data[0].description,
        shape: data[0].shape,
        cost: data[0].cost,
        grip_type: data[0].grip_type,
        material: await materialData(data[0].material_id),
        design: await designData(data[0].design_id),
        engraving: await engravingData(data[0].engraving_id),
        coating: await coatingData(data[0].coating_id)
    }
    return responseData;
}

export async function extractInkDetails(inkId: number) {
    const { data, error } = await supabase
        .from("InkConfig")
        .select("*")
        .eq("ink_type_id", inkId);

    if(error) {
        console.error(error);
        return null;
    }
    const responseData = {
        ink_type_id: data[0].ink_type_id,
        type_name: data[0].type_name,
        description: data[0].description,
        cost: data[0].cost,
        colour: data[0].colour_name,
        hexcode: data[0].hexcode,
    }
    return responseData;
}   

export async function extractNibDetails(nibId: number) {
    const { data, error } = await supabase
        .from("NibConfig")
        .select("*")
        .eq("nibtype_id", nibId);

    if(error) {
        console.error(error);
        return null;
    }
    const responseData = {
        nib_id: data[0].nibtype_id,
        description: data[0].description,
        size: data[0].size,
        cost: data[0].cost,
        material: await materialData(data[0].material_id),
        design: await designData(data[0].design_id),
    }
    return responseData;
}

export async function extractPenDetails(penId: number) {
    const { data, error } = await supabase
        .from("Pen")
        .select("*")
        .eq("pen_id", penId);

    if(error) {
        console.error(error);
        return null;
    }
    const responseData = {
        pen_id: data[0].pen_id,
        pen_type: data[0].pen_type,
        cost: data[0].cost,
        cap: await extractCapDetails(data[0].cap_type_id),
        barrel: await extractBarrelDetails(data[0].barrel_id),
        ink: await extractInkDetails(data[0].ink_type_id),
        nib: await extractNibDetails(data[0].nibtype_id),
    }
    return responseData;
}