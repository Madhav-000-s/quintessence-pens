"use client"

import React, { useEffect, useState } from 'react'
import SectionHeader from '../../production/section-header'
import { Separator } from '../../ui/separator'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { Skeleton } from '../../ui/skeleton'
import type { MaterialsInventoryResponse } from '@/types/production'
import type { WorkOrder } from '@/types/orders'

export default function SchedulePanel() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [materials, setMaterials] = useState<MaterialsInventoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch work orders
      const ordersResponse = await fetch('/api/orders/bill_of_material/list')
      if (!ordersResponse.ok) throw new Error('Failed to fetch work orders')
      const ordersData = await ordersResponse.json()
      setWorkOrders(ordersData)

      // Fetch materials inventory
      const materialsResponse = await fetch('/api/inventory/materials')
      if (!materialsResponse.ok) throw new Error('Failed to fetch materials')
      const materialsData = await materialsResponse.json()
      setMaterials(materialsData)

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleStartProduction = async (workOrderId: number) => {
    try {
      const response = await fetch('/api/production/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work_order_id: workOrderId }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to start production')
      }

      await fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start production')
    }
  }

  const filteredOrders = workOrders.filter((order) => {
    const matchesSearch = !searchTerm ||
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDateFrom = !dateFrom || order.start_date >= dateFrom
    const matchesDateTo = !dateTo || order.end_date <= dateTo

    return matchesSearch && matchesDateFrom && matchesDateTo
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "awaiting confirmation":
        return "text-yellow-600 dark:text-yellow-400"
      case "in production":
        return "text-blue-600 dark:text-blue-400"
      case "completed":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Schedule details"
        description="Details regarding the items to produce and the schedule specific to the work center. Move necessary items into WIP and navigate to production control when needed."
      />

      {/* Low Stock Alert */}
      {materials && materials.lowStockMaterials.length > 0 && (
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <h4 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
            ⚠️ Low Stock Alert
          </h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            The following materials are running low:{' '}
            {materials.lowStockMaterials.map((m) => `${m.material_name} (${m.weight}g)`).join(', ')}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 flex items-center gap-3">
          <span className="text-sm font-medium">Filter Mechanism</span>
        </div>
        <Separator />
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Search work order or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Input
            placeholder="Date from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            placeholder="Date to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {
              setSearchTerm("")
              setDateFrom("")
              setDateTo("")
            }}>
              Reset
            </Button>
            <Button variant="outline" onClick={fetchData}>
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
              <tr>
                <th className="text-left px-4 py-3">Work Order</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Quantity</th>
                <th className="text-left px-4 py-3">Start Date</th>
                <th className="text-left px-4 py-3">Due Date</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    No work orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
                    <td className="px-4 py-3 font-medium">WO-{order.id}</td>
                    <td className={`px-4 py-3 font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </td>
                    <td className="px-4 py-3 text-right">{order.count.toLocaleString()}</td>
                    <td className="px-4 py-3">{order.start_date}</td>
                    <td className="px-4 py-3">{order.end_date}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-2">
                        {order.status === "awaiting confirmation" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartProduction(order.id)}
                          >
                            Start Production
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => {
                            window.location.href = `/superadmin/dashboard/orders?orderId=${order.id}`
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Materials Inventory Summary */}
      {materials && (
        <div className="rounded-lg border p-4">
          <h4 className="mb-3 font-semibold">Materials Inventory</h4>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {materials.allMaterials.filter(m => !m.isPen).slice(0, 6).map((material) => (
              <div key={material.id} className="rounded border p-3">
                <p className="font-medium capitalize">{material.material_name}</p>
                <p className="text-sm text-muted-foreground">
                  Available: {material.weight}g @ ₹{material.cost_p_gram}/g
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
