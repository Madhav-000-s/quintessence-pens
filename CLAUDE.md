# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Quintessence Pens is a luxury fountain pen e-commerce platform with an interactive 3D configurator and superadmin management dashboard. Built with Next.js 15, React 19, Three.js, and Supabase.

## Development Commands

```bash
# Start development server (uses Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Development server runs on http://localhost:3000

## Architecture

### Application Structure

The app follows Next.js 15 App Router conventions with route groups:

- `(landing)/` - Public landing page
- `(auth)/` - Authentication pages
- `(superadmin-panel)/` - Admin dashboard with sidebar layout
- `configurator/` - 3D pen customization interface

### Core Technologies

- **Next.js 15** with Turbopack for development
- **React 19** with Server/Client Components
- **Three.js** via `@react-three/fiber` and `@react-three/drei` for 3D rendering
- **Zustand** for state management (with persistence)
- **Supabase** for backend (authentication, database)
- **Tailwind CSS v4** for styling
- **TypeScript** with strict mode

### Key Patterns

#### 1. Route Groups
Uses Next.js route groups for layouts:
- `(superadmin-panel)` - Wraps all admin pages with sidebar navigation
- `(auth)` - Authentication flows
- `(landing)` - Public pages

#### 2. State Management
Zustand store pattern with persistence:
- `src/lib/store/configurator.ts` - Main configurator state
- Persists config to localStorage via `zustand/middleware`
- Async pricing calculations integrated into state updates

#### 3. Database Integration
Supabase client setup in `src/supabase-client.ts`:
- Uses environment variables: `NEXT_PUBLIC_SUPABASE_PROJECT_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- API layer in `src/lib/supabase/configurator-api.ts` with in-memory caching (5 min TTL)
- Adapter pattern in `src/lib/adapters/configurator-adapters.ts` converts DB models to UI types

#### 4. 3D Configurator Architecture
The configurator is split into distinct layers:

**State Layer** (`src/lib/store/configurator.ts`):
- Manages configuration state (body, nib, trim, engraving, etc.)
- Calculates pricing dynamically using DB data or fallback prices
- Handles model switching, presets, import/export

**Data Layer** (`src/lib/supabase/configurator-api.ts`):
- Fetches materials, designs, coatings, engravings from Supabase
- Implements caching to reduce API calls
- Functions: `fetchMaterials()`, `fetchDesigns()`, `fetchCoatings()`, etc.

**Adapter Layer** (`src/lib/adapters/configurator-adapters.ts`):
- Transforms database types to UI-friendly options
- Provides fallback data when DB is unavailable
- Maps between frontend types and backend schema

**3D Rendering Layer** (`src/components/configurator/`):
- `PenViewer.tsx` - Canvas setup with camera, lighting, post-processing
- `models/` - Three.js pen models (ZeusPen, PoseidonPen, HeraPen)
- Uses `@react-three/fiber` for declarative 3D
- Post-processing: Bloom, SSAO effects via `@react-three/postprocessing`

**UI Layer** (`src/components/configurator/`):
- `ConfigPanel.tsx` - Main configuration interface
- `ColorPicker.tsx`, `MaterialSelector.tsx`, etc. - Section-specific controls
- `PricingSummary.tsx` - Real-time pricing breakdown
- `EngravingEditor.tsx` - Text engraving interface

#### 5. Pen Models
Three pen models defined in `src/lib/pen-models.ts`:
- **Zeus** ($1499) - Premium executive pen with hexagonal faceted cap
- **Poseidon** ($1299) - Streamlined torpedo shape with wave-inspired bands
- **Hera** ($999) - Elegant slender proportions with delicate details

Each model has its own Three.js component in `src/components/configurator/models/`

#### 6. Pricing System
Dual pricing system in `src/lib/store/configurator.ts`:
- **Dynamic**: Fetches costs from Supabase (materials, designs, coatings, engravings)
- **Fallback**: Hardcoded costs when DB unavailable
- Pricing recalculated asynchronously on every config change
- Base prices: Zeus ($1499), Poseidon ($1299), Hera ($999)

### Superadmin Dashboard

Located in `src/app/(superadmin-panel)/superadmin/dashboard/`:
- Overview, Orders, Production, Purchase Orders, QA, Accounts, Inventory, Vendors, Businesses, Grievances
- Uses shadcn/ui Sidebar component for navigation
- Menu items defined in `src/lib/constants.tsx` as `SUPERADMIN_MENU_ITEMS`

### Component Libraries

**UI Components** (`src/components/ui/`):
- Based on shadcn/ui (Radix UI primitives)
- Uses class-variance-authority for variants
- Utility: `src/lib/utils.ts` with `cn()` helper (tailwind-merge + clsx)

**Base Components** (`src/components/base/`):
- `app-sidebar.tsx` - Navigation sidebar
- `app-header.tsx` - Header with breadcrumbs
- `theme-toggle.tsx` - Dark/light mode toggle

### Path Aliases

TypeScript configured with `@/*` mapping to `src/*`

## Important Notes

### Environment Variables
Required in `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3D Models
- Pen models are procedurally generated Three.js geometries
- Material properties computed in `src/lib/configurator-utils.ts`
- Functions: `getMaterialProperties()`, `getTrimProperties()`

### Type System
All configurator types defined in `src/types/configurator.ts`:
- `PenConfiguration` - Complete pen config
- `PenModel` - "zeus" | "poseidon" | "hera"
- `PricingBreakdown` - Cost breakdown structure
- Database types in `src/lib/supabase/configurator-api.ts`

### Configurator URL Patterns
- `/configurator/[model]` - Model-specific configurator (zeus, poseidon, hera)
- Query params:
  - `?preset=id` - Load preset configuration
  - `?config=base64` - Load shared configuration (base64 encoded JSON)

### Styling
- Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
- Dark mode via next-themes (system/light/dark)
- Custom fonts: Inter (sans), Playfair Display (serif), Fira Code (mono)

### State Persistence
Configurator state persists to localStorage:
- Key: `pen-configurator-storage`
- Only persists: `config` and `currentModel`
- Pricing recalculated on hydration

### Database Schema Notes
Tables referenced in code:
- `Material` - Materials with cost and weight
- `Design` - Body patterns/designs with colors
- `Coating` - Surface finishes
- `Engravings` - Engraving styles with costs
- `CapConfig`, `BarrelConfig`, `NibConfig` - Component configurations
- `InkConfig` - Ink colors
- `ClipDesign` - Clip styles

When working with the database, always use the cached API functions from `configurator-api.ts` to avoid redundant queries.
- no need to run the dev server i will have it running on 3000 just ask me first