"use client";

import { useEffect, useState } from "react";
import { Bounded } from "@/components/base/bounded";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/supabase-client";

interface Grievance {
  id: number;
  created_at: string;
  customer: number | null;
  message: string | null;
  defective_count: number | null;
}

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrievance, setEditingGrievance] = useState<Grievance | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer: null as number | null,
    message: "",
    defective_count: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch grievances
      const { data: grievancesData, error: grievancesError } = await supabase
        .from("Grievances")
        .select("*")
        .order("created_at", { ascending: false });

      if (grievancesError) throw grievancesError;
      setGrievances(grievancesData || []);

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from("Customers")
        .select("id, first_name, last_name, email")
        .order("first_name", { ascending: true });

      if (customersError) throw customersError;
      setCustomers(customersData || []);

      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load grievances");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingGrievance(null);
    setFormData({
      customer: null,
      message: "",
      defective_count: 0,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (grievance: Grievance) => {
    setEditingGrievance(grievance);
    setFormData({
      customer: grievance.customer,
      message: grievance.message || "",
      defective_count: grievance.defective_count || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingGrievance) {
        const { error } = await supabase
          .from("Grievances")
          .update(formData)
          .eq("id", editingGrievance.id);

        if (error) throw error;
        setSuccess("Grievance updated successfully!");
      } else {
        const { error } = await supabase
          .from("Grievances")
          .insert([formData]);

        if (error) throw error;
        setSuccess("Grievance created successfully!");
      }

      setIsDialogOpen(false);
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save grievance");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this grievance?")) return;

    try {
      const { error } = await supabase
        .from("Grievances")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuccess("Grievance deleted successfully!");
      await fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete grievance");
    }
  };

  const getCustomerName = (customerId: number | null) => {
    if (!customerId) return "N/A";
    const customer = customers.find((c) => c.id === customerId);
    return customer ? `${customer.first_name} ${customer.last_name}` : `Customer #${customerId}`;
  };

  const getCustomerEmail = (customerId: number | null) => {
    if (!customerId) return "N/A";
    const customer = customers.find((c) => c.id === customerId);
    return customer?.email || "N/A";
  };

  const totalDefects = grievances.reduce((sum, g) => sum + (g.defective_count || 0), 0);
  const avgDefects = grievances.length > 0 ? (totalDefects / grievances.length).toFixed(1) : 0;

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customer Grievances</h1>
            <p className="text-muted-foreground">
              Track and manage customer complaints and defective product reports
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchData} variant="outline">
              Refresh
            </Button>
            <Button onClick={handleOpenAddDialog}>Add Grievance</Button>
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
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Grievances
                </p>
                <span className="text-2xl">📋</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{grievances.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">All complaints</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Defects
                </p>
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {totalDefects}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Defective products</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Defects
                </p>
                <span className="text-2xl">📊</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {avgDefects}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Per complaint</p>
            </div>
          </div>
        )}

        {/* Grievances Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`grievance-${i}`} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">ID</th>
                    <th className="p-3 text-left text-sm font-medium">Date</th>
                    <th className="p-3 text-left text-sm font-medium">Customer</th>
                    <th className="p-3 text-left text-sm font-medium">Email</th>
                    <th className="p-3 text-right text-sm font-medium">
                      Defective Count
                    </th>
                    <th className="p-3 text-left text-sm font-medium">Message</th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {grievances.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No grievances found
                      </td>
                    </tr>
                  ) : (
                    grievances.map((grievance) => (
                      <tr
                        key={grievance.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-3 text-sm font-medium">#{grievance.id}</td>
                        <td className="p-3 text-sm">
                          {new Date(grievance.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-sm">
                          {getCustomerName(grievance.customer)}
                        </td>
                        <td className="p-3 text-sm">
                          {getCustomerEmail(grievance.customer)}
                        </td>
                        <td className="p-3 text-right text-sm font-semibold text-red-600 dark:text-red-400">
                          {grievance.defective_count || 0}
                        </td>
                        <td className="p-3 text-sm max-w-md truncate">
                          {grievance.message || "-"}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditDialog(grievance)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(grievance.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingGrievance ? "Edit Grievance" : "Add New Grievance"}
              </DialogTitle>
              <DialogDescription>
                {editingGrievance
                  ? "Update customer grievance details."
                  : "Record a new customer complaint or defective product report."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <select
                    id="customer"
                    value={formData.customer || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer: e.target.value ? parseInt(e.target.value, 10) : null,
                      })
                    }
                    className="w-full rounded border p-2"
                  >
                    <option value="">Select a customer (optional)</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.first_name} {customer.last_name} ({customer.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defective_count">Defective Count</Label>
                  <Input
                    id="defective_count"
                    type="number"
                    min="0"
                    value={formData.defective_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defective_count: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full rounded border p-2"
                    rows={5}
                    placeholder="Describe the customer complaint or issue..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting
                    ? "Saving..."
                    : editingGrievance
                    ? "Update Grievance"
                    : "Create Grievance"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Bounded>
  );
}
