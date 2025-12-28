# Superadmin Dashboard Structure

## Overview

The Quintessence Pens superadmin dashboard provides comprehensive management tools for the luxury fountain pen manufacturing and e-commerce business. Built with Next.js 15 and Supabase, it offers real-time data management across all business operations.

## Architecture

**Route Path:** `(superadmin-panel)/superadmin/dashboard/`

**Layout:** Sidebar navigation with persistent state across all dashboard pages

**Tech Stack:**
- Next.js 15 App Router with Server/Client Components
- Supabase PostgreSQL for data persistence
- shadcn/ui component library
- TypeScript with strict type safety

## Dashboard Modules

### 1. Overview (`/dashboard`)
**Purpose:** High-level business metrics and KPIs

**Features:**
- Revenue and sales analytics
- Order status summary
- Production pipeline overview
- Quick access cards to all modules

### 2. Orders (`/dashboard/orders`)
**Purpose:** Customer order management and fulfillment tracking

**Key Entities:**
- WorkOrder table
- Customer relationships
- Order status workflow

**Features:**
- Order listing with filters (status, date range)
- Order details view
- Status updates (pending → processing → shipped → completed)
- Customer information display
- Payment status tracking

### 3. Production (`/dashboard/production`)
**Purpose:** Manufacturing process and work order tracking

**Key Entities:**
- WorkOrder table
- Production status management

**Features:**
- Production queue visualization
- Work order assignment
- Status tracking (queued → in_progress → completed)
- Material requirements planning
- Production timeline management

### 4. Purchase Orders (`/dashboard/purchase-orders`)
**Purpose:** Vendor procurement and material ordering

**Key Entities:**
- PurchaseOrder table
- Vendor relationships
- Material tracking

**Features:**
- PO creation and management
- Vendor selection
- Material quantity tracking
- Status workflow (draft → sent → received → completed)
- Cost tracking and budgeting

### 5. Quality Assurance (`/dashboard/qa`)
**Purpose:** Product quality inspection and defect management

**Database:** `QualityAssurance` table

**Schema:**
```typescript
{
  id: number
  inspector_name: string
  inspection_date: date
  status: 'passed' | 'failed' | 'pending'
  defects_found: number
  defect_description: string
  notes: string
}
```

**Features:**
- Inspection record management (CRUD)
- Pass/fail/pending status tracking
- Defect count analytics
- Summary metrics (pass rate, total inspections)
- Filter by status

### 6. Financial Accounts (`/dashboard/accounts`)
**Purpose:** Financial transaction tracking and accounting

**Database Tables:**
- `Transactions` - All financial movements
- `AccountSummary` - Cached aggregates

**API Endpoints:**
- `/api/accounts/transactions` - CRUD operations
- `/api/accounts/summary` - Financial metrics
- `/api/accounts/payments` - Payment recording
- `/api/accounts/analytics` - Data insights

**Features:**
- Transaction management (income, expense, payments)
- Financial summary dashboard
- Revenue/expense tracking
- Profit margin analysis
- Month-over-month comparisons
- Category breakdown
- Customer/vendor payment tracking
- Invoice integration with WorkOrder

**Transaction Categories:**
- Sales, Purchase Orders, Labor, Shipping
- Materials, Utilities, Rent, Salaries, Other

### 7. Inventory (`/dashboard/inventory`)
**Purpose:** Material stock and warehouse management

**Key Entities:**
- Material table
- Inventory levels
- Reorder points

**Features:**
- Stock level monitoring
- Material categorization
- Low stock alerts
- Inventory valuation
- Reorder automation triggers

### 8. Vendors (`/dashboard/vendors`)
**Purpose:** Supplier relationship management

**Database:** `Vendors` table with Address relationship

**Schema:**
```typescript
{
  id: number
  vendor_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
  vendor_address: number (FK to Address)
  payment_terms: string
  is_active: boolean
}
```

**Features:**
- Vendor directory (CRUD)
- Contact information management
- Address management via foreign key
- Payment terms tracking
- Active/inactive status
- Purchase order history

### 9. Business Clients (`/dashboard/businesses`)
**Purpose:** B2B corporate account management

**Database:** `Businesses` table

**Schema:**
```typescript
{
  id: number
  business_name: string
  contact_person: string
  contact_email: string
  contact_phone: string
  gst_number: string
  business_address: string
  city: string
  state: string
  pincode: string
  credit_limit: number
  payment_terms: string
  is_active: boolean
}
```

**Features:**
- Corporate client directory (CRUD)
- GST number tracking
- Credit limit management
- Payment terms configuration
- Active/inactive status
- Location tracking

### 10. Customer Grievances (`/dashboard/grievances`)
**Purpose:** Customer complaint tracking and resolution

**Database:** `Grievances` table

**Schema:**
```typescript
{
  id: number
  created_at: timestamp
  customer: number (FK to Customers)
  message: text
  defective_count: number
}
```

**Features:**
- Complaint logging (CRUD)
- Customer association
- Defective product count tracking
- Complaint message details
- Analytics (total grievances, defect totals)
- Customer lookup with email display

## Navigation Structure

**Sidebar Menu Items:**
1. Overview
2. Orders
3. Production
4. Purchase Orders
5. QA
6. Accounts
7. Inventory
8. Vendors
9. Businesses
10. Grievances

**Menu Configuration:** `src/lib/constants.tsx` (`SUPERADMIN_MENU_ITEMS`)

## Common Patterns

### Data Fetching
All pages use Supabase client-side SDK for real-time data:
```typescript
const { data, error } = await supabase
  .from("TableName")
  .select("*")
  .order("created_at", { ascending: false });
```

### CRUD Operations
Standard pattern across all modules:
- **Create:** Dialog form → `insert()` → refresh list
- **Read:** `select()` with filters/ordering
- **Update:** Dialog form → `update()` → refresh list
- **Delete:** Confirmation → `delete()` → refresh list

### UI Components
- **Bounded:** Page container with max-width
- **Dialog:** Modal forms for add/edit
- **Button:** Actions and filters
- **Skeleton:** Loading states
- **Input/Label:** Form fields
- **Separator:** Visual dividers

### State Management
Each page maintains:
- `loading` - Initial data fetch state
- `error` - Error message display
- `success` - Success toast notifications
- `isDialogOpen` - Modal visibility
- `editingRecord` - Current edit context
- `formData` - Form input state

## API Documentation

Complete API documentation available at: `api_docs/api_docs.md`

**Documented APIs:**
- Customers, Orders, Work Orders
- Purchase Orders, Materials
- Vendors, Inventory
- Financial Accounts (Transactions, Payments, Summary, Analytics)

## Database Schema

**Core Tables:**
- Customers, WorkOrder, PurchaseOrder
- Material, Vendors, Address
- Transactions, QualityAssurance
- Businesses, Grievances

**Key Relationships:**
- WorkOrder → Customer (many-to-one)
- PurchaseOrder → Vendor (many-to-one)
- Vendor → Address (one-to-one)
- Transaction → Customer/Vendor (many-to-one)
- Grievance → Customer (many-to-one)

## Type Safety

All modules use TypeScript interfaces:
- `src/types/vendors.ts` - Vendor types
- `src/types/accounts.ts` - Financial types
- Inline interfaces for QA, Businesses, Grievances

