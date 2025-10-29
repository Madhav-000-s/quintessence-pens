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
import type { VendorWithAddress, VendorDetail, VendorFormData } from "@/types/vendors";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorWithAddress[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterName, setFilterName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorWithAddress | null>(null);
  const [formData, setFormData] = useState<VendorFormData>({
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
    address: {
      state: "",
      city: "",
      pincode: 0,
      address_line: "",
    },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vendors");
      if (!response.ok) throw new Error("Failed to fetch vendors");
      const data = await response.json();
      setVendors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorDetails = async (vendorId: number) => {
    try {
      const response = await fetch(`/api/vendors/${vendorId}`);
      if (!response.ok) throw new Error("Failed to fetch vendor details");
      const data = await response.json();
      setSelectedVendor(data);
      setIsDetailsDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vendor details");
    }
  };

  const handleOpenAddDialog = () => {
    setEditingVendor(null);
    setFormData({
      vendor_name: "",
      vendor_email: "",
      vendor_phone: "",
      address: {
        state: "",
        city: "",
        pincode: 0,
        address_line: "",
      },
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (vendor: VendorWithAddress) => {
    setEditingVendor(vendor);
    setFormData({
      id: vendor.id,
      vendor_name: vendor.vendor_name,
      vendor_email: vendor.vendor_email,
      vendor_phone: vendor.vendor_phone,
      vendor_address_id: vendor.vendor_address,
      address: vendor.address
        ? {
            state: vendor.address.state || "",
            city: vendor.address.city || "",
            pincode: vendor.address.pincode || 0,
            address_line: vendor.address.address_line || "",
          }
        : {
            state: "",
            city: "",
            pincode: 0,
            address_line: "",
          },
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = editingVendor ? "PUT" : "POST";
      const response = await fetch("/api/vendors", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${editingVendor ? "update" : "create"} vendor`);
      }

      setSuccess(`Vendor ${editingVendor ? "updated" : "created"} successfully!`);
      setIsDialogOpen(false);
      await fetchVendors();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save vendor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (vendorId: number) => {
    if (!confirm("Are you sure you want to delete this vendor? This will fail if they have active purchase orders.")) {
      return;
    }

    try {
      const response = await fetch("/api/vendors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_id: vendorId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete vendor");
      }

      setSuccess("Vendor deleted successfully!");
      await fetchVendors();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete vendor");
    }
  };

  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendor_name.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
            <p className="text-muted-foreground">
              Manage suppliers and material vendors
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchVendors} variant="outline">
              Refresh
            </Button>
            <Button onClick={handleOpenAddDialog}>Add Vendor</Button>
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
                  Total Vendors
                </p>
                <span className="text-2xl">🏢</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{vendors.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Active suppliers</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  With Address
                </p>
                <span className="text-2xl">📍</span>
              </div>
              <p className="mt-2 text-3xl font-bold">
                {vendors.filter((v) => v.address !== null).length}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Complete profiles</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Search Results
                </p>
                <span className="text-2xl">🔍</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{filteredVendors.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Matching filter</p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="flex gap-4">
          <Input
            placeholder="Search by vendor name..."
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline" onClick={() => setFilterName("")}>
            Clear
          </Button>
        </div>

        {/* Vendors Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={`vendor-${i}`} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">ID</th>
                    <th className="p-3 text-left text-sm font-medium">Vendor Name</th>
                    <th className="p-3 text-left text-sm font-medium">Email</th>
                    <th className="p-3 text-left text-sm font-medium">Phone</th>
                    <th className="p-3 text-left text-sm font-medium">City, State</th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No vendors found
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-3 text-sm font-medium">#{vendor.id}</td>
                        <td className="p-3 text-sm font-medium">
                          {vendor.vendor_name}
                        </td>
                        <td className="p-3 text-sm">{vendor.vendor_email}</td>
                        <td className="p-3 text-sm">{vendor.vendor_phone}</td>
                        <td className="p-3 text-sm">
                          {vendor.address
                            ? `${vendor.address.city || "N/A"}, ${vendor.address.state || "N/A"}`
                            : "No address"}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => fetchVendorDetails(vendor.id)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditDialog(vendor)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(vendor.id)}
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

        {/* Add/Edit Vendor Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVendor ? "Edit Vendor" : "Add New Vendor"}
              </DialogTitle>
              <DialogDescription>
                {editingVendor
                  ? "Update vendor information and address details."
                  : "Enter vendor information and address details."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vendor_name">Vendor Name *</Label>
                  <Input
                    id="vendor_name"
                    required
                    value={formData.vendor_name}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor_name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor_phone">Phone *</Label>
                  <Input
                    id="vendor_phone"
                    required
                    value={formData.vendor_phone}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor_phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="vendor_email">Email *</Label>
                  <Input
                    id="vendor_email"
                    type="email"
                    required
                    value={formData.vendor_email}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor_email: e.target.value })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Address Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="address_line">Address Line</Label>
                  <Input
                    id="address_line"
                    value={formData.address?.address_line}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address!, address_line: e.target.value },
                      })
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.address?.city}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, city: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.address?.state}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: { ...formData.address!, state: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      type="number"
                      value={formData.address?.pincode || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          address: {
                            ...formData.address!,
                            pincode: parseInt(e.target.value, 10) || 0,
                          },
                        })
                      }
                    />
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
                    : editingVendor
                    ? "Update Vendor"
                    : "Add Vendor"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Vendor Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vendor Details</DialogTitle>
              <DialogDescription>
                Complete vendor information and purchase history
              </DialogDescription>
            </DialogHeader>

            {selectedVendor && (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Vendor Name
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedVendor.vendor_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedVendor.vendor_email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <p className="text-sm">{selectedVendor.vendor_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Purchase Orders
                    </p>
                    <p className="text-sm font-semibold">
                      {selectedVendor.purchase_orders_count}
                    </p>
                  </div>
                </div>

                <Separator />

                {selectedVendor.address && (
                  <>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold">Address</h3>
                      <div className="rounded-lg border p-4">
                        <p className="text-sm">
                          {selectedVendor.address.address_line || "N/A"}
                        </p>
                        <p className="text-sm">
                          {selectedVendor.address.city || "N/A"},{" "}
                          {selectedVendor.address.state || "N/A"} -{" "}
                          {selectedVendor.address.pincode || "N/A"}
                        </p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <div>
                  <h3 className="mb-2 text-sm font-semibold">Materials Supplied</h3>
                  {selectedVendor.materials_supplied.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.materials_supplied.map((material, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No materials supplied yet
                    </p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Bounded>
  );
}
