"use client"

import React, { useState, useEffect } from 'react'
import SectionHeader from '../../production/section-header'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import type { WorkOrder } from '@/types/orders'

export default function WipQualityPanel() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<number | null>(null)
  const [defectiveQty, setDefectiveQty] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchWorkOrders()
  }, [])

  const fetchWorkOrders = async () => {
    try {
      const response = await fetch('/api/orders/bill_of_material/list')
      if (!response.ok) throw new Error('Failed to fetch work orders')
      const data = await response.json()
      // Only show orders in production
      setWorkOrders(data.filter((order: WorkOrder) => order.status === "in production"))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load work orders')
    }
  }

  const handleFinishProduction = async () => {
    if (!selectedWorkOrder) {
      setError("Please select a work order")
      return
    }

    if (!defectiveQty) {
      setError("Please enter defective quantity")
      return
    }

    const defective = parseInt(defectiveQty, 10)
    if (isNaN(defective) || defective < 0) {
      setError("Invalid defective quantity")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/production/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          work_order_id: selectedWorkOrder,
          defective: defective,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to finish production')
      }

      setSuccess("Production completed successfully! QA record created.")
      setDefectiveQty("")
      setSelectedWorkOrder(null)
      await fetchWorkOrders()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finish production')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="WIP picking and Quality"
        description="Set items required as WIP (stock picking), record produced and defective counts, then materials are deducted and items sent for quality inspection."
      />

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

      <div className="space-y-4 max-w-3xl">
        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-4">
          <h3 className="font-medium">Select Work Order</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Select an active work order in production to record output
          </p>
          <div className="mt-3 space-y-2">
            {workOrders.length === 0 ? (
              <p className="text-sm text-neutral-500">No active work orders in production</p>
            ) : (
              <select
                className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-background px-3 py-2"
                value={selectedWorkOrder || ""}
                onChange={(e) => setSelectedWorkOrder(parseInt(e.target.value, 10))}
              >
                <option value="">Select a work order...</option>
                {workOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    WO-{order.id} - Quantity: {order.count} - Due: {order.end_date}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-4">
          <h3 className="font-medium">Production output</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Enter the number of defective items found during production. Successfully produced items will be calculated automatically.
          </p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Defective quantity"
              type="number"
              min="0"
              value={defectiveQty}
              onChange={(e) => setDefectiveQty(e.target.value)}
              disabled={!selectedWorkOrder}
            />
            <Button
              onClick={handleFinishProduction}
              disabled={!selectedWorkOrder || loading}
            >
              {loading ? "Finishing..." : "Finish Production"}
            </Button>
          </div>
          {selectedWorkOrder && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              {defectiveQty && !isNaN(parseInt(defectiveQty, 10)) ? (
                <>
                  <span className="font-medium">Successful items: </span>
                  {workOrders.find(wo => wo.id === selectedWorkOrder)?.count! - parseInt(defectiveQty, 10)}
                  {" / "}
                  <span className="font-medium">Total: </span>
                  {workOrders.find(wo => wo.id === selectedWorkOrder)?.count}
                </>
              ) : (
                <>Total items ordered: {workOrders.find(wo => wo.id === selectedWorkOrder)?.count}</>
              )}
            </p>
          )}
        </div>

        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-4">
          <h3 className="font-medium">Quality inspection</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            After finishing production, defective materials are returned to inventory, a QA record is created, and good items await quality inspection.
          </p>
          <div className="mt-3 flex gap-3">
            <Button variant="outline" onClick={fetchWorkOrders}>
              Refresh Work Orders
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
