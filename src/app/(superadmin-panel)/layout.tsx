import React from "react";

import { SuperAdminSidebar } from "@/components/superadmin/SuperAdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

export default function SuperadminDashboardLayout({ children }: Props) {
  return <SidebarProvider>
    <SuperAdminSidebar />
    <main>
        <SidebarTrigger />
        {children}
    </main>
  </SidebarProvider>;
}
