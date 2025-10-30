import { supabase } from "@/supabase-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const months = parseInt(searchParams.get("months") || "6", 10); // Default: last 6 months

  // Calculate date range
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  const startDateStr = startDate.toISOString().split("T")[0];

  // Get all transactions for the period
  const { data: transactions, error } = await supabase
    .from("Transactions")
    .select("*")
    .eq("status", "completed")
    .gte("transaction_date", startDateStr)
    .order("transaction_date", { ascending: true });

  if (error) {
    return new Response(JSON.stringify(error), { status: 400 });
  }

  // 1. Category Breakdown (Expenses only)
  const categoryMap = new Map<string, { amount: number; count: number }>();
  let totalExpenses = 0;

  transactions?.forEach((t) => {
    if (t.transaction_type === "expense" || t.transaction_type === "payment_made") {
      const current = categoryMap.get(t.category) || { amount: 0, count: 0 };
      categoryMap.set(t.category, {
        amount: current.amount + t.amount,
        count: current.count + 1,
      });
      totalExpenses += t.amount;
    }
  });

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category: category as any,
    amount: data.amount,
    percentage: totalExpenses > 0 ? (data.amount / totalExpenses) * 100 : 0,
    count: data.count,
  }));

  // 2. Monthly Trends
  const monthlyMap = new Map<string, { revenue: number; expenses: number }>();

  transactions?.forEach((t) => {
    const month = t.transaction_date.substring(0, 7); // YYYY-MM format
    const current = monthlyMap.get(month) || { revenue: 0, expenses: 0 };

    if (t.transaction_type === "income" || t.transaction_type === "payment_received") {
      current.revenue += t.amount;
    } else if (t.transaction_type === "expense" || t.transaction_type === "payment_made") {
      current.expenses += t.amount;
    }

    monthlyMap.set(month, current);
  });

  const monthlyTrends = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      revenue: data.revenue,
      expenses: data.expenses,
      profit: data.revenue - data.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // 3. Top Customers by Revenue
  const { data: customerTransactions } = await supabase
    .from("Transactions")
    .select("customer_id, amount")
    .not("customer_id", "is", null)
    .in("transaction_type", ["income", "payment_received"])
    .eq("status", "completed")
    .gte("transaction_date", startDateStr);

  const customerMap = new Map<number, { amount: number; count: number }>();
  customerTransactions?.forEach((t) => {
    const current = customerMap.get(t.customer_id) || { amount: 0, count: 0 };
    customerMap.set(t.customer_id, {
      amount: current.amount + t.amount,
      count: current.count + 1,
    });
  });

  const topCustomerIds = Array.from(customerMap.entries())
    .sort((a, b) => b[1].amount - a[1].amount)
    .slice(0, 5)
    .map(([id]) => id);

  const topCustomers = [];
  if (topCustomerIds.length > 0) {
    const { data: customers } = await supabase
      .from("Customers")
      .select("id, first_name, last_name")
      .in("id", topCustomerIds);

    topCustomers.push(
      ...topCustomerIds.map((id) => {
        const customer = customers?.find((c) => c.id === id);
        const stats = customerMap.get(id)!;
        return {
          customer_id: id,
          customer_name: customer
            ? `${customer.first_name} ${customer.last_name}`
            : `Customer #${id}`,
          total_amount: stats.amount,
          transaction_count: stats.count,
        };
      })
    );
  }

  // 4. Top Vendors by Spending
  const { data: vendorTransactions } = await supabase
    .from("Transactions")
    .select("vendor_id, amount")
    .not("vendor_id", "is", null)
    .in("transaction_type", ["expense", "payment_made"])
    .eq("status", "completed")
    .gte("transaction_date", startDateStr);

  const vendorMap = new Map<number, { amount: number; count: number }>();
  vendorTransactions?.forEach((t) => {
    const current = vendorMap.get(t.vendor_id) || { amount: 0, count: 0 };
    vendorMap.set(t.vendor_id, {
      amount: current.amount + t.amount,
      count: current.count + 1,
    });
  });

  const topVendorIds = Array.from(vendorMap.entries())
    .sort((a, b) => b[1].amount - a[1].amount)
    .slice(0, 5)
    .map(([id]) => id);

  const topVendors = [];
  if (topVendorIds.length > 0) {
    const { data: vendors } = await supabase
      .from("Vendors")
      .select("id, vendor_name")
      .in("id", topVendorIds);

    topVendors.push(
      ...topVendorIds.map((id) => {
        const vendor = vendors?.find((v) => v.id === id);
        const stats = vendorMap.get(id)!;
        return {
          vendor_id: id,
          vendor_name: vendor ? vendor.vendor_name : `Vendor #${id}`,
          total_amount: stats.amount,
          transaction_count: stats.count,
        };
      })
    );
  }

  const analyticsData = {
    category_breakdown: categoryBreakdown,
    monthly_trends: monthlyTrends,
    top_customers: topCustomers,
    top_vendors: topVendors,
  };

  return new Response(JSON.stringify(analyticsData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
