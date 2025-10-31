"use client";

import { useEffect, useState } from "react";
import { Bounded } from "@/components/base/bounded";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import PackingSlip from "@/components/shipping/packing-slip";

interface ShippingRecord {
  id: number;
  created_at: string;
  customer: number;
  arival_date: string | null;
  pen: number;
  total_count: number;
  defective_count: number;
  shipped_count: number;
}

interface ExtendedShippingRecord extends ShippingRecord {
  customer_details?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  pen_details?: {
    pentype: string;
    cost: number;
  };
  work_order?: {
    id: number;
    count: number;
    defective: number;
    status: string;
    grand_total: number;
    unit_cost: number;
  };
}

export default function ShippingPage() {
  const [records, setRecords] = useState<ExtendedShippingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPackingSlip, setShowPackingSlip] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<number | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shipping');
      if (!response.ok) throw new Error('Failed to fetch shipping records');

      const data = await response.json();
      setRecords(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load shipping records");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintPackingSlip = (shipmentId: number) => {
    setSelectedShipment(shipmentId);
    setShowPackingSlip(true);
  };

  const handleClosePackingSlip = () => {
    setShowPackingSlip(false);
    setSelectedShipment(null);
  };

  const totalShipments = records.length;
  const totalItemsShipped = records.reduce((sum, r) => sum + (r.shipped_count || 0), 0);
  const totalDefective = records.reduce((sum, r) => sum + (r.defective_count || 0), 0);

  return (
    <Bounded>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipping</h1>
            <p className="text-muted-foreground">
              Manage shipments and print packing slips
            </p>
          </div>
          <Button onClick={fetchRecords} variant="outline">
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
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Shipments
                </p>
                <span className="text-2xl">📦</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{totalShipments}</p>
              <p className="mt-1 text-xs text-muted-foreground">All time</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Items Shipped</p>
                <span className="text-2xl">✅</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {totalItemsShipped}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Successful items</p>
            </div>

            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Defective</p>
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {totalDefective}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Not shipped</p>
            </div>
          </div>
        )}

        {/* Shipping Records Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={`shipping-${i}`} className="h-16 w-full" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium">ID</th>
                    <th className="p-3 text-left text-sm font-medium">Work Order</th>
                    <th className="p-3 text-left text-sm font-medium">Customer</th>
                    <th className="p-3 text-left text-sm font-medium">Pen Type</th>
                    <th className="p-3 text-right text-sm font-medium">Total</th>
                    <th className="p-3 text-right text-sm font-medium">Shipped</th>
                    <th className="p-3 text-right text-sm font-medium">Defective</th>
                    <th className="p-3 text-left text-sm font-medium">
                      Arrival Date
                    </th>
                    <th className="p-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-muted-foreground">
                        No shipping records found
                      </td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr
                        key={record.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                      >
                        <td className="p-3 text-sm font-medium">#{record.id}</td>
                        <td className="p-3 text-sm">
                          {record.work_order ? (
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-blue-600 dark:text-blue-400">
                                WO #{record.work_order.id}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ${record.work_order.grand_total?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-3 text-sm">
                          {record.customer_details
                            ? `${record.customer_details.first_name} ${record.customer_details.last_name}`
                            : `Customer #${record.customer}`}
                        </td>
                        <td className="p-3 text-sm">
                          {record.pen_details?.pentype || `Pen #${record.pen}`}
                        </td>
                        <td className="p-3 text-right text-sm font-semibold">
                          {record.total_count}
                        </td>
                        <td className="p-3 text-right text-sm font-semibold text-green-600 dark:text-green-400">
                          {record.shipped_count}
                        </td>
                        <td className="p-3 text-right text-sm font-semibold text-red-600 dark:text-red-400">
                          {record.defective_count || 0}
                        </td>
                        <td className="p-3 text-sm">
                          {record.arival_date
                            ? new Date(record.arival_date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintPackingSlip(record.id)}
                          >
                            Print Packing Slip
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
      </div>

      {/* Packing Slip Modal/Print View */}
      {showPackingSlip && selectedShipment && (
        <PackingSlip
          shipmentId={selectedShipment}
          onClose={handleClosePackingSlip}
        />
      )}
    </Bounded>
  );
}
