"use client";

import { useEffect, useState } from "react";
import { Bounded } from "@/components/base/bounded";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { InventoryMaterial, MaterialsInventoryResponse } from "@/types/production";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryMaterial[]>([]);
  const [materials, setMaterials] = useState<MaterialsInventoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState("");
  const [filterType, setFilterType] = useState<"all" | "materials" | "pens">("all");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);

      // Fetch all inventory
      const invResponse = await fetch("/api/inventory");
      if (!invResponse.ok) throw new Error("Failed to fetch inventory");
      const invData = await invResponse.json();
      setInventory(invData);

      // Fetch materials with low stock alerts
      const materialsResponse = await fetch("/api/inventory/materials");
      if (!materialsResponse.ok) throw new Error("Failed to fetch materials");
      const materialsData = await materialsResponse.json();
      setMaterials(materialsData);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesName =
      !filterName ||
      item.material_name.toLowerCase().includes(filterName.toLowerCase());

    const matchesType =
      filterType === "all" ||
      (filterType === "materials" && !item.isPen) ||
      (filterType === "pens" && item.isPen);

    return matchesName && matchesType;
  });

  const getStockStatus = (weight: number, isPen: boolean) => {
    if (isPen) return "stock";
    if (weight < 100) return "low";
    if (weight < 500) return "medium";
    return "high";
  };

  const getStockColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const totalInventoryValue = inventory
    .filter((item) => !item.isPen)
    .reduce((sum, item) => sum + item.weight * item.cost_p_gram, 0);

  const rawMaterialsCount = inventory.filter((item) => !item.isPen).length;
  const finishedPensCount = inventory.filter((item) => item.isPen).length;

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Inventory Management
            </h1>
            <p className="text-muted-foreground">
              Track raw materials and finished goods inventory
            </p>
          </div>
          <Button onClick={fetchInventory} variant="outline">
            Refresh
          </Button>
        </div>

        <Separator />

        {error && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Raw Materials
                </p>
                <span className="text-2xl">📦</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{rawMaterialsCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Different material types
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Finished Pens
                </p>
                <span className="text-2xl">✒️</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{finishedPensCount}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ready for shipment
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Value
                </p>
                <span className="text-2xl">💰</span>
              </div>
              <p className="mt-2 text-3xl font-bold">
                ₹{totalInventoryValue.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Raw materials only
              </p>
            </div>
          </div>
        )}

        <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilterType(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="materials">Raw Materials</TabsTrigger>
            <TabsTrigger value="pens">Finished Pens</TabsTrigger>
          </TabsList>

          <TabsContent value={filterType} className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <Input
                placeholder="Search by material name..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="max-w-md"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setFilterName("");
                }}
              >
                Clear
              </Button>
            </div>

            {/* Inventory Table */}
            {loading ? (
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={`inventory-${i}`} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium">ID</th>
                        <th className="p-3 text-left text-sm font-medium">
                          Material Name
                        </th>
                        <th className="p-3 text-left text-sm font-medium">Type</th>
                        <th className="p-3 text-right text-sm font-medium">
                          Stock (g)
                        </th>
                        <th className="p-3 text-right text-sm font-medium">
                          Cost/g
                        </th>
                        <th className="p-3 text-right text-sm font-medium">
                          Total Value
                        </th>
                        <th className="p-3 text-left text-sm font-medium">Status</th>
                        <th className="p-3 text-left text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInventory.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="p-8 text-center text-muted-foreground"
                          >
                            No inventory items found
                          </td>
                        </tr>
                      ) : (
                        filteredInventory.map((item) => {
                          const stockStatus = getStockStatus(
                            item.weight,
                            item.isPen
                          );
                          return (
                            <tr
                              key={item.id}
                              className="border-b last:border-0 hover:bg-muted/50"
                            >
                              <td className="p-3 text-sm font-medium">#{item.id}</td>
                              <td className="p-3 text-sm capitalize">
                                {item.material_name}
                              </td>
                              <td className="p-3 text-sm">
                                {item.isPen ? "Finished Pen" : "Raw Material"}
                              </td>
                              <td className="p-3 text-right text-sm">
                                {item.weight.toLocaleString()}
                              </td>
                              <td className="p-3 text-right text-sm">
                                {!item.isPen ? `₹${item.cost_p_gram}` : "-"}
                              </td>
                              <td className="p-3 text-right text-sm">
                                {!item.isPen
                                  ? `₹${(item.weight * item.cost_p_gram).toLocaleString()}`
                                  : "-"}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStockColor(stockStatus)}`}
                                >
                                  {stockStatus === "low" && "⚠️ Low Stock"}
                                  {stockStatus === "medium" && "⚡ Medium"}
                                  {stockStatus === "high" && "✓ Good"}
                                  {stockStatus === "stock" && "📦 In Stock"}
                                </span>
                              </td>
                              <td className="p-3">
                                {!item.isPen && stockStatus === "low" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      window.location.href =
                                        "/superadmin/dashboard/production?tab=request";
                                    }}
                                  >
                                    Create PO
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Low Stock Alert */}
        {materials && materials.lowStockMaterials && materials.lowStockMaterials.length > 0 && (
          <div className="rounded-lg border border-red-500 bg-red-50 dark:bg-red-900/20">
            <div className="border-b border-red-500 p-6">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200">
                🚨 Critical Low Stock Alert
              </h2>
              <p className="text-sm text-red-700 dark:text-red-300">
                These materials are critically low and need immediate restocking
              </p>
            </div>
            <div className="p-6">
              <div className="grid gap-3 md:grid-cols-2">
                {materials.lowStockMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between rounded-lg border border-red-500 bg-white p-4 dark:bg-neutral-900"
                  >
                    <div>
                      <p className="font-medium capitalize">
                        {material.material_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Only {material.weight}g remaining
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        window.location.href =
                          "/superadmin/dashboard/production?tab=request";
                      }}
                    >
                      Order Now
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Bounded>
  );
}
