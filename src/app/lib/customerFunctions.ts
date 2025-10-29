import { supabase } from "@/supabase-client";
import { use } from "react";


export async function extractAddress(customerId: number) {
    const { data, error } = await supabase
        .from("Address")
        .select("*")
        .eq("customer", customerId)
    
    if(error) {
        console.error(error);
        return null;
    }
    return data;
}

export async function expandCustomer(customerId: number) {
    const { data, error } = await supabase
        .from("Customers")
        .select("id, first_name, last_name, email, phone, credit_amount") // exclude 'user' column
        .eq("id", customerId)
    
    if(error) {
        console.error(error);
        return null;
    }

    const responseData = {
        ...data[0],
        address: await extractAddress(customerId)
    }
    
    return responseData;
}

export async function getCustomerId(userid: string) {
    const { data, error } = await supabase
        .from("Customers")
        .select("id")
        .eq("user", userid)
        .single();
    
    if(error) {
        console.error(error);
        return null;
    }

    return data.id;
}