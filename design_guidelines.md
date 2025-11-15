# Design Guidelines: Warehouse Inventory Management System

## Design Approach

**Selected Framework:** Design System Approach (Material Design + Enterprise Dashboard Patterns)

**Rationale:** This is a utility-focused, data-intensive application where efficiency, scannability, and information density are paramount. Drawing from Material Design's robust component library combined with proven enterprise dashboard patterns (inspired by modern SaaS tools like Linear, Notion databases, and professional inventory systems).

**Core Principles:**
1. Information density over visual decoration
2. Fast scanning and data comprehension
3. Consistent, predictable patterns
4. Professional, clean aesthetic

---

## Typography System

**Font Family:** Inter (via Google Fonts CDN) - exceptional readability at all sizes

**Hierarchy:**
- Page Titles: text-2xl font-semibold (32px)
- Section Headers: text-xl font-semibold (24px)
- Card/Widget Titles: text-lg font-medium (20px)
- Table Headers: text-sm font-semibold uppercase tracking-wide (14px)
- Body Text: text-base font-normal (16px)
- Data/Numbers: text-base font-medium (16px, medium weight for emphasis)
- Helper Text: text-sm font-normal (14px)
- Labels: text-xs font-medium uppercase tracking-wide (12px)

---

## Layout System

**Spacing Units:** Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16, 24 (as in p-4, m-8, gap-6)

**Grid Structure:**
- Dashboard uses 12-column grid system
- Widget layouts: 3-column on desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), 1-column mobile
- Data tables: Full-width with horizontal scroll on mobile
- Sidebar: Fixed 256px width (w-64) on desktop, collapsible on tablet/mobile

**Container Strategy:**
- Main content area: max-w-full with px-6 py-8
- Cards/Widgets: Defined widths within grid system
- Forms: max-w-2xl for optimal completion
- Modals: max-w-lg to max-w-4xl depending on content

---

## Component Library

### Navigation
**Sidebar Navigation:**
- Fixed left sidebar with logo at top
- Grouped navigation items with icons (Heroicons)
- Active state: font-semibold with subtle visual indicator
- Sections: Dashboard, Inventory, Stock Movement, Reports, Settings
- Collapsible on mobile with hamburger menu

**Top Bar:**
- Search bar (prominent, left-aligned after logo on mobile)
- Quick actions: Scan Barcode button, Add Product button
- User profile dropdown (right-aligned)
- Notifications bell with badge counter

### Dashboard Widgets

**Stats Cards (4-across on desktop):**
- Large number display (text-3xl font-bold)
- Label below (text-sm)
- Small trend indicator with icon
- Compact padding (p-6)

**Inventory Table:**
- Dense table design with alternating row treatment
- Sticky header row
- Columns: Product Name, SKU, Category, Quantity, Location, Status, Actions
- Inline editing capability
- Quick action icons in Actions column
- Status badges (In Stock, Low Stock, Out of Stock)

**Charts:**
- Stock level trends: Line chart
- Category distribution: Donut chart
- Movement history: Bar chart
- Use Chart.js or Recharts library
- Legends positioned below charts

### Forms & Inputs

**Input Fields:**
- Consistent height (h-10 for text inputs)
- Label above input (text-sm font-medium mb-2)
- Placeholder text for guidance
- Clear focus states with ring treatment
- Error messages in text-sm below input

**Buttons:**
- Primary: px-6 py-2.5 font-medium rounded-lg
- Secondary: px-6 py-2.5 font-medium rounded-lg with border
- Icon buttons: p-2 rounded
- Action buttons in tables: p-1.5 rounded

**Search & Filters:**
- Prominent search bar with icon prefix (Heroicons magnifying glass)
- Filter dropdowns with checkboxes
- Active filter chips with dismiss option
- "Clear all filters" link

### Data Display

**Product Cards (Grid View):**
- Image placeholder at top (aspect-square)
- Product name (font-medium)
- SKU and category (text-sm)
- Quantity with visual indicator
- Quick action buttons at bottom

**Tables:**
- Zebra striping for row readability
- Compact row height (h-12)
- Right-aligned numerical data
- Left-aligned text data
- Sortable columns with arrow indicators

**Badges & Status:**
- Rounded-full px-3 py-1 text-xs font-medium
- Different badge styles for: In Stock, Low Stock, Out of Stock, In Transit

### Modals & Overlays

**Modal Dialogs:**
- Overlay with backdrop blur
- Centered modal with max-width constraints
- Clear header with title and close button
- Footer with action buttons (right-aligned)
- Smooth entrance animation (fade + scale)

**Side Panels:**
- Slide from right for detail views
- Full-height with internal scroll
- Close button top-right
- Sections with dividers

---

## Page Layouts

### Dashboard Page
- 4 stat cards across top (grid-cols-4)
- 2-column layout below: Main inventory table (col-span-2) + Recent activity widget
- Charts section: 2 charts side-by-side (grid-cols-2)

### Inventory List Page
- Filter bar at top with search + category filters
- Toggle between table/grid view
- Bulk action controls when items selected
- Pagination at bottom

### Product Detail Page
- 2-column layout: Product info form (col-span-2) + Stock movement history sidebar
- Tabbed interface for: Details, Stock History, Locations

### Reports Page
- Date range picker prominent at top
- Report cards in grid (grid-cols-3)
- Export buttons for each report section

---

## Icons
**Library:** Heroicons (via CDN) - consistent with modern SaaS applications

**Common Icons:**
- Dashboard: ChartBarIcon
- Inventory: CubeIcon
- Add: PlusIcon
- Edit: PencilIcon
- Delete: TrashIcon
- Search: MagnifyingGlassIcon
- Filter: FunnelIcon
- Barcode: QrCodeIcon
- Alert: ExclamationTriangleIcon
- Export: ArrowDownTrayIcon

---

## Images

**No hero images required** - This is a utility application focused on data and functionality rather than marketing.

**Product Images:**
- Placeholder images for products in cards and detail views
- Square aspect ratio (aspect-square)
- Fallback icon when image unavailable

**Empty States:**
- Simple illustration or icon for empty inventory lists
- Centered with helpful text and CTA button

---

## Interactions & Animations

**Keep minimal - only where they enhance UX:**
- Smooth page transitions (fade)
- Dropdown menu entrance (subtle scale + fade)
- Modal entrance (scale from 95% to 100%)
- Loading states: Subtle skeleton screens for tables
- Toast notifications: Slide in from top-right

**No animations on:**
- Table sorting
- Filter application
- Data updates (instant feedback preferred)

---

## Responsive Behavior

**Desktop (lg: 1024px+):** Multi-column layouts, sidebar always visible, full table width
**Tablet (md: 768px):** 2-column maximum, collapsible sidebar, tables scroll horizontally
**Mobile (base):** Single column, hamburger menu, card-based layouts, stacked forms

**Priority:** Desktop-first design since warehouse management is primarily used on workstations/tablets.