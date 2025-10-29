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

interface Business {
  id: number;
  created_at: string;
  business_name: string;
  contact_email: string;
  contact_phone: string;
  gst_number: string | null;
  business_address: string;
  city: string;
  state: string;
  pincode: string;
  contact_person: string;
  credit_limit: number | null;
  payment_terms: string | null;
  is_active: boolean;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [filterActive, setFilterActive] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    business_name: "",
    contact_email: "",
    contact_phone: "",
    gst_number: "",
    business_address: "",
    city: "",
    state: "",
    pincode: "",
    contact_person: "",
    credit_limit: 0,
    payment_terms: "",
    is_active: true,
  });

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Businesses")
        .select("*")
        .order("business_name", { ascending: true });

      if (error) throw error;
      setBusinesses(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingBusiness(null);
    setFormData({
      business_name: "",
      contact_email: "",
      contact_phone: "",
      gst_number: "",
      business_address: "",
      city: "",
      state: "",
      pincode: "",
      contact_person: "",
      credit_limit: 0,
      payment_terms: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (business: Business) => {
    setEditingBusiness(business);
    setFormData({
      business_name: business.business_name,
      contact_email: business.contact_email,
      contact_phone: business.contact_phone,
      gst_number: business.gst_number || "",
      business_address: business.business_address,
      city: business.city,
      state: business.state,
      pincode: business.pincode,
      contact_person: business.contact_person,
      credit_limit: business.credit_limit || 0,
      payment_terms: business.payment_terms || "",
      is_active: business.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingBusiness) {
        const { error } = await supabase
          .from("Businesses")
          .update(formData)
          .eq("id", editingBusiness.id);

        if (error) throw error;
        setSuccess("Business updated successfully!");
      } else {
        const { error } = await supabase
          .from("Businesses")
          .insert([formData]);

        if (error) throw error;
        setSuccess("Business created successfully!");
      }

      setIsDialogOpen(false);
      await fetchBusinesses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save business");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this business?")) return;

    try {
      const { error } = await supabase
        .from("Businesses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSuccess("Business deleted successfully!");
      await fetchBusinesses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete business");
    }
  };

  const filteredBusinesses = businesses.filter((business) => {
    if (filterActive === "all") return true;
    if (filterActive === "active") return business.is_active;
    if (filterActive === "inactive") return !business.is_active;
    return true;
  });

  const activeCount = businesses.filter((b) => b.is_active).length;
  const inactiveCount = businesses.filter((b) => !b.is_active).length;

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Clients</h1>
            <p className="text-muted-foreground">
              Manage your B2B business clients and corporate accounts
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchBusinesses} variant="outline">
              Refresh
            </Button>
            <Button onClick={handleOpenAddDialog}>Add Business</Button>
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
                  Total Businesses
                </p>
                <span className="text-2xl">🏢</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{businesses.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">All clients</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <span className="text-2xl">✅</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {activeCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {businesses.length > 0
                  ? ((activeCount / businesses.length) * 100).toFixed(1)
                  : 0}
                % active rate
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <span className="text-2xl">⏸️</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-600 dark:text-gray-400">
                {inactiveCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Not currently active</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filterActive === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("all")}
          >
            All ({businesses.length})
          </Button>
          <Button
            variant={filterActive === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("active")}
          >
            Active ({activeCount})
          </Button>
          <Button
            variant={filterActive === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("inactive")}
          >
            Inactive ({inactiveCount})
          </Button>
        </div>

        {/* Business Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`business-${i}`} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">Business Name</th>
                    <th className="p-3 text-left text-sm font-medium">Contact Person</th>
                    <th className="p-3 text-left text-sm font-medium">Email</th>
                    <th className="p-3 text-left text-sm font-medium">Phone</th>
                    <th className="p-3 text-left text-sm font-medium">Location</th>
                    <th className="p-3 text-left text-sm font-medium">GST Number</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBusinesses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-muted-foreground">
                        No businesses found
                      </td>
                    </tr>
                  ) : (
                    filteredBusinesses.map((business) => (
                      <tr
                        key={business.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-3 text-sm font-medium">
                          {business.business_name}
                        </td>
                        <td className="p-3 text-sm">{business.contact_person}</td>
                        <td className="p-3 text-sm">{business.contact_email}</td>
                        <td className="p-3 text-sm">{business.contact_phone}</td>
                        <td className="p-3 text-sm">
                          {business.city}, {business.state}
                        </td>
                        <td className="p-3 text-sm font-mono text-xs">
                          {business.gst_number || "-"}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              business.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            }`}
                          >
                            {business.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditDialog(business)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(business.id)}
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBusiness ? "Edit Business" : "Add New Business"}
              </DialogTitle>
              <DialogDescription>
                {editingBusiness
                  ? "Update business client details."
                  : "Add a new B2B business client."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    required
                    value={formData.business_name}
                    onChange={(e) =>
                      setFormData({ ...formData, business_name: e.target.value })
                    }
                    placeholder="TechCorp Solutions"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_person">Contact Person *</Label>
                  <Input
                    id="contact_person"
                    required
                    value={formData.contact_person}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_person: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    required
                    value={formData.contact_email}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_email: e.target.value })
                    }
                    placeholder="contact@business.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone *</Label>
                  <Input
                    id="contact_phone"
                    required
                    value={formData.contact_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, contact_phone: e.target.value })
                    }
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gst_number">GST Number</Label>
                  <Input
                    id="gst_number"
                    value={formData.gst_number}
                    onChange={(e) =>
                      setFormData({ ...formData, gst_number: e.target.value })
                    }
                    placeholder="29ABCDE1234F1Z5"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="business_address">Business Address *</Label>
                  <Input
                    id="business_address"
                    required
                    value={formData.business_address}
                    onChange={(e) =>
                      setFormData({ ...formData, business_address: e.target.value })
                    }
                    placeholder="123 Business Park, Phase 2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Mumbai"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="Maharashtra"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    required
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    placeholder="400001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit_limit">Credit Limit (₹)</Label>
                  <Input
                    id="credit_limit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.credit_limit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credit_limit: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="payment_terms">Payment Terms</Label>
                  <Input
                    id="payment_terms"
                    value={formData.payment_terms}
                    onChange={(e) =>
                      setFormData({ ...formData, payment_terms: e.target.value })
                    }
                    placeholder="Net 30 days"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Active Business
                    </Label>
                  </div>
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
                    : editingBusiness
                    ? "Update Business"
                    : "Create Business"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Bounded>
  );
}
