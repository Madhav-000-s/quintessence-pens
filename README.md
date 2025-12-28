# Quintessence Pens

A luxury fountain pen e-commerce platform featuring an interactive 3D configurator and comprehensive superadmin management dashboard. Built with Next.js 15, React 19, Three.js, and Supabase.

<p align="center">
  <img src="public/videos/hero.gif" alt="Quintessence Pens 3D Configurator" width="100%">
</p>

## Features

### 3D Pen Configurator
- Real-time 3D visualization with Three.js
- Customizable pen components (body, nib, trim, engraving)
- Three premium pen models: Zeus ($1499), Poseidon ($1299), Hera ($999)
- Dynamic pricing calculations
- Preset configurations and shareable links
- Post-processing effects (Bloom, SSAO)

### Superadmin Dashboard
- **Orders Management** - Track and process customer orders
- **Production Control** - Manage work orders and manufacturing
- **Inventory Tracking** - Monitor raw materials and finished products
- **Purchase Orders** - Handle vendor material orders
- **Vendor Management** - Maintain supplier relationships
- **Financial Accounts** - Track transactions, payments, and analytics
- **Quality Assurance** - Manage QA workflows
- **Shipping & Returns** - Handle logistics

### Customer Features
- User authentication
- Order placement and tracking
- Custom pen configuration saving

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Frontend | React 19, TypeScript |
| 3D Graphics | Three.js, @react-three/fiber, @react-three/drei |
| State | Zustand (with persistence) |
| Backend | Supabase (Auth, Database, Storage) |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI) |
| Animation | GSAP |

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quintessence-pens
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

```bash
npm run dev      # Start development server (Turbopack)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Authentication pages
│   ├── (landing)/                 # Public landing page
│   ├── (superadmin-panel)/        # Admin dashboard
│   │   └── superadmin/dashboard/
│   │       ├── accounts/          # Financial management
│   │       ├── inventory/         # Stock tracking
│   │       ├── orders/            # Order management
│   │       ├── production/        # Manufacturing
│   │       ├── purchase-orders/   # Vendor orders
│   │       ├── qa/                # Quality assurance
│   │       ├── shipping/          # Logistics
│   │       └── vendors/           # Supplier management
│   ├── (customer-panel)/          # Customer portal
│   ├── configurator/[model]/      # 3D pen customization
│   └── api/                       # API routes
├── components/
│   ├── base/                      # Layout components
│   ├── configurator/              # 3D configurator UI
│   │   └── models/                # Three.js pen models
│   ├── landing/                   # Landing page components
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── adapters/                  # DB to UI type adapters
│   ├── store/                     # Zustand stores
│   └── supabase/                  # Supabase API layer
└── types/                         # TypeScript definitions
```

## Architecture

### Configurator Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                     UI Layer                            │
│  (ConfigPanel, MaterialSelector, ColorPicker, etc.)     │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   State Layer (Zustand)                 │
│  - Configuration state    - Pricing calculations        │
│  - Model switching        - Presets & sharing           │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   Adapter Layer                         │
│  - DB to UI type conversion                             │
│  - Fallback data handling                               │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                   Data Layer (Supabase)                 │
│  - API calls with caching (5 min TTL)                   │
│  - Materials, designs, coatings, engravings             │
└─────────────────────────────────────────────────────────┘
```

### Pen Models

| Model | Description | Base Price |
|-------|-------------|------------|
| Zeus | Premium executive pen with hexagonal faceted cap | $1,499 |
| Poseidon | Streamlined torpedo shape with wave-inspired bands | $1,299 |
| Hera | Elegant slender proportions with delicate details | $999 |

### Configurator URL Patterns

```
/configurator/zeus              # Zeus model configurator
/configurator/poseidon          # Poseidon model configurator
/configurator/hera              # Hera model configurator

# Query parameters:
?preset=<id>                    # Load preset configuration
?config=<base64>                # Load shared configuration
```

## Documentation

All project documentation is located in the [`documentation/`](./documentation/) folder:

| Document | Description |
|----------|-------------|
| [API Documentation](./documentation/api_docs/api_docs.md) | Complete REST API reference |
| [CLAUDE.md](./documentation/docs/CLAUDE.md) | AI assistant guidelines for this codebase |
| [Superadmin Structure](./documentation/docs/SUPERADMIN_STRUCTURE.md) | Admin dashboard architecture |
| [Three.js Model System](./documentation/docs/THREE_MODEL_SYSTEM.md) | 3D pen model implementation details |
| [Texture Sources](./documentation/docs/TEXTURE_SOURCES.md) | Texture asset information |

## API Reference

Full API documentation is available in [`documentation/api_docs/api_docs.md`](./documentation/api_docs/api_docs.md).

### API Categories

- **Configurator APIs** - Cap, barrel, ink, and nib configuration
- **Order Section** - Bill of materials, quotes, scheduling
- **Production Section** - Work orders, manufacturing control
- **Purchase Orders** - Material procurement
- **Inventory** - Stock management
- **Vendors** - Supplier CRUD operations
- **Financial Accounts** - Transactions, payments, analytics

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/configure_cap` | POST/GET | Configure pen cap |
| `/api/configure_barrel` | POST/GET | Configure pen barrel |
| `/api/orders/generate` | POST | Generate bill of material |
| `/api/production/start` | POST | Start production |
| `/api/inventory` | GET | Get all inventory |
| `/api/vendors` | GET/POST/PUT/DELETE | Vendor management |
| `/api/accounts/summary` | GET | Financial summary |

## Database Schema

Key tables referenced in the application:

| Table | Purpose |
|-------|---------|
| `Material` | Materials with cost and weight |
| `Design` | Body patterns/designs with colors |
| `Coating` | Surface finishes |
| `Engravings` | Engraving styles with costs |
| `CapConfig` | Cap component configurations |
| `BarrelConfig` | Barrel component configurations |
| `NibConfig` | Nib component configurations |
| `InkConfig` | Ink colors |
| `ClipDesign` | Clip styles |
| `Inventory` | Raw materials and finished products |
| `Vendor` | Supplier information |

## Styling

- **Tailwind CSS v4** with PostCSS plugin
- **Dark mode** support via next-themes (system/light/dark)
- **Custom fonts**: Inter (sans), Playfair Display (serif), Fira Code (mono)
- **Component library**: shadcn/ui with Radix UI primitives

## State Persistence

Configurator state persists to localStorage:
- **Key**: `pen-configurator-storage`
- **Persisted data**: `config`, `currentModel`
- Pricing recalculates on hydration

## Notes

- All monetary values in INR (Indian Rupees)
- All weights in grams
- Minimum production amount: INR 50,000
- Tax rate: 18%
- API caching: 5 minute TTL

## License

Private - All rights reserved
