import { supabase } from "@/supabase-client";


export async function extractAddress(customerId: number) {
    const { data, error } = await supabase
        .from("Address")
        .select("*")
        .eq("customer_id", customerId)
    
    if(error) {
        console.error(error);
        return null;
    }
    return data;
}

export async function expandCustomer(customerId: number) {
    const { data, error } = await supabase
        .from("Customer")
        .select("id, first_name, last_name, email, phone, credit") // exclude 'user' column
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