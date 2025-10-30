import { supabase } from "@/supabase-client";


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