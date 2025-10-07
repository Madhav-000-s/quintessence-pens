// Menu items.
import { PageItem } from "@/types/navigation";
import { ClipboardList, Factory, FileText, FileCheck, ShieldCheck, Banknote, Boxes, Users, Building2, AlertCircle, PanelsLeftBottom } from "lucide-react";


export const SUPERADMIN_MENU_ITEMS: PageItem[] = [
  {
    title: "Overview",
    url: "/superadmin/dashboard/overview",
    icon: PanelsLeftBottom,
  },
  {
    title: "Orders",
    url: "/superadmin/dashboard/orders",
    icon: ClipboardList,
  },
  {
    title: "Production",
    url: "/superadmin/dashboard/production",
    icon: Factory,
  },
  {
    title: "Purchase Order",
    url: "/superadmin/dashboard/purchase-order",
    icon: FileText,
  },
  {
    title: "PO Receipts",
    url: "/superadmin/dashboard/purchase-order-receipts",
    icon: FileCheck,
  },
  {
    title: "QA",
    url: "/superadmin/dashboard/quality-assurance",
    icon: ShieldCheck,
  },
  {
    title: "Accounts",
    url: "/superadmin/dashboard/accounts",
    icon: Banknote,
  },
  {
    title: "Inventory",
    url: "/superadmin/dashboard/inventory",
    icon: Boxes,
  },
  {
    title: "Vendors",
    url: "/superadmin/dashboard/vendors",
    icon: Users,
  },
  {
    title: "Businesses",
    url: "/superadmin/dashboard/businesses",
    icon: Building2,
  },
  {
    title: "Customer Greivance",
    url: "/superadmin/dashboard/grievances",
    icon: AlertCircle,
  },
]