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
import type { SuperadminWithCreator, CreateSuperadminResponse } from "@/types/superadmin";
import { generateSecurePassword } from "@/lib/auth/superadmin";

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<SuperadminWithCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/superadmin/users");
      if (!response.ok) throw new Error("Failed to fetch superadmins");
      const data = await response.json();
      setAdmins(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load superadmins");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setFormData({
      email: "",
      full_name: "",
      password: generateSecurePassword(),
    });
    setCreatedPassword(null);
    setIsDialogOpen(true);
  };

  const handleGeneratePassword = () => {
    setFormData({ ...formData, password: generateSecurePassword() });
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    setSuccess("Password copied to clipboard!");
    setTimeout(() => setSuccess(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/superadmin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: CreateSuperadminResponse = await response.json();

      if (!response.ok) {
        throw new Error((data as any).error?.message || "Failed to create superadmin");
      }

      setCreatedPassword(data.temporary_password);
      setSuccess("Superadmin created successfully!");
      await fetchAdmins();

      // Don't close dialog, show password
    } catch (err: any) {
      setError(err.message || "Failed to create superadmin");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/superadmin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Failed to update status");
      }

      setSuccess(`Superadmin ${!currentStatus ? "activated" : "deactivated"} successfully!`);
      await fetchAdmins();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update superadmin");
    }
  };

  const filteredAdmins = admins.filter((admin) =>
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = admins.filter((a) => a.is_active).length;
  const inactiveCount = admins.filter((a) => !a.is_active).length;

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCreatedPassword(null);
    setFormData({ email: "", full_name: "", password: "" });
  };

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Superadmins</h1>
            <p className="text-muted-foreground">
              Add and manage superadmin accounts
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchAdmins} variant="outline">
              Refresh
            </Button>
            <Button onClick={handleOpenAddDialog}>Add Superadmin</Button>
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
                  Total Superadmins
                </p>
                <span className="text-2xl">🛡️</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{admins.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">All administrators</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <span className="text-2xl">✅</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {activeCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Currently active</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                <span className="text-2xl">⏸️</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-600 dark:text-gray-400">
                {inactiveCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Deactivated</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-4">
          <Input
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Admins Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`admin-${i}`} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">Email</th>
                    <th className="p-3 text-left text-sm font-medium">Full Name</th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Last Login</th>
                    <th className="p-3 text-left text-sm font-medium">Created By</th>
                    <th className="p-3 text-left text-sm font-medium">Created At</th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No superadmins found
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-3 text-sm font-medium">{admin.email}</td>
                        <td className="p-3 text-sm">{admin.full_name || "-"}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              admin.is_active
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            }`}
                          >
                            {admin.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-3 text-sm">
                          {admin.last_login
                            ? new Date(admin.last_login).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="p-3 text-sm">
                          {admin.creator_email ? (
                            <div>
                              <div className="font-medium">{admin.creator_name || "Admin"}</div>
                              <div className="text-xs text-muted-foreground">{admin.creator_email}</div>
                            </div>
                          ) : (
                            "System"
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(admin.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant={admin.is_active ? "outline" : "default"}
                            onClick={() => handleToggleActive(admin.id, admin.is_active)}
                          >
                            {admin.is_active ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Superadmin Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Superadmin</DialogTitle>
              <DialogDescription>
                Create a new superadmin account. The generated password will be shown only once.
              </DialogDescription>
            </DialogHeader>

            {!createdPassword ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="admin@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Generated Password</Label>
                    <div className="flex gap-2">
                      <Input
                        id="password"
                        type="text"
                        value={formData.password}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGeneratePassword}
                      >
                        Regenerate
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCopyPassword}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Make sure to copy this password before creating the account
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Superadmin"}
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    ✅ Superadmin created successfully!
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Temporary Password</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={createdPassword}
                      readOnly
                      className="font-mono text-lg"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(createdPassword);
                        setSuccess("Password copied!");
                        setTimeout(() => setSuccess(null), 2000);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      ⚠️ This password will only be shown once. Make sure to copy it and share it securely with the new superadmin.
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleCloseDialog}>Done</Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Bounded>
  );
}
