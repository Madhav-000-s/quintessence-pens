"use client"

import React from 'react'
import SectionHeader from '../../production/section-header'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

export default function RequestPanel() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Request resources"
        description="Page for requesting necessary materials or manpower for future or current needs if the need arises."
      />

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
        <div>
          <label className="block text-sm mb-1">Material</label>
          <Input placeholder="e.g., Ink (Blue)" />
        </div>
        <div>
          <label className="block text-sm mb-1">Quantity</label>
          <Input placeholder="e.g., 5000 ml" />
        </div>
        <div>
          <label className="block text-sm mb-1">Manpower</label>
          <Input placeholder="e.g., 4 Assemblers" />
        </div>
        <div>
          <label className="block text-sm mb-1">Needed by</label>
          <Input type="date" />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <Button type="button">Submit request</Button>
          <Button variant="outline" type="button">Save draft</Button>
        </div>
      </form>
    </div>
  )
}
