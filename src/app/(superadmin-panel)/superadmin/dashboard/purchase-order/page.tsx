"use client";

import { useEffect, useState } from "react";
import { Bounded } from "@/components/base/bounded";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { MaterialsInventoryResponse, PurchaseOrderItem } from "@/types/production";

export default function PurchaseOrderPage() {
  const [materials, setMaterials] = useState<MaterialsInventoryResponse | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderItem[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch materials inventory
      const materialsResponse = await fetch("/api/inventory/materials");
      if (!materialsResponse.ok) throw new Error("Failed to fetch materials");
      const materialsData = await materialsResponse.json();
      setMaterials(materialsData);

      // Fetch pending purchase orders
      const poResponse = await fetch("/api/purchase_order");
      if (!poResponse.ok) throw new Error("Failed to fetch purchase orders");
      const poData = await poResponse.json();
      setPurchaseOrders(poData);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (materialId: number, quantity: string) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      const newSelected = { ...selectedMaterials };
      delete newSelected[materialId];
      setSelectedMaterials(newSelected);
    } else {
      setSelectedMaterials({
        ...selectedMaterials,
        [materialId]: qty,
      });
    }
  };

  const handleCreatePurchaseOrder = async () => {
    if (Object.keys(selectedMaterials).length === 0) {
      setError("Please select at least one material and specify quantity");
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const response = await fetch("/api/purchase_order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedMaterials),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create purchase order");
      }

      const result = await response.json();
      setSuccess(`Purchase order created successfully! ${result.data.length} items ordered.`);
      setSelectedMaterials({});
      await fetchData();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create purchase order");
    } finally {
      setCreating(false);
    }
  };

  const totalSelectedCost = materials?.allMaterials
    .filter((m) => !m.isPen && selectedMaterials[m.id])
    .reduce(
      (sum, m) => sum + m.cost_p_gram * (selectedMaterials[m.id] || 0),
      0
    ) || 0;

  return (
    <Bounded>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Purchase Order Management</h1>
          <p className="text-muted-foreground">
            Create and manage purchase orders for raw materials
          </p>
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

        {/* Create Purchase Order Section */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Create New Purchase Order</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Select materials and specify quantities (in grams) to order
          </p>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={`materials-${i}`} className="h-16 w-full" />
              ))}
            </div>
          ) : materials ? (
            <>
              <div className="space-y-3">
                {materials.allMaterials
                  .filter((m) => !m.isPen)
                  .map((material) => (
                    <div
                      key={material.id}
                      className={`flex items-center gap-4 rounded border p-3 ${
                        selectedMaterials[material.id]
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium capitalize">
                          {material.material_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Current stock: {material.weight}g @ ₹{material.cost_p_gram}/g
                          {material.weight < 100 && (
                            <span className="ml-2 text-red-600 dark:text-red-400">
                              ⚠️ Low Stock
                            </span>
                          )}
                        </p>
                      </div>
                      <Input
                        type="number"
                        placeholder="Quantity (g)"
                        className="w-32"
                        value={selectedMaterials[material.id] || ""}
                        onChange={(e) =>
                          handleQuantityChange(material.id, e.target.value)
                        }
                      />
                      {selectedMaterials[material.id] && (
                        <div className="w-32 text-right text-sm font-medium">
                          ₹
                          {(
                            material.cost_p_gram * selectedMaterials[material.id]
                          ).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              {Object.keys(selectedMaterials).length > 0 && (
                <div className="mt-4 rounded-lg border bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Order Summary</p>
                      <p className="text-sm text-muted-foreground">
                        {Object.keys(selectedMaterials).length} material(s) selected
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-2xl font-bold">
                        ₹{totalSelectedCost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleCreatePurchaseOrder}
                  disabled={
                    creating || Object.keys(selectedMaterials).length === 0
                  }
                >
                  {creating ? "Creating..." : "Create Purchase Order"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedMaterials({})}
                  disabled={Object.keys(selectedMaterials).length === 0}
                >
                  Clear Selection
                </Button>
              </div>
            </>
          ) : null}
        </div>

        {/* Active Purchase Orders */}
        <div className="rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Active Purchase Orders ({purchaseOrders.length})
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Purchase orders awaiting delivery
          </p>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={`po-${i}`} className="h-16 w-full" />
              ))}
            </div>
          ) : purchaseOrders.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No active purchase orders
            </p>
          ) : (
            <div className="space-y-2">
              {purchaseOrders.map((po) => (
                <div
                  key={po.id}
                  className="flex items-center justify-between rounded border p-3 hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      PO-{po.id}: {po.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {po.quantity.toLocaleString()}g | Created:{" "}
                      {new Date(po.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ₹{po.total_cost.toLocaleString()}
                    </p>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                      ⏳ Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {purchaseOrders.length > 0 && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = "/superadmin/dashboard/purchase-order-receipts";
                }}
              >
                View All Purchase Orders →
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="mt-1 text-2xl font-bold">{purchaseOrders.length}</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Pending Value</p>
              <p className="mt-1 text-2xl font-bold">
                ₹
                {purchaseOrders
                  .reduce((sum, po) => sum + po.total_cost, 0)
                  .toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">
                {materials?.lowStockMaterials?.length || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </Bounded>
  );
}
