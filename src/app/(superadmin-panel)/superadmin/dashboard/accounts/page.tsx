"use client";

import { useEffect, useState } from "react";
import { Bounded } from "@/components/base/bounded";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  Transaction,
  FinancialSummary,
  TransactionFormData,
  TransactionType,
  TransactionCategory,
  PaymentMethod,
} from "@/types/accounts";

export default function AccountsPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<TransactionFormData>({
    transaction_date: new Date().toISOString().split("T")[0],
    transaction_type: "expense" as TransactionType,
    category: "other" as TransactionCategory,
    amount: 0,
    description: "",
    payment_method: "cash" as PaymentMethod,
    status: "completed",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch summary
      const summaryResponse = await fetch("/api/accounts/summary");
      if (!summaryResponse.ok) throw new Error("Failed to fetch summary");
      const summaryData = await summaryResponse.json();
      setSummary(summaryData);

      // Fetch recent transactions
      const transactionsResponse = await fetch("/api/accounts/transactions?limit=20");
      if (!transactionsResponse.ok) throw new Error("Failed to fetch transactions");
      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/accounts/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create transaction");
      }

      setSuccess("Transaction created successfully!");
      setIsAddDialogOpen(false);
      await fetchData();

      // Reset form
      setFormData({
        transaction_date: new Date().toISOString().split("T")[0],
        transaction_type: "expense",
        category: "other",
        amount: 0,
        description: "",
        payment_method: "cash",
        status: "completed",
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create transaction");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === "all" || t.transaction_type === filterType;
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    const matchesSearch =
      !searchTerm ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case "income":
      case "payment_received":
        return "text-green-600 dark:text-green-400";
      case "expense":
      case "payment_made":
        return "text-red-600 dark:text-red-400";
      default:
        return "";
    }
  };

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "income":
        return "Income";
      case "expense":
        return "Expense";
      case "payment_received":
        return "Payment Received";
      case "payment_made":
        return "Payment Made";
      default:
        return type;
    }
  };

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Accounts</h1>
            <p className="text-muted-foreground">
              Track revenue, expenses, and financial performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchData} variant="outline">
              Refresh
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>Add Transaction</Button>
          </div>
        </div>

        <Separator />

        {error && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <p className="text-sm text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && summary ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-lg border p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Month Revenue
                </p>
                <span className="text-2xl">💰</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(summary.current_month_revenue)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {summary.revenue_change_percent >= 0 ? "+" : ""}
                {summary.revenue_change_percent.toFixed(1)}% from last month
              </p>
            </div>

            <div className="rounded-lg border p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Current Month Expenses
                </p>
                <span className="text-2xl">📉</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(summary.current_month_expenses)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {summary.expense_change_percent >= 0 ? "+" : ""}
                {summary.expense_change_percent.toFixed(1)}% from last month
              </p>
            </div>

            <div className="rounded-lg border p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <span className="text-2xl">📊</span>
              </div>
              <p
                className={`mt-2 text-3xl font-bold ${summary.current_month_profit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {formatCurrency(summary.current_month_profit)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {summary.profit_change_percent >= 0 ? "+" : ""}
                {summary.profit_change_percent.toFixed(1)}% from last month
              </p>
            </div>

            <div className="rounded-lg border p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Receivables
                </p>
                <span className="text-2xl">⏳</span>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(summary.pending_receivables)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">From customers</p>
            </div>

            <div className="rounded-lg border p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Payables
                </p>
                <span className="text-2xl">💸</span>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(summary.pending_payables)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">To vendors</p>
            </div>

            <div className="rounded-lg border p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </p>
                <span className="text-2xl">📝</span>
              </div>
              <p className="mt-2 text-2xl font-bold">{summary.total_transactions}</p>
              <p className="mt-1 text-xs text-muted-foreground">All time</p>
            </div>
          </div>
        ) : loading ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={`summary-${i}`} className="h-32 lg:col-span-2" />
            ))}
          </div>
        ) : null}

        {/* Transactions Table */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>

          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Label>Type:</Label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded border p-2"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="payment_received">Payment Received</option>
                <option value="payment_made">Payment Made</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Label>Category:</Label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded border p-2"
              >
                <option value="all">All Categories</option>
                <option value="sales">Sales</option>
                <option value="purchase_order">Purchase Order</option>
                <option value="labor">Labor</option>
                <option value="shipping">Shipping</option>
                <option value="materials">Materials</option>
                <option value="utilities">Utilities</option>
                <option value="rent">Rent</option>
                <option value="salaries">Salaries</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              placeholder="Search description or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={`transactions-${i}`} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">Date</th>
                    <th className="p-3 text-left text-sm font-medium">Type</th>
                    <th className="p-3 text-left text-sm font-medium">Category</th>
                    <th className="p-3 text-left text-sm font-medium">Description</th>
                    <th className="p-3 text-right text-sm font-medium">Amount</th>
                    <th className="p-3 text-left text-sm font-medium">Method</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-3 text-sm">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </td>
                        <td className={`p-3 text-sm font-medium ${getTypeColor(transaction.transaction_type)}`}>
                          {getTypeLabel(transaction.transaction_type)}
                        </td>
                        <td className="p-3 text-sm capitalize">
                          {transaction.category.replace("_", " ")}
                        </td>
                        <td className="p-3 text-sm">
                          {transaction.description || "-"}
                        </td>
                        <td className={`p-3 text-right text-sm font-semibold ${getTypeColor(transaction.transaction_type)}`}>
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="p-3 text-sm capitalize">
                          {transaction.payment_method?.replace("_", " ") || "-"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Transaction Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
              <DialogDescription>
                Record a new financial transaction manually
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="transaction_date">Transaction Date *</Label>
                  <Input
                    id="transaction_date"
                    type="date"
                    required
                    value={formData.transaction_date}
                    onChange={(e) =>
                      setFormData({ ...formData, transaction_date: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.amount || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: parseFloat(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction_type">Type *</Label>
                  <select
                    id="transaction_type"
                    required
                    value={formData.transaction_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        transaction_type: e.target.value as TransactionType,
                      })
                    }
                    className="w-full rounded border p-2"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                    <option value="payment_received">Payment Received</option>
                    <option value="payment_made">Payment Made</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as TransactionCategory,
                      })
                    }
                    className="w-full rounded border p-2"
                  >
                    <option value="sales">Sales</option>
                    <option value="purchase_order">Purchase Order</option>
                    <option value="labor">Labor</option>
                    <option value="shipping">Shipping</option>
                    <option value="materials">Materials</option>
                    <option value="utilities">Utilities</option>
                    <option value="rent">Rent</option>
                    <option value="salaries">Salaries</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <select
                    id="payment_method"
                    value={formData.payment_method || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value as PaymentMethod,
                      })
                    }
                    className="w-full rounded border p-2"
                  >
                    <option value="">None</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit">Credit</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as any })
                    }
                    className="w-full rounded border p-2"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description of transaction"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full rounded border p-2"
                    rows={3}
                    placeholder="Additional notes or details"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Transaction"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Bounded>
  );
}
