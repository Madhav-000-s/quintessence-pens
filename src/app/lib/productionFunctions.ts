import { supabase } from "@/supabase-client";
import prices from "@/app/data/stone-price.json";

export async function getMaterialsBelowThreshold() {
    const { data, error } = await supabase
        .from("Inventory")
        .select("id, material_name, weight")
        .eq("isPen", false)
        .lt("weight", 100);
    
    if (error) {
        console.error("Error fetching materials below threshold:", error);
        return null;
    }
    return data;
}


export async function getMaterialPrice(material_id: number) {
    const { data, error } = await supabase
        .from("Inventory")
        .select("material_name")
        .eq("id", material_id)
        .single();
    
    if (error || !data) {
        console.error("Error fetching material name:", error);
        return {price: 0, };
    }
    return {price: data.material_name in prices ? prices[data.material_name as keyof typeof prices] : null, name: data.material_name};
}


export async function updateInventoryAfterReceipt(InventoryId: number, quantity: number) {
    const { data, error } = await supabase
        .rpc("updateInventory", {
            inventory_id: InventoryId,
            quantity: quantity
        })
    
    if(error) {
        console.error("Error:", error);
    }
    return;
}

export async function deductMaterialFromInventory(material_wts: Record<string, number>, count: number) {
    
    for (const [materialName, weight] of Object.entries(material_wts)) {
        const { data, error } = await supabase
            .rpc("deductMaterial", {
                name: materialName,
                wt: weight * count
            });
        if (error) {
        console.error("Error deducting material from inventory:", error);
        return false;
    }
    }
    return true;
}
