"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

import { ModeToggle } from "@/components/base/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PageItem, Panel } from "@/types/navigation";
import { generateBreadcrumbs, getItems } from "@/lib/utils";
import type { Superadmin } from "@/types/superadmin";

type Props = {
  panel: Panel;
  user?: Superadmin | null;
};

export default function AppHeader({ panel, user }: Props) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/superadmin/auth/logout", { method: "POST" });
      router.push("/superadmin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };
  const pathname = usePathname();
    const items = getItems(panel);

  const breadcrumbs = generateBreadcrumbs(pathname, panel, items);
  return (
    <header className="flex h-16 shrink-0 items-center border-b px-4">
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((b) =>
                b.isActive ? (
                  <BreadcrumbItem key={b.href}>
                    <BreadcrumbPage>{b.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <React.Fragment key={b.href}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={b.href}>{b.label}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </React.Fragment>
                ),
              )}{" "}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {panel === "superadmin" && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-semibold text-primary">
                      {user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:inline-block text-sm">
                    {user.full_name || user.email}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.full_name || "Superadmin"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
