"use client";

import { useEffect, useState } from "react";
import { Bounded } from "@/components/base/bounded";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkOrder } from "@/types/orders";
import type { MaterialsInventoryResponse, PurchaseOrderItem } from "@/types/production";

interface DashboardMetrics {
  totalOrders: number;
  awaitingConfirmation: number;
  inProduction: number;
  completed: number;
  lowStockCount: number;
  pendingPurchaseOrders: number;
  totalInventoryValue: number;
}

export default function OverviewPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalOrders: 0,
    awaitingConfirmation: 0,
    inProduction: 0,
    completed: 0,
    lowStockCount: 0,
    pendingPurchaseOrders: 0,
    totalInventoryValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<WorkOrder[]>([]);
  const [lowStockMaterials, setLowStockMaterials] = useState<MaterialsInventoryResponse["lowStockMaterials"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all orders
      const ordersResponse = await fetch("/api/orders/bill_of_material/list");
      if (!ordersResponse.ok) throw new Error("Failed to fetch orders");
      const ordersData: WorkOrder[] = await ordersResponse.json();

      // Fetch materials inventory
      const materialsResponse = await fetch("/api/inventory/materials");
      if (!materialsResponse.ok) throw new Error("Failed to fetch materials");
      const materialsData: MaterialsInventoryResponse = await materialsResponse.json();

      // Fetch purchase orders
      const poResponse = await fetch("/api/purchase_order");
      if (!poResponse.ok) throw new Error("Failed to fetch purchase orders");
      const poData: PurchaseOrderItem[] = await poResponse.json();

      // Calculate metrics
      const awaitingConfirmation = ordersData.filter(
        (o) => o.status === "awaiting confirmation"
      ).length;
      const inProduction = ordersData.filter(
        (o) => o.status === "in production"
      ).length;
      const completed = ordersData.filter((o) => o.status === "completed").length;
      const pendingPO = poData.filter((po) => !po.isReceived).length;

      const totalInventoryValue = materialsData.allMaterials
        .filter((m) => !m.isPen)
        .reduce((sum, m) => sum + m.weight * m.cost_p_gram, 0);

      setMetrics({
        totalOrders: ordersData.length,
        awaitingConfirmation,
        inProduction,
        completed,
        lowStockCount: materialsData.lowStockMaterials.length,
        pendingPurchaseOrders: pendingPO,
        totalInventoryValue,
      });

      setRecentOrders(ordersData.slice(0, 5));
      setLowStockMaterials(materialsData.lowStockMaterials);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "awaiting confirmation":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "in production":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
            <p className="text-muted-foreground">
              Key metrics and recent activity for your manufacturing operations
            </p>
          </div>
          <Button onClick={fetchDashboardData} variant="outline">
            Refresh
          </Button>
        </div>

        <Separator />

        {error && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Metrics Cards */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Orders Metrics */}
              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <span className="text-2xl">📋</span>
                </div>
                <p className="mt-2 text-3xl font-bold">{metrics.totalOrders}</p>
                <p className="mt-1 text-xs text-muted-foreground">All work orders</p>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Awaiting Confirmation</p>
                  <span className="text-2xl">⏳</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {metrics.awaitingConfirmation}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Pending approval</p>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">In Production</p>
                  <span className="text-2xl">🔨</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {metrics.inProduction}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Active work orders</p>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <span className="text-2xl">✅</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  {metrics.completed}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Finished orders</p>
              </div>

              {/* Inventory Metrics */}
              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                  {metrics.lowStockCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Need restocking</p>
              </div>

              <div className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Pending POs</p>
                  <span className="text-2xl">📦</span>
                </div>
                <p className="mt-2 text-3xl font-bold">
                  {metrics.pendingPurchaseOrders}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Awaiting delivery</p>
              </div>

              <div className="rounded-lg border p-6 md:col-span-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Total Inventory Value</p>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="mt-2 text-3xl font-bold">
                  ₹{metrics.totalInventoryValue.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Raw materials value</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-lg border">
              <div className="border-b p-6">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <p className="text-sm text-muted-foreground">Latest work orders in the system</p>
              </div>
              <div className="p-6">
                {recentOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground">No orders found</p>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold">Order #{order.id}</p>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Quantity: {order.count} | Due: {order.end_date}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            window.location.href = `/superadmin/dashboard/orders?orderId=${order.id}`;
                          }}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockMaterials.length > 0 && (
              <div className="rounded-lg border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                <div className="border-b border-yellow-500 p-6">
                  <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200">
                    ⚠️ Low Stock Alert
                  </h2>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    These materials need to be restocked soon
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {lowStockMaterials.map((material) => (
                      <div
                        key={material.id}
                        className="flex items-center justify-between rounded-lg border border-yellow-500 bg-white p-3 dark:bg-neutral-900"
                      >
                        <div>
                          <p className="font-medium capitalize">{material.material_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Only {material.weight}g remaining
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            window.location.href = "/superadmin/dashboard/production?tab=request";
                          }}
                        >
                          Create PO
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-lg border p-6">
              <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <Button
                  onClick={() => {
                    window.location.href = "/superadmin/dashboard/orders";
                  }}
                >
                  View All Orders
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "/superadmin/dashboard/production";
                  }}
                  variant="outline"
                >
                  Production Control
                </Button>
                <Button
                  onClick={() => {
                    window.location.href = "/superadmin/dashboard/production?tab=request";
                  }}
                  variant="outline"
                >
                  Create Purchase Order
                </Button>
                <Button onClick={fetchDashboardData} variant="outline">
                  Refresh Data
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Bounded>
  );
}