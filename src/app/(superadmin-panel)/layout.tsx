"use client";

import React from "react";
import { useSuperadminAuth } from "@/hooks/useSuperadminAuth";
import { AppSidebar } from "@/components/base/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Bounded } from "@/components/base/bounded";
import AppHeader from "@/components/base/app-header";

type Props = {
  children: React.ReactNode;
};

export default function SuperadminDashboardLayout({ children }: Props) {
  const { loading, isAuthenticated, user } = useSuperadminAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, hook will redirect, so show nothing
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar panel="superadmin" />
      <SidebarInset>
        <AppHeader panel="superadmin" user={user} />
        <Bounded as="main">{children}</Bounded>
      </SidebarInset>
    </SidebarProvider>
  );
}
