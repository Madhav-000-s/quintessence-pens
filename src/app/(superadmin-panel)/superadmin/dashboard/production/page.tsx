import React from 'react'
import SchedulePanel from '@/components/production/schedule/schedule-panel'
import RequestPanel from '@/components/production/request/request-panel'
import WipQualityPanel from '@/components/production/wip/wip-quality-panel'
import SectionHeader from '@/components/production/section-header'
import { Separator } from '@/components/ui/separator'
import { Tabs } from '@/components/ui/tabs'
import { TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

export default function ProductionPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Production"
        description="Production side control for scheduling, resource requests, WIP picking, and quality updates."
      />
      <Separator />

      <Tabs
      >
        <TabsList>
          <TabsTrigger value= 'schedule'>Schedule details</TabsTrigger>
          <TabsTrigger value=  'request'>Request resources</TabsTrigger>
          <TabsTrigger value=  'wip'>WIP & Quality</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule"><SchedulePanel /></TabsContent>
        <TabsContent value="request"><RequestPanel /></TabsContent>
        <TabsContent value="wip"><WipQualityPanel /></TabsContent>
      </Tabs>
    </div>
  )
}