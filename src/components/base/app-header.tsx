"use client";
import React from "react";
import { usePathname } from "next/navigation";

import { ModeToggle } from "@/components/base/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PageItem, Panel } from "@/types/navigation";
import { generateBreadcrumbs, getItems } from "@/lib/utils";

type Props = {
  panel: Panel;
};

export default function AppHeader({ panel }: Props) {
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
                  <BreadcrumbItem>
                    <BreadcrumbPage>{b.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                ) : (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={b.href}>{b.label}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                ),
              )}{" "}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
