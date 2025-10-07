import { LucideIcon } from "lucide-react"

export type Panel = "superadmin" | "production" | "qualityassurance"

export type PageItem = {
    title: string
    url: string
    icon: LucideIcon
  }