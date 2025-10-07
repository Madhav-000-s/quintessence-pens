import React from "react";

import { AppSidebar } from "@/components/base/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/base/theme-toggle";
import { SUPERADMIN_MENU_ITEMS } from "@/lib/constants";
import { Bounded } from "@/components/base/bounded";
import AppHeader from "@/components/base/app-header";

type Props = {
  children: React.ReactNode;
};

export default function SuperadminDashboardLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar panel="superadmin" />
      <SidebarInset>
        <AppHeader panel="superadmin" />
        <Bounded as="main">{children}</Bounded>
      </SidebarInset>
    </SidebarProvider>
  );
}
