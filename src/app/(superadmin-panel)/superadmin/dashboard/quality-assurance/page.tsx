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
import { supabase, serviceClient } from "@/supabase-client";

interface QARecord {
  id: number;
  created_at: string;
  work_order_id: number | null;
  inspector_name: string;
  inspection_date: string;
  status: "passed" | "failed" | "pending";
  defects_found: number;
  defect_description: string | null;
  notes: string | null;
  work_order?: {
    id: number;
    count: number;
    defective: number;
    status: string;
    customer?: {
      first_name: string;
      last_name: string;
      email: string;
    };
    pen_details?: {
      pentype: string;
      cost: number;
    };
  };
}

export default function QAPage() {
  const [records, setRecords] = useState<QARecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<QARecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    inspector_name: "",
    inspection_date: new Date().toISOString().split("T")[0],
    status: "pending" as "passed" | "failed" | "pending",
    defects_found: 0,
    defect_description: "",
    notes: "",
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/qa');
      if (!response.ok) throw new Error('Failed to fetch QA records');

      const data = await response.json();
      setRecords(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load QA records");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingRecord(null);
    setFormData({
      inspector_name: "",
      inspection_date: new Date().toISOString().split("T")[0],
      status: "pending",
      defects_found: 0,
      defect_description: "",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (record: QARecord) => {
    setEditingRecord(record);
    setFormData({
      inspector_name: record.inspector_name,
      inspection_date: record.inspection_date,
      status: record.status,
      defects_found: record.defects_found,
      defect_description: record.defect_description || "",
      notes: record.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingRecord) {
        const response = await fetch(`/api/qa?id=${editingRecord.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to update QA record');
        setSuccess("QA record updated successfully!");
      } else {
        const response = await fetch('/api/qa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Failed to create QA record');
        setSuccess("QA record created successfully!");
      }

      setIsDialogOpen(false);
      await fetchRecords();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save QA record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this QA record?")) return;

    try {
      const response = await fetch(`/api/qa?id=${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete QA record');

      setSuccess("QA record deleted successfully!");
      await fetchRecords();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete QA record");
    }
  };

  const handlePassQA = async (record: QARecord) => {
    if (!confirm("Mark this QA inspection as passed? This will create a shipping record.")) return;

    try {
      setSubmitting(true);

      // Call pass QA API endpoint
      const response = await fetch('/api/qa/pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qa_id: record.id, work_order_id: record.work_order_id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to pass QA');
      }

      setSuccess("QA passed! Shipping record created successfully.");
      await fetchRecords();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to pass QA and create shipping record");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter((record) =>
    filterStatus === "all" ? true : record.status === filterStatus
  );

  const passedCount = records.filter((r) => r.status === "passed").length;
  const failedCount = records.filter((r) => r.status === "failed").length;
  const pendingCount = records.filter((r) => r.status === "pending").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "";
    }
  };

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quality Assurance</h1>
            <p className="text-muted-foreground">
              Manage quality inspections and defect tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchRecords} variant="outline">
              Refresh
            </Button>
            <Button onClick={handleOpenAddDialog}>Add QA Record</Button>
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
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Inspections
                </p>
                <span className="text-2xl">📋</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{records.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">All time</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Passed</p>
                <span className="text-2xl">✅</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {passedCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {records.length > 0
                  ? ((passedCount / records.length) * 100).toFixed(1)
                  : 0}
                % pass rate
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <span className="text-2xl">❌</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {failedCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Needs rework</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <span className="text-2xl">⏳</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Awaiting inspection</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All ({records.length})
          </Button>
          <Button
            variant={filterStatus === "passed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("passed")}
          >
            Passed ({passedCount})
          </Button>
          <Button
            variant={filterStatus === "failed" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("failed")}
          >
            Failed ({failedCount})
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
          >
            Pending ({pendingCount})
          </Button>
        </div>

        {/* QA Records Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`qa-${i}`} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">ID</th>
                    <th className="p-3 text-left text-sm font-medium">Work Order Details</th>
                    <th className="p-3 text-left text-sm font-medium">Inspector</th>
                    <th className="p-3 text-left text-sm font-medium">
                      Inspection Date
                    </th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-right text-sm font-medium">
                      Defects Found
                    </th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-muted-foreground">
                        No QA records found
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-3 text-sm font-medium">#{record.id}</td>
                        <td className="p-3 text-sm">
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              WO #{record.work_order_id || 'N/A'}
                            </span>
                            {record.work_order && (
                              <>
                                <span className="text-xs text-muted-foreground">
                                  {record.work_order.count} pens ({record.work_order.pen_details?.pentype || 'Unknown Type'})
                                </span>
                                {record.work_order.customer && (
                                  <span className="text-xs text-muted-foreground">
                                    Customer: {record.work_order.customer.first_name} {record.work_order.customer.last_name}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-sm">{record.inspector_name}</td>
                        <td className="p-3 text-sm">
                          {new Date(record.inspection_date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(record.status)}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="p-3 text-right text-sm font-semibold">
                          {record.defects_found}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            {record.status === "pending" && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handlePassQA(record)}
                                disabled={submitting}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Pass QA
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenEditDialog(record)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(record.id)}
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
                {editingRecord ? "Edit QA Record" : "Add New QA Record"}
              </DialogTitle>
              <DialogDescription>
                {editingRecord
                  ? "Update quality inspection details."
                  : "Record a new quality inspection."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inspector_name">Inspector Name *</Label>
                  <Input
                    id="inspector_name"
                    required
                    value={formData.inspector_name}
                    onChange={(e) =>
                      setFormData({ ...formData, inspector_name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspection_date">Inspection Date *</Label>
                  <Input
                    id="inspection_date"
                    type="date"
                    required
                    value={formData.inspection_date}
                    onChange={(e) =>
                      setFormData({ ...formData, inspection_date: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as any })
                    }
                    className="w-full rounded border p-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Note: Use the "Pass QA" button to mark as passed (this creates a shipping record)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defects_found">Defects Found *</Label>
                  <Input
                    id="defects_found"
                    type="number"
                    min="0"
                    required
                    value={formData.defects_found}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defects_found: parseInt(e.target.value, 10),
                      })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="defect_description">Defect Description</Label>
                  <Input
                    id="defect_description"
                    value={formData.defect_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        defect_description: e.target.value,
                      })
                    }
                    placeholder="Describe any defects found"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full rounded border p-2"
                    rows={3}
                    placeholder="Additional inspection notes"
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
                    : editingRecord
                    ? "Update Record"
                    : "Create Record"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Bounded>
  );
}
