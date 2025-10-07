import { PageItem, Panel } from "@/types/navigation";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SUPERADMIN_MENU_ITEMS } from "./constants";

// Generate breadcrumb items based on current path
export const generateBreadcrumbs = (pathname: string, panel: Panel, items: PageItem[]) => {
  const pathSegments = pathname.split("/").filter(Boolean);
  let breadcrumbs: { label: string; href?: string; isActive: boolean }[] = [];

  // Always start with Dashboard
  breadcrumbs.push({
    label: "Dashboard",
    href: `/${panel}/dashboard/overview`,
    isActive: pathname === `/${panel}/dashboard/overview`,
  });

  if (pathname !== `/${panel}/dashboard/overview`) {
    // Build path incrementally
    let currentPath = `/${panel}/dashboard`;
    for (let i = 2; i < pathSegments.length; i++) {
      // Start from index 2 to skip 'doctor' and 'dashboard'
      currentPath += `/${pathSegments[i]}`;
      const label = items.filter((x) => x.url === pathname)[0].title;
      if (label) {
        breadcrumbs.push({
          label,
          href: currentPath,
          isActive: i === pathSegments.length - 1,
        });
      }
    }
  }
  return breadcrumbs;
};

export function getItems(panel: Panel): PageItem[] {
  switch (panel) {
    case "superadmin":
      return SUPERADMIN_MENU_ITEMS
    case "production":
    case "qualityassurance":
      return []
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
