"use client";

import { useEffect, useState } from "react";
import { Bounded } from "@/components/base/bounded";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WorkOrder, BillOfMaterial } from "@/types/orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detailedBOM, setDetailedBOM] = useState<BillOfMaterial | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCustomer, setFilterCustomer] = useState("");

  // Fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/orders/bill_of_material/list");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed BOM
  const fetchOrderDetail = async (orderId: number) => {
    try {
      setLoadingDetail(true);
      const response = await fetch(
        `/api/orders/bill_of_material?work_order_id=${orderId}`
      );
      if (!response.ok) throw new Error("Failed to fetch order details");
      const data = await response.json();
      setDetailedBOM(data);
      setSelectedOrderId(orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load details");
    } finally {
      setLoadingDetail(false);
    }
  };

  // Accept order
  const handleAcceptOrder = async (orderId: number) => {
    try {
      const response = await fetch("/api/orders/accept", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) throw new Error("Failed to accept order");
      await fetchOrders();
      if (selectedOrderId === orderId) {
        await fetchOrderDetail(orderId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to accept order");
    }
  };

  // Update schedule
  const handleUpdateSchedule = async (
    orderId: number,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await fetch("/api/orders/schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, start_date: startDate, end_date: endDate }),
      });
      if (!response.ok) throw new Error("Failed to update schedule");
      await fetchOrders();
      if (selectedOrderId === orderId) {
        await fetchOrderDetail(orderId);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update schedule"
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = !filterStatus || order.status.toLowerCase().includes(filterStatus.toLowerCase());
    const matchesCustomer = !filterCustomer || order.customer_id.toString().includes(filterCustomer);
    return matchesStatus && matchesCustomer;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "awaiting confirmation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "in production":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Bounded>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
          <p className="text-muted-foreground">
            Manage bills of material, quotes, and order schedules
          </p>
        </div>

        <Separator />

        {error && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <Tabs defaultValue="list" className="w-full">
          <TabsList>
            <TabsTrigger value="list">Orders List</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedOrderId}>
              Order Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <Input
                placeholder="Filter by status..."
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="max-w-xs"
              />
              <Input
                placeholder="Filter by customer ID..."
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="outline" onClick={() => { setFilterStatus(""); setFilterCustomer(""); }}>
                Clear
              </Button>
              <Button onClick={fetchOrders} variant="outline">
                Refresh
              </Button>
            </div>

            {/* Orders Table */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium">Order ID</th>
                        <th className="p-3 text-left text-sm font-medium">Status</th>
                        <th className="p-3 text-left text-sm font-medium">Quantity</th>
                        <th className="p-3 text-left text-sm font-medium">Start Date</th>
                        <th className="p-3 text-left text-sm font-medium">End Date</th>
                        <th className="p-3 text-left text-sm font-medium">Customer ID</th>
                        <th className="p-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            No orders found
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="border-b last:border-0 hover:bg-muted/50"
                          >
                            <td className="p-3 text-sm font-medium">#{order.id}</td>
                            <td className="p-3">
                              <span
                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3 text-sm">{order.count}</td>
                            <td className="p-3 text-sm">{order.start_date}</td>
                            <td className="p-3 text-sm">{order.end_date}</td>
                            <td className="p-3 text-sm">{order.customer_id}</td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => fetchOrderDetail(order.id)}
                                >
                                  View Details
                                </Button>
                                {order.status === "awaiting confirmation" && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleAcceptOrder(order.id)}
                                  >
                                    Accept
                                  </Button>
                                )}
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
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {loadingDetail ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : detailedBOM ? (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="rounded-lg border p-6">
                  <h2 className="mb-4 text-xl font-semibold">Order #{detailedBOM.id}</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(detailedBOM.status)}`}
                      >
                        {detailedBOM.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="text-lg font-medium">{detailedBOM.count} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit Cost</p>
                      <p className="text-lg font-medium">
                        {detailedBOM.cost_division.currency} {detailedBOM.unit_cost.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Subtotal</p>
                      <p className="text-lg font-medium">
                        {detailedBOM.cost_division.currency} {detailedBOM.subtotal.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tax ({detailedBOM.cost_division.taxPercent}%)</p>
                      <p className="text-lg font-medium">
                        {detailedBOM.cost_division.currency} {detailedBOM.tax_amt.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Grand Total</p>
                      <p className="text-lg font-bold">
                        {detailedBOM.cost_division.currency} {detailedBOM.grand_total.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Customer Information</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">
                        {detailedBOM.customer.first_name} {detailedBOM.customer.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{detailedBOM.customer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{detailedBOM.customer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Status</p>
                      <p className="font-medium">
                        {detailedBOM.isPaid ? "Paid" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Material Requirements */}
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Material Requirements</h3>
                  {!detailedBOM.requiredMaterials.allAvailable && (
                    <div className="mb-4 rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        ⚠️ Some materials are not available in sufficient quantity
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {detailedBOM.requiredMaterials.items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-lg border p-3 ${!item.isAvailable ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : ""}`}
                      >
                        <div>
                          <p className="font-medium capitalize">{item.material}</p>
                          <p className="text-sm text-muted-foreground">
                            Required: {item.requestedGrams}g | Available: {item.availableGrams}g
                          </p>
                        </div>
                        <div>
                          {item.isAvailable ? (
                            <span className="text-sm text-green-600 dark:text-green-400">
                              ✓ Available
                            </span>
                          ) : (
                            <span className="text-sm text-yellow-600 dark:text-yellow-400">
                              ⚠️ Insufficient
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule Update */}
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Production Schedule</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Start Date
                      </label>
                      <Input
                        type="date"
                        defaultValue={detailedBOM.start_date}
                        id="start-date"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        End Date
                      </label>
                      <Input
                        type="date"
                        defaultValue={detailedBOM.end_date}
                        id="end-date"
                      />
                    </div>
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      const startDate = (document.getElementById("start-date") as HTMLInputElement).value;
                      const endDate = (document.getElementById("end-date") as HTMLInputElement).value;
                      handleUpdateSchedule(detailedBOM.id, startDate, endDate);
                    }}
                  >
                    Update Schedule
                  </Button>
                </div>

                {/* Cost Breakdown */}
                <div className="rounded-lg border p-6">
                  <h3 className="mb-4 text-lg font-semibold">Cost Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Labour</span>
                      <span className="font-medium">
                        {detailedBOM.cost_division.currency} {detailedBOM.cost_division.labourTotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Packaging (per unit)</span>
                      <span className="font-medium">
                        {detailedBOM.cost_division.currency} {detailedBOM.cost_division.packagingCostPerUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {detailedBOM.cost_division.currency} {detailedBOM.cost_division.shippingTotal}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold">Total (before tax)</span>
                      <span className="font-semibold">
                        {detailedBOM.cost_division.currency} {detailedBOM.subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border p-8 text-center text-muted-foreground">
                Select an order from the list to view details
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Bounded>
  );
}