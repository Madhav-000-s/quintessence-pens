"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PackingSlipProps {
  shipmentId: number;
  onClose: () => void;
}

interface ShipmentDetails {
  id: number;
  created_at: string;
  customer: number;
  arival_date: string | null;
  pen: number;
  total_count: number;
  defective_count: number;
  shipped_count: number;
  customer_details?: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    id: number;
  };
  pen_details?: {
    pentype: string;
    cost: number;
    nibtype_id: number | null;
    ink_type_id: number | null;
    cap_type_id: number | null;
    barrel_id: number | null;
  };
  work_order?: {
    id: number;
    grand_total: number;
    unit_cost: number;
    subtotal: number;
    tax_amt: number;
    start_date: string;
    end_date: string;
  };
  qa_record?: {
    inspector_name: string;
    inspection_date: string;
    status: string;
    defects_found: number;
    defect_description: string | null;
  };
}

export default function PackingSlip({ shipmentId, onClose }: PackingSlipProps) {
  const [shipment, setShipment] = useState<ShipmentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShipmentDetails();
  }, [shipmentId]);

  const fetchShipmentDetails = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/shipping/${shipmentId}`);
      if (!response.ok) throw new Error('Failed to fetch shipment details');

      const data = await response.json();
      setShipment(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load shipment details");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Loading Packing Slip...</DialogTitle>
          </DialogHeader>
          <div className="p-8 text-center">Loading shipment details...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !shipment) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="p-8 text-center text-red-600">{error || "Shipment not found"}</div>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #packing-slip-content,
          #packing-slip-content * {
            visibility: visible;
          }
          #packing-slip-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="no-print">
            <DialogTitle>Packing Slip - Shipment #{shipmentId}</DialogTitle>
          </DialogHeader>

          <div id="packing-slip-content" className="p-8 bg-white text-black">
            {/* Header */}
            <div className="border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-3xl font-bold">QUINTESSENCE PENS</h1>
              <p className="text-sm text-gray-600 mt-1">Luxury Fountain Pens</p>
              <p className="text-lg font-semibold mt-2">PACKING SLIP</p>
            </div>

            {/* Shipment and Customer Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2 border-b border-gray-400">
                  Shipment Information
                </h2>
                <p className="text-sm mb-1">
                  <span className="font-medium">Shipment ID:</span> #{shipment.id}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Ship Date:</span>{" "}
                  {new Date(shipment.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm mb-1">
                  <span className="font-medium">Expected Arrival:</span>{" "}
                  {shipment.arival_date
                    ? new Date(shipment.arival_date).toLocaleDateString()
                    : "TBD"}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 border-b border-gray-400">
                  Customer Details
                </h2>
                <p className="text-sm mb-1">
                  <span className="font-medium">Name:</span>{" "}
                  {shipment.customer_details
                    ? `${shipment.customer_details.first_name} ${shipment.customer_details.last_name}`
                    : `Customer #${shipment.customer}`}
                </p>
                {shipment.customer_details && (
                  <>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Email:</span>{" "}
                      {shipment.customer_details.email}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Phone:</span>{" "}
                      {shipment.customer_details.phone || "N/A"}
                    </p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Customer ID:</span> #
                      {shipment.customer_details.id}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Order Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 border-b border-gray-400">
                Order Details
              </h2>
              {shipment.work_order && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Work Order ID:</span> #
                    {shipment.work_order.id}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Production Period:</span>{" "}
                    {shipment.work_order.start_date} to {shipment.work_order.end_date}
                  </p>
                </div>
              )}

              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Item</th>
                    <th className="border border-gray-300 p-2 text-center">
                      Total Ordered
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Shipped Qty
                    </th>
                    <th className="border border-gray-300 p-2 text-center">
                      Defective
                    </th>
                    <th className="border border-gray-300 p-2 text-right">
                      Unit Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">
                      <div>
                        <p className="font-medium">
                          {shipment.pen_details?.pentype || `Pen #${shipment.pen}`}
                        </p>
                        <p className="text-xs text-gray-600">
                          Custom Fountain Pen Configuration
                        </p>
                      </div>
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-semibold">
                      {shipment.total_count}
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-semibold text-green-700">
                      {shipment.shipped_count}
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-semibold text-red-700">
                      {shipment.defective_count || 0}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">
                      $
                      {shipment.work_order?.unit_cost?.toFixed(2) ||
                        shipment.pen_details?.cost?.toFixed(2) ||
                        "0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {shipment.work_order && (
                <div className="mt-4 flex justify-end">
                  <div className="w-64 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${shipment.work_order.subtotal?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${shipment.work_order.tax_amt?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-400 pt-1 font-bold">
                      <span>Grand Total:</span>
                      <span>
                        ${shipment.work_order.grand_total?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pen Configuration Details */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 border-b border-gray-400">
                Pen Configuration
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="font-medium">Pen Type:</span>{" "}
                  {shipment.pen_details?.pentype || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Nib Configuration ID:</span>{" "}
                  {shipment.pen_details?.nibtype_id || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Ink Type ID:</span>{" "}
                  {shipment.pen_details?.ink_type_id || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Cap Configuration ID:</span>{" "}
                  {shipment.pen_details?.cap_type_id || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Barrel Configuration ID:</span>{" "}
                  {shipment.pen_details?.barrel_id || "N/A"}
                </p>
              </div>
            </div>

            {/* QA Information */}
            {shipment.qa_record && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 border-b border-gray-400">
                  Quality Assurance
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <span className="font-medium">Inspector:</span>{" "}
                    {shipment.qa_record.inspector_name}
                  </p>
                  <p>
                    <span className="font-medium">Inspection Date:</span>{" "}
                    {new Date(shipment.qa_record.inspection_date).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="capitalize font-semibold text-green-700">
                      {shipment.qa_record.status}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Defects Found:</span>{" "}
                    {shipment.qa_record.defects_found}
                  </p>
                  {shipment.qa_record.defect_description && (
                    <p className="col-span-2">
                      <span className="font-medium">Defect Description:</span>{" "}
                      {shipment.qa_record.defect_description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Footer Notes */}
            <div className="border-t-2 border-gray-800 pt-4 mt-8 text-xs text-gray-600">
              <p className="mb-2">
                <span className="font-semibold">Note:</span> Please inspect your shipment
                upon arrival. Contact us immediately if there are any issues.
              </p>
              <p className="mb-2">
                Thank you for choosing Quintessence Pens for your luxury writing needs.
              </p>
              <p className="font-semibold">
                For support, please contact us at support@quintessencepens.com
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 no-print mt-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button onClick={handlePrint}>Print Packing Slip</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
