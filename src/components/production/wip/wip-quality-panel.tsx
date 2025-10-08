"use client"

import React from 'react'
import SectionHeader from '../../production/section-header'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'

export default function WipQualityPanel() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="WIP picking and Quality"
        description="Set items required as WIP (stock picking), record produced and defective counts, then materials are deducted and items sent for quality inspection."
      />

      <div className="space-y-4 max-w-3xl">
        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-4">
          <h3 className="font-medium">Set Items required as WIP</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Item code" />
            <Input placeholder="Quantity" />
            <Button>Add to WIP</Button>
          </div>
        </div>

        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-4">
          <h3 className="font-medium">Production output</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Enter the number of items successfully produced and the number which were defective.</p>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Produced quantity" />
            <Input placeholder="Defective quantity" />
            <Button>Record</Button>
          </div>
        </div>

        <div className="rounded-md border border-neutral-200 dark:border-neutral-800 p-4">
          <h3 className="font-medium">Send to Quality inspection</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">After recording, items are deducted from WIP and entered into inventory awaiting inspection.</p>
          <div className="mt-3 flex gap-3">
            <Button>Send for inspection</Button>
            <Button variant="outline">View pending inspections</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
