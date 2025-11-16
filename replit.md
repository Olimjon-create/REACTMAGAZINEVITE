# Warehouse Inventory Management System

## Overview

This is a full-stack warehouse inventory management system built with React, Express, and PostgreSQL. The application enables warehouse staff to track products, manage stock movements, organize items by categories and locations, and generate comprehensive reports. It features a modern, data-intensive dashboard interface optimized for efficiency and scannability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component Library**: Shadcn/ui (Radix UI primitives) with Tailwind CSS

- Design system follows Material Design principles adapted for enterprise dashboards
- Emphasis on information density and fast data scanning over visual decoration
- Typography: Inter font family for exceptional readability
- Responsive grid system: 12-column layout with breakpoints for desktop/tablet/mobile
- Theme support: Light and dark mode with custom theme provider

**State Management**: TanStack Query (React Query)

- Centralized data fetching and caching
- Optimistic updates for improved UX
- Custom query client with infinite stale time for performance

**Routing**: Wouter (lightweight client-side routing)

- Page routes: Dashboard, Products, Stock Movements, Categories, Locations, Reports
- Simple declarative routing without React Router overhead

**Form Handling**: React Hook Form with Zod validation

- Type-safe form validation using Drizzle-Zod schemas
- Consistent error handling across all forms

**Key Features**:

- Collapsible sidebar navigation with mobile support
- Real-time stock level alerts for low inventory
- Interactive data visualizations using Recharts
- CRUD operations for products, categories, locations, and stock movements
- Comprehensive reporting with category and location statistics

### Backend Architecture

**Framework**: Express.js with TypeScript

**API Design**: RESTful JSON API

- Endpoints organized by resource: `/api/products`, `/api/categories`, `/api/locations`, `/api/movements`
- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Zod schema validation for all incoming data
- Centralized error handling with appropriate status codes

**Data Storage**:

- Currently using in-memory storage (MemStorage class) for development
- Designed with IStorage interface for easy swap to persistent database
- PostgreSQL schema defined using Drizzle ORM

**Request Processing**:

- JSON body parsing with raw body preservation
- Custom logging middleware for API request tracking
- Response time monitoring
- Request/response lifecycle hooks

**Development Server**:

- Vite middleware integration for HMR in development
- SSR template serving for production builds
- Separate static file serving in production

### Database Schema

**ORM**: Drizzle ORM with PostgreSQL dialect

**Core Tables**:

1. **Products**: Central inventory items

   - UUID primary key
   - SKU (unique), name, description
   - Quantity tracking with minimum stock levels
   - Category and location references
   - Decimal pricing

2. **Stock Movements**: Transaction history

   - UUID primary key
   - Product reference (denormalized: ID, name, SKU)
   - Movement type (in/out)
   - Quantity and notes
   - Timestamp tracking

3. **Categories**: Product classification

   - UUID primary key
   - Unique name with description

4. **Locations**: Physical warehouse positions
   - UUID primary key
   - Zone, shelf, and bin organization

**Validation**: Drizzle-Zod integration generates TypeScript types and Zod schemas from database schema, ensuring end-to-end type safety from database to UI.

### Build and Deployment

**Development**:

- TSX for running TypeScript server with hot reload
- Vite dev server with HMR for client
- Concurrent client/server development

**Production Build**:

- Vite builds optimized client bundle to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Single production server serves both API and static assets

**TypeScript Configuration**:

- Strict mode enabled
- Path aliases for clean imports (`@/`, `@shared/`)
- ESNext modules with bundler resolution
- Incremental compilation for faster builds

## External Dependencies

### Core Runtime Dependencies

- **@neondatabase/serverless**: PostgreSQL client (Neon Database serverless driver)
- **drizzle-orm**: Type-safe ORM for database operations
- **express**: Web server framework
- **wouter**: Lightweight routing library
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state and validation
- **zod**: Runtime type validation and schema definition

### UI Component Libraries

- **@radix-ui/\***: Headless UI primitives (20+ components including dialogs, dropdowns, tooltips, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx** / **tailwind-merge**: Conditional className utilities
- **lucide-react**: Icon library
- **recharts**: Data visualization and charting
- **embla-carousel-react**: Carousel/slider component
- **date-fns**: Date manipulation and formatting

### Development Tools

- **vite**: Build tool and dev server
- **typescript**: Type system
- **tsx**: TypeScript execution for server
- **esbuild**: JavaScript bundler for production server
- **drizzle-kit**: Database migrations and schema management
- **@replit/vite-plugin-\***: Replit-specific development plugins (error overlay, cartographer, dev banner)

### Database Configuration

- Drizzle configured for PostgreSQL dialect
- Database connection via `DATABASE_URL` environment variable
- Migration files output to `./migrations`
- Schema source from `./shared/schema.ts`

### Styling System

- **Google Fonts**: Inter font family via CDN
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- Custom CSS variables for theme colors and design tokens
- Shadcn/ui "new-york" style variant
- Neutral base color palette with CSS variable theming
