# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript, React 19, and Tailwind CSS. The project is a multi-panel management system (Quintessence Pens) with separate dashboards for different user roles, integrated with Supabase for backend services.

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack)
- **Build for production**: `npm build`
- **Start production server**: `npm start`
- **Run linter**: `npm run lint`
- **Format code**: Use Prettier with Tailwind CSS plugin (already configured)

## Architecture

### Route Groups & Multi-Panel System

The app uses Next.js App Router with route groups to organize separate sections:

- `(landing)` - Public landing page at `/`
- `(auth)` - Authentication flow at `/auth`
- `(superadmin-panel)` - Superadmin dashboard at `/superadmin/dashboard/*`
- `configurator` - Product configurator (not yet implemented)

Each panel has its own layout wrapper defined in the route group's `layout.tsx`.

### Panel System

The application is designed around a "panel" concept defined in `src/types/navigation.tsx`:
- Panel types: `"superadmin" | "production" | "qualityassurance"`
- Each panel has its own menu items, sidebar configuration, and routing
- Currently only superadmin panel is implemented (see `SUPERADMIN_MENU_ITEMS` in `src/lib/constants.tsx`)

When adding new panels:
1. Add menu items to `src/lib/constants.tsx`
2. Update the `getItems()` function in `src/lib/utils.ts`
3. Create route group in `src/app/(panel-name)`
4. Add layout with `<AppSidebar panel="panel-name" />` and `<AppHeader panel="panel-name" />`

### Superadmin Dashboard Routes

All superadmin routes follow the pattern `/superadmin/dashboard/{section}`:
- `/overview` - Dashboard overview (implemented)
- `/orders` - Order management (implemented)
- `/production` - Production tracking (implemented)
- Additional planned sections: purchase-order, purchase-order-receipts, quality-assurance, accounts, inventory, vendors, businesses, grievances

### Component Organization

- `src/components/ui/` - shadcn/ui components (configured with "new-york" style)
- `src/components/base/` - Custom application components
  - `app-sidebar.tsx` - Dynamic sidebar that renders based on panel type
  - `app-header.tsx` - Header with breadcrumbs and theme toggle
  - `bounded.tsx` - Container wrapper component
  - `theme-toggle.tsx` - Dark/light mode switcher

### Key Utilities

- `src/lib/utils.ts`:
  - `cn()` - Tailwind class merger (clsx + tailwind-merge)
  - `getItems()` - Returns menu items for a given panel
  - `generateBreadcrumbs()` - Builds breadcrumb navigation from current path

### Styling

- Uses Tailwind CSS v4 with PostCSS
- Theme system via next-themes with system preference support
- Custom fonts: Inter (sans), Playfair Display (serif), Fira Code (mono)
- CSS variables for theming defined in `src/app/globals.css`
- shadcn/ui configured with neutral base color and CSS variables

### Supabase Integration

- Client initialized in `src/supabase-client.ts`
- Requires environment variables:
  - `NEXT_PUBLIC_SUPABASE_PROJECT_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Store these in `.env.local` (gitignored)

## Adding New Components

Use shadcn/ui CLI to add components:
```bash
npx shadcn@latest add [component-name]
```

Components will be added to `src/components/ui/` following the configuration in `components.json`.

## Path Aliases

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/ui` → `src/components/ui`
- `@/utils` → `src/lib/utils`

## Adding New Dashboard Sections

1. Create page at `src/app/(superadmin-panel)/superadmin/dashboard/{section}/page.tsx`
2. Add menu item to `SUPERADMIN_MENU_ITEMS` in `src/lib/constants.tsx` with appropriate icon
3. Breadcrumbs will generate automatically from the route path

## Important Notes

- The project uses Turbopack in development mode for faster builds
- All client components must have `"use client"` directive
- The sidebar supports collapsible icon mode
- Theme changes are instant (disableTransitionOnChange is enabled)
- Prettier is configured to sort Tailwind classes automatically
- dont ask to do the npm run dev i will do it myself