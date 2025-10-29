"use client"

import React, { useState, useEffect } from 'react'
import SectionHeader from '../../production/section-header'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import type { MaterialsInventoryResponse, PurchaseOrderItem } from '@/types/production'

export default function RequestPanel() {
  const [materials, setMaterials] = useState<MaterialsInventoryResponse | null>(null)
  const [selectedMaterials, setSelectedMaterials] = useState<Record<number, number>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderItem[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch materials inventory
      const materialsResponse = await fetch('/api/inventory/materials')
      if (!materialsResponse.ok) throw new Error('Failed to fetch materials')
      const materialsData = await materialsResponse.json()
      setMaterials(materialsData)

      // Fetch existing purchase orders
      const poResponse = await fetch('/api/purchase_order')
      if (!poResponse.ok) throw new Error('Failed to fetch purchase orders')
      const poData = await poResponse.json()
      setPurchaseOrders(poData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    }
  }

  const handleQuantityChange = (materialId: number, quantity: string) => {
    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty <= 0) {
      const newSelected = { ...selectedMaterials }
      delete newSelected[materialId]
      setSelectedMaterials(newSelected)
    } else {
      setSelectedMaterials({
        ...selectedMaterials,
        [materialId]: qty,
      })
    }
  }

  const handleCreatePurchaseOrder = async () => {
    if (Object.keys(selectedMaterials).length === 0) {
      setError("Please select at least one material and specify quantity")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/purchase_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedMaterials),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || 'Failed to create purchase order')
      }

      const result = await response.json()
      setSuccess(`Purchase order created successfully! ${result.data.length} items ordered.`)
      setSelectedMaterials({})
      await fetchData()

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create purchase order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Request resources"
        description="Create purchase orders for materials that are low in stock or needed for production."
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

      <div className="rounded-lg border p-4">
        <h3 className="mb-4 font-semibold">Create Purchase Order</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Select materials and specify quantities (in grams) to order
        </p>

        {materials && (
          <div className="space-y-3">
            {materials.allMaterials
              .filter((m) => !m.isPen)
              .map((material) => (
                <div
                  key={material.id}
                  className="flex items-center gap-4 rounded border p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium capitalize">{material.material_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Current stock: {material.weight}g @ ₹{material.cost_p_gram}/g
                    </p>
                  </div>
                  <Input
                    type="number"
                    placeholder="Quantity (g)"
                    className="w-32"
                    value={selectedMaterials[material.id] || ""}
                    onChange={(e) => handleQuantityChange(material.id, e.target.value)}
                  />
                </div>
              ))}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleCreatePurchaseOrder}
            disabled={loading || Object.keys(selectedMaterials).length === 0}
          >
            {loading ? "Creating..." : "Create Purchase Order"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedMaterials({})}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Recent Purchase Orders */}
      {purchaseOrders.length > 0 && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 font-semibold">Recent Purchase Orders</h3>
          <div className="space-y-2">
            {purchaseOrders.slice(0, 5).map((po) => (
              <div
                key={po.id}
                className="flex items-center justify-between rounded border p-3"
              >
                <div>
                  <p className="font-medium capitalize">{po.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {po.quantity}g | Total: ₹{po.total_cost.toLocaleString()}
                  </p>
                </div>
                <div>
                  {po.isReceived ? (
                    <span className="text-sm text-green-600 dark:text-green-400">
                      ✓ Received
                    </span>
                  ) : (
                    <span className="text-sm text-yellow-600 dark:text-yellow-400">
                      ⏳ Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
