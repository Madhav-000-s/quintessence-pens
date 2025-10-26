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


export async function getMaterialPriceAndVendor(material_id: number) {
    const { data, error } = await supabase
        .from("Inventory")
        .select("material_name, vendor, cost_p_gram")
        .eq("id", material_id)
        .single();
    
    if (error || !data) {
        console.error("Error fetching material name:", error);
        return {price: 0, };
    }
    return {
        price: data.cost_p_gram,
        name: data.material_name,
        vendor_id: data.vendor
    };
}


export async function updateInventoryAfterReceipt(InventoryId: number, quantity: number) {
    const { data, error } = await supabase
        .rpc("updateInventory", {
            inventory_id: InventoryId,
            quantity: quantity
        })
    
    if(error) {
        console.error("Error:", error);
        return false;
    }
    return true;
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


export async function getVendorDetails(vendor_id: number) {
    const { data, error } = await supabase
        .from("Vendors")
        .select("*")
        .eq("id", vendor_id)
        .single();
    if (error) {
        console.error("Error fetching vendor details:", error);
        return null;
    }
    return data;
}