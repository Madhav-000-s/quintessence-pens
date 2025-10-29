// Financial Accounts Types

export type TransactionType = "income" | "expense" | "payment_received" | "payment_made";

export type TransactionCategory =
  | "sales"
  | "purchase_order"
  | "labor"
  | "shipping"
  | "materials"
  | "utilities"
  | "rent"
  | "salaries"
  | "other";

export type TransactionStatus = "completed" | "pending" | "cancelled";

export type ReferenceType = "work_order" | "purchase_order" | "invoice" | "manual";

export type PaymentMethod = "cash" | "card" | "bank_transfer" | "credit" | "cheque";

export interface Transaction {
  id: number;
  created_at: string;
  transaction_date: string;
  transaction_type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string | null;
  reference_id: number | null;
  reference_type: ReferenceType | null;
  payment_method: PaymentMethod | null;
  customer_id: number | null;
  vendor_id: number | null;
  status: TransactionStatus;
  notes: string | null;
}

export interface TransactionWithDetails extends Transaction {
  customer_name?: string;
  vendor_name?: string;
}

export interface AccountSummary {
  id: number;
  created_at: string;
  summary_date: string;
  total_revenue: number;
  total_expenses: number;
  net_profit: number;
  pending_payments: number;
  pending_payables: number;
}

export interface TransactionFilters {
  start_date?: string;
  end_date?: string;
  transaction_type?: TransactionType;
  category?: TransactionCategory;
  status?: TransactionStatus;
  customer_id?: number;
  vendor_id?: number;
  search?: string;
}

export interface TransactionFormData {
  transaction_date: string;
  transaction_type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description?: string;
  reference_id?: number;
  reference_type?: ReferenceType;
  payment_method?: PaymentMethod;
  customer_id?: number;
  vendor_id?: number;
  status?: TransactionStatus;
  notes?: string;
}

export interface PaymentRecord {
  amount: number;
  payment_method: PaymentMethod;
  transaction_date: string;
  reference_id?: number;
  reference_type: ReferenceType;
  customer_id?: number;
  vendor_id?: number;
  notes?: string;
}

export interface FinancialSummary {
  current_month_revenue: number;
  current_month_expenses: number;
  current_month_profit: number;
  previous_month_revenue: number;
  previous_month_expenses: number;
  previous_month_profit: number;
  revenue_change_percent: number;
  expense_change_percent: number;
  profit_change_percent: number;
  pending_receivables: number;
  pending_payables: number;
  total_transactions: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface AnalyticsData {
  category_breakdown: CategoryBreakdown[];
  monthly_trends: MonthlyTrend[];
  top_customers: Array<{
    customer_id: number;
    customer_name: string;
    total_amount: number;
    transaction_count: number;
  }>;
  top_vendors: Array<{
    vendor_id: number;
    vendor_name: string;
    total_amount: number;
    transaction_count: number;
  }>;
}
