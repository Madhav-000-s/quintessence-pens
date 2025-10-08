"use client"

import React from 'react'
import SectionHeader from '../../production/section-header'
import { Separator } from '../../ui/separator'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

const mockRows = Array.from({ length: 6 }).map((_, i) => ({
  id: `WO-${1000 + i}`,
  workCenter: ['Moulding', 'Assembly', 'Finishing'][i % 3],
  item: `Pen Model ${i + 1}`,
  qty: 1000 + i * 250,
  due: `2025-10-${10 + i}`,
}))

export default function SchedulePanel() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Schedule details"
        description="Details regarding the items to produce and the schedule specific to the work center. Move necessary items into WIP and navigate to production control when needed."
        actions={<div className="flex gap-2"><Button variant="outline">Purchase Request</Button></div>}
      />

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="bg-neutral-50 dark:bg-neutral-900 px-4 py-3 flex items-center gap-3">
          <span className="text-sm font-medium">Filter Mechanism</span>
        </div>
        <Separator />
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Search work order" />
          <Input placeholder="Work center" />
          <Input placeholder="Date from" type="date" />
          <Input placeholder="Date to" type="date" />
          <div className="md:col-span-4 flex gap-2">
            <Button>Apply</Button>
            <Button variant="outline">Reset</Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
            <tr>
              <th className="text-left px-4 py-3">Work order</th>
              <th className="text-left px-4 py-3">Work center</th>
              <th className="text-left px-4 py-3">Item</th>
              <th className="text-right px-4 py-3">Quantity</th>
              <th className="text-left px-4 py-3">Due</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRows.map((r) => (
              <tr key={r.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3 font-medium">{r.id}</td>
                <td className="px-4 py-3">{r.workCenter}</td>
                <td className="px-4 py-3">{r.item}</td>
                <td className="px-4 py-3 text-right">{r.qty.toLocaleString()}</td>
                <td className="px-4 py-3">{r.due}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Button size="sm" variant="outline">Move to WIP</Button>
                    <Button size="sm">Control Panel</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Options for moving necessary items to WIP must be provided. An option to go to the production control panel must be there for each work order.
      </p>
    </div>
  )
}
