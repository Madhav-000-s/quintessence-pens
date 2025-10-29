"use client";

import { useEffect, useState } from "react";
import { Bounded } from "@/components/base/bounded";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { PurchaseOrderItem } from "@/types/production";

export default function POReceiptsPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "received">("all");
  const [filterMaterial, setFilterMaterial] = useState("");

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      // We'll modify the API to return all POs, not just pending ones
      const response = await fetch("/api/purchase_order?all=true");
      if (!response.ok) throw new Error("Failed to fetch purchase orders");
      const data = await response.json();
      setPurchaseOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReceivePO = async (orderId: number) => {
    try {
      const response = await fetch("/api/purchase_order/receive", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) throw new Error("Failed to receive purchase order");

      setSuccess("Purchase order marked as received! Inventory updated.");
      await fetchPurchaseOrders();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to receive order");
    }
  };

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && !po.isReceived) ||
      (filterStatus === "received" && po.isReceived);

    const matchesMaterial =
      !filterMaterial ||
      po.name.toLowerCase().includes(filterMaterial.toLowerCase());

    return matchesStatus && matchesMaterial;
  });

  const pendingCount = purchaseOrders.filter((po) => !po.isReceived).length;
  const receivedCount = purchaseOrders.filter((po) => po.isReceived).length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + po.total_cost, 0);
  const pendingValue = purchaseOrders
    .filter((po) => !po.isReceived)
    .reduce((sum, po) => sum + po.total_cost, 0);

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Purchase Order Receipts
            </h1>
            <p className="text-muted-foreground">
              Track and manage incoming purchase orders
            </p>
          </div>
          <Button onClick={fetchPurchaseOrders} variant="outline">
            Refresh
          </Button>
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
                  Total POs
                </p>
                <span className="text-2xl">📋</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{purchaseOrders.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">All purchase orders</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <span className="text-2xl">⏳</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Awaiting delivery</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Received
                </p>
                <span className="text-2xl">✅</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {receivedCount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Completed orders</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Value
                </p>
                <span className="text-2xl">💰</span>
              </div>
              <p className="mt-2 text-3xl font-bold">
                ₹{pendingValue.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Out of ₹{totalValue.toLocaleString()} total
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pending")}
            >
              Pending ({pendingCount})
            </Button>
            <Button
              variant={filterStatus === "received" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("received")}
            >
              Received ({receivedCount})
            </Button>
          </div>
          <Input
            placeholder="Filter by material name..."
            value={filterMaterial}
            onChange={(e) => setFilterMaterial(e.target.value)}
            className="max-w-md"
          />
          <Button variant="outline" onClick={() => setFilterMaterial("")}>
            Clear
          </Button>
        </div>

        {/* Purchase Orders Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={`receipt-${i}`} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">PO ID</th>
                    <th className="p-3 text-left text-sm font-medium">Material</th>
                    <th className="p-3 text-right text-sm font-medium">
                      Quantity (g)
                    </th>
                    <th className="p-3 text-right text-sm font-medium">
                      Total Cost
                    </th>
                    <th className="p-3 text-left text-sm font-medium">
                      Created Date
                    </th>
                    <th className="p-3 text-left text-sm font-medium">Status</th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPOs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-8 text-center text-muted-foreground"
                      >
                        No purchase orders found
                      </td>
                    </tr>
                  ) : (
                    filteredPOs.map((po) => (
                      <tr
                        key={po.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-3 text-sm font-medium">PO-{po.id}</td>
                        <td className="p-3 text-sm capitalize">{po.name}</td>
                        <td className="p-3 text-right text-sm">
                          {po.quantity.toLocaleString()}
                        </td>
                        <td className="p-3 text-right text-sm">
                          ₹{po.total_cost.toLocaleString()}
                        </td>
                        <td className="p-3 text-sm">
                          {new Date(po.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          {po.isReceived ? (
                            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                              ✓ Received
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              ⏳ Pending
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {!po.isReceived && (
                            <Button
                              size="sm"
                              onClick={() => handleReceivePO(po.id)}
                            >
                              Mark as Received
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Bounded>
  );
}
