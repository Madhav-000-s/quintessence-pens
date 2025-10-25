import { supabase } from "@/supabase-client";

// Fallback customer ID for unauthenticated users or testing
// Updated to use existing customer ID from database
const DUMMY_CUSTOMER_ID = 2;

/**
 * Get the current customer ID from the authenticated user
 * Falls back to dummy customer if no user is authenticated
 */
export async function getCurrentCustomerId(): Promise<number> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.warn("Error fetching user:", error.message);
      return DUMMY_CUSTOMER_ID;
    }

    if (!user) {
      console.warn("No authenticated user, using dummy customer ID:", DUMMY_CUSTOMER_ID);
      return DUMMY_CUSTOMER_ID;
    }

    // Fetch Customer record by user UUID
    const { data, error: customerError } = await supabase
      .from('Customers')
      .select('id')
      .eq('user', user.id)
      .single();

    if (customerError) {
      console.error("Error fetching customer:", customerError.message);
      return DUMMY_CUSTOMER_ID;
    }

    if (!data) {
      console.warn("No customer record found for user, using dummy customer ID:", DUMMY_CUSTOMER_ID);
      return DUMMY_CUSTOMER_ID;
    }

    return data.id;
  } catch (error) {
    console.error("Unexpected error in getCurrentCustomerId:", error);
    return DUMMY_CUSTOMER_ID;
  }
}

/**
 * Check if a customer ID is the dummy customer
 */
export function isDummyCustomer(customerId: number): boolean {
  return customerId === DUMMY_CUSTOMER_ID;
}

/**
 * Get customer info including email and name
 */
export async function getCurrentCustomerInfo() {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return {
        id: DUMMY_CUSTOMER_ID,
        email: 'dummy@test.com',
        first_name: 'Guest',
        last_name: 'User',
        isDummy: true,
      };
    }

    const { data, error } = await supabase
      .from('Customers')
      .select('*')
      .eq('user', user.id)
      .single();

    if (error || !data) {
      return {
        id: DUMMY_CUSTOMER_ID,
        email: user.email || 'dummy@test.com',
        first_name: 'Guest',
        last_name: 'User',
        isDummy: true,
      };
    }

    return {
      ...data,
      isDummy: false,
    };
  } catch (error) {
    console.error("Error fetching customer info:", error);
    return {
      id: DUMMY_CUSTOMER_ID,
      email: 'dummy@test.com',
      first_name: 'Guest',
      last_name: 'User',
      isDummy: true,
    };
  }
}
