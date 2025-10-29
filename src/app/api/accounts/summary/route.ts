import { supabase } from "@/supabase-client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "current_month"; // current_month, previous_month, current_year, custom
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  const now = new Date();
  let currentMonthStart: string;
  let currentMonthEnd: string;
  let previousMonthStart: string;
  let previousMonthEnd: string;

  // Calculate date ranges
  if (period === "custom" && startDate && endDate) {
    currentMonthStart = startDate;
    currentMonthEnd = endDate;
    // For custom period, previous period is same length before start date
    const daysDiff = Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
    const prevEnd = new Date(startDate);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - daysDiff);
    previousMonthStart = prevStart.toISOString().split("T")[0];
    previousMonthEnd = prevEnd.toISOString().split("T")[0];
  } else {
    // Current month
    currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

    // Previous month
    previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split("T")[0];
    previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0];
  }

  // Get current period data
  const { data: currentData, error: currentError } = await supabase
    .from("Transactions")
    .select("transaction_type, amount")
    .eq("status", "completed")
    .gte("transaction_date", currentMonthStart)
    .lte("transaction_date", currentMonthEnd);

  if (currentError) {
    return new Response(JSON.stringify(currentError), { status: 400 });
  }

  // Get previous period data
  const { data: previousData, error: previousError } = await supabase
    .from("Transactions")
    .select("transaction_type, amount")
    .eq("status", "completed")
    .gte("transaction_date", previousMonthStart)
    .lte("transaction_date", previousMonthEnd);

  if (previousError) {
    return new Response(JSON.stringify(previousError), { status: 400 });
  }

  // Calculate current period totals
  const currentRevenue = currentData
    ?.filter((t) => t.transaction_type === "income" || t.transaction_type === "payment_received")
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const currentExpenses = currentData
    ?.filter((t) => t.transaction_type === "expense" || t.transaction_type === "payment_made")
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const currentProfit = currentRevenue - currentExpenses;

  // Calculate previous period totals
  const previousRevenue = previousData
    ?.filter((t) => t.transaction_type === "income" || t.transaction_type === "payment_received")
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const previousExpenses = previousData
    ?.filter((t) => t.transaction_type === "expense" || t.transaction_type === "payment_made")
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const previousProfit = previousRevenue - previousExpenses;

  // Calculate percentage changes
  const revenueChange = previousRevenue > 0
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : currentRevenue > 0 ? 100 : 0;

  const expenseChange = previousExpenses > 0
    ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
    : currentExpenses > 0 ? 100 : 0;

  const profitChange = previousProfit !== 0
    ? ((currentProfit - previousProfit) / Math.abs(previousProfit)) * 100
    : currentProfit > 0 ? 100 : currentProfit < 0 ? -100 : 0;

  // Get pending receivables (unpaid work orders)
  const { data: workOrders } = await supabase
    .from("WorkOrder")
    .select("grand_total")
    .eq("isPaid", false)
    .eq("isAccepted", true);

  const pendingReceivables = workOrders?.reduce((sum, wo) => sum + (Number(wo.grand_total) || 0), 0) || 0;

  // Get pending payables (unreceived purchase orders)
  const { data: purchaseOrders } = await supabase
    .from("PurchaseOrder")
    .select("total_cost")
    .eq("isReceived", false);

  const pendingPayables = purchaseOrders?.reduce((sum, po) => sum + (po.total_cost || 0), 0) || 0;

  // Get total transaction count
  const { count: totalTransactions } = await supabase
    .from("Transactions")
    .select("*", { count: "exact", head: true });

  const summary = {
    current_month_revenue: currentRevenue,
    current_month_expenses: currentExpenses,
    current_month_profit: currentProfit,
    previous_month_revenue: previousRevenue,
    previous_month_expenses: previousExpenses,
    previous_month_profit: previousProfit,
    revenue_change_percent: parseFloat(revenueChange.toFixed(2)),
    expense_change_percent: parseFloat(expenseChange.toFixed(2)),
    profit_change_percent: parseFloat(profitChange.toFixed(2)),
    pending_receivables: pendingReceivables,
    pending_payables: pendingPayables,
    total_transactions: totalTransactions || 0,
  };

  return new Response(JSON.stringify(summary), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
