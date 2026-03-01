# Skyway Suites - Complete Documentation

**Version:** v1.82  
**Last Updated:** March 1, 2026  
**Project Type:** Property Listing & Management Platform  
**Tech Stack:** React + TypeScript + Supabase + Tailwind CSS v4

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technical Stack](#technical-stack)
4. [Installation & Setup](#installation--setup)
5. [Project Structure](#project-structure)
6. [Core Modules](#core-modules)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [Configuration](#configuration)
10. [Deployment](#deployment)
11. [Version History](#version-history)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Skyway Suites** is a modern property listing and management platform inspired by Airbnb and Zillow. It provides a complete solution for property rental management with a clean, professional interface featuring warm earthy tones and intuitive navigation.

### Key Characteristics

- **Design Philosophy:** Clean, modern, card-based UI with warm earthy tones
- **Primary Color:** Charcoal Grey (`#36454F`)
- **Accent Colors:** Olive Green (`#6B7F39`) and Warm Beige (`#FAF4EC`)
- **Typography:** Century Gothic font family
- **Currency:** Kenyan Shillings (Ksh)
- **Target Market:** Kenyan property rental market

### Core Purpose

- **Customer-Facing:** Browse and book properties with advanced filtering
- **Admin Dashboard:** Complete backend for property, customer, and booking management
- **Communication:** Integrated WhatsApp for customer inquiries
- **Performance:** Optimized images with automatic WebP conversion

---

## Features

### 🏠 Frontend (Customer-Facing)

#### Homepage
- ✅ **Sticky Navigation Bar**
  - Logo branding
  - Mobile-responsive hamburger menu
  - Smooth scroll behavior
  
- ✅ **Hero Image Slider**
  - Auto-play functionality
  - Customizable slides (image, title, subtitle)
  - Smooth transitions
  - Admin-configurable via Settings

- ✅ **Category Filter Tabs**
  - All Properties view
  - Filter by: Bedsitter, 1 Bedroom, 2 Bedroom, 3 Bedroom, 4 Bedroom
  - Real-time filtering
  - Active state indicators

- ✅ **Property Card Grid**
  - Responsive grid layout
  - Hover effects with elevation
  - Property thumbnails
  - Price display (Ksh format)
  - Location information
  - Bedroom/bathroom counts
  - Quick view buttons

#### Property Details Page
- ✅ **Fullscreen Image Lightbox**
  - Click to expand images
  - Navigation arrows (previous/next)
  - Close button
  - Smooth transitions
  - Keyboard navigation support

- ✅ **Categorized Photo Galleries** _(New in v1.78)_
  - Tab-based organization:
    - Living Room
    - Bedroom
    - Dining
    - Kitchen
    - Bathroom
    - Amenities
  - Masonry layout for photos (coming soon)
  - Lightbox integration per category

- ✅ **Property Information**
  - Full description
  - Pricing details
  - Location with map integration
  - Area (square footage)
  - Bedroom/bathroom counts
  - Feature icons and descriptions

- ✅ **WhatsApp Integration**
  - Direct inquiry button
  - Pre-filled message template
  - Property details auto-included
  - Opens in WhatsApp Web/App

#### Contact & About Pages
- ✅ Contact form
- ✅ Company information
- ✅ Social media links

---

### 🔧 Backend (Admin Dashboard)

#### Dashboard Home
- ✅ **Analytics Overview**
  - Total properties count
  - Available properties
  - Total customers
  - Total bookings
  - Revenue metrics

- ✅ **Quick Stats Cards**
  - Color-coded indicators
  - Real-time data
  - Trend indicators

#### Properties Management
- ✅ **CRUD Operations**
  - Create new properties
  - Edit existing properties
  - Delete properties (with confirmation)
  - View all properties in table format

- ✅ **Categorized Photo Upload** _(New in v1.78)_
  - **6 Photo Categories:**
    1. Living Room
    2. Bedroom
    3. Dining
    4. Kitchen
    5. Bathroom
    6. Amenities
  - Category tabs with badge counters
  - Visual grouping by category
  - Multiple image upload per category
  - Set default/thumbnail image
  - Individual image deletion

- ✅ **Image Management**
  - Multiple image upload (select many at once)
  - Automatic WebP conversion
  - Image compression (target: 85% quality)
  - Max file size: 5MB per image
  - Progress indicators for each upload
  - Batch upload feedback
  - Default image selection
  - Image preview before upload

- ✅ **Property Details**
  - Name
  - Category (Bedsitter, 1BR, 2BR, 3BR, 4BR)
  - Location (managed via Locations module)
  - Price per day (Ksh)
  - Bedrooms (auto-filled from category)
  - Bathrooms
  - Area (sq ft)
  - Description
  - Features (checkboxes)
  - Availability status

#### Features Module
- ✅ Add/Edit/Delete property features
- ✅ Icon selection for each feature
- ✅ Feature assignment to properties
- ✅ Reusable across properties

#### Categories Management
- ✅ **Property Categories**
  - Bedsitter (0 bedrooms)
  - 1 Bedroom
  - 2 Bedroom
  - 3 Bedroom
  - 4 Bedroom
- ✅ Add/Edit/Delete categories
- ✅ Automatic bedroom count assignment
- ✅ Category modal interface

#### Locations Management
- ✅ **Location Data**
  - Location name
  - City
  - Combined display format
- ✅ Add/Edit/Delete locations
- ✅ Location modal interface
- ✅ Dropdown selection in property forms

#### Customers Management
- ✅ **Customer Information**
  - Name
  - Email
  - Phone number
  - Registration date
- ✅ CRUD operations
- ✅ Customer search and filtering
- ✅ View customer booking history

#### Bookings Management
- ✅ **Booking Data**
  - Property details
  - Customer information
  - Check-in date
  - Check-out date
  - Total price calculation
  - Booking status
- ✅ Create/Edit/Delete bookings
- ✅ Status tracking
- ✅ Payment integration ready

#### Reports Section
- ✅ **Customers Report**
  - Total customers
  - Registration trends
  - Export functionality

- ✅ **Properties Report**
  - Total properties
  - Available vs occupied
  - Category breakdown
  - Revenue per property

- ✅ **Payments Report**
  - Total revenue
  - Payment methods
  - Outstanding payments
  - Transaction history

- ✅ **Bookings Report**
  - Total bookings
  - Booking status breakdown
  - Occupancy rates
  - Date range filtering

#### Settings
- ✅ **Hero Slider Settings**
  - Manage slider images
  - Edit slide titles/subtitles
  - Add new slides
  - Delete slides individually _(New in v1.77)_
  - Minimum 1 slide requirement
  - Image upload with WebP conversion
  - Auto-save functionality
  - Live preview

- ✅ **Email Settings**
  - EmailJS integration
  - SMTP configuration
  - Email templates
  - Test email functionality

- ✅ **Users Settings**
  - Admin user management
  - Role-based access (planned)
  - Password management

- ✅ **Maintenance Mode**
  - Enable/disable site access
  - Custom maintenance message
  - Admin bypass
  - Scheduled maintenance

- ✅ **Data Management**
  - **Sync to Supabase**
    - Manual "Sync Now" button
    - Detailed sync feedback
    - Shows what data is being synced
    - Progress indicators
    - Success/error notifications
  - **Auto-Sync**
    - Configurable interval (30s, 1min, 5min, 15min)
    - Start/Stop controls
    - Status indicator
    - Last sync timestamp
  - **Export/Import**
    - Export all data to JSON
    - Import data from JSON
    - Backup functionality
    - Data migration support

---

### 🔄 Data Synchronization

#### LocalStorage ↔ Supabase Sync
- ✅ **Bidirectional Sync**
  - Properties (with status and images)
  - Features
  - Categories
  - Locations
  - Customers
  - Bookings (with metadata)
  
- ✅ **Sync Features**
  - Manual sync via "Sync Now" button
  - Automatic periodic sync (configurable)
  - Detailed sync feedback showing:
    - Properties synced (with available/unavailable count)
    - Features synced
    - Categories synced
    - Locations synced
    - Customers synced
    - Bookings synced (with pending/confirmed/cancelled count)
  - Error handling and retry logic
  - Conflict resolution

- ✅ **Data Persistence**
  - LocalStorage for offline access
  - Supabase for cloud backup
  - Migration scripts for schema updates
  - Export/import for data portability

---

### 📱 Communication Features

#### WhatsApp Integration
- ✅ **Property Inquiries**
  - Pre-filled message templates
  - Property details auto-included
  - Direct WhatsApp Web/App launch
  - Configurable phone number

- ✅ **Booking Confirmations**
  - Automated WhatsApp notifications
  - Booking details included
  - Customer contact integration

---

### 🎨 Design System

#### Colors
```css
Primary: #36454F (Charcoal Grey)
Accent: #6B7F39 (Olive Green)
Background: #FAF4EC (Warm Beige)
Text Primary: #2C3E50 (Dark Grey)
Text Secondary: #7F8C8D (Medium Grey)
Success: #27AE60 (Green)
Error: #E74C3C (Red)
Warning: #F39C12 (Orange)
Info: #3498DB (Blue)
```

#### Typography
- **Primary Font:** Century Gothic
- **Fallback:** 'Century Gothic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Font Weights:** Normal (400), Bold (700)

#### Spacing Scale
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px

#### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- XL: 16px

---

## Technical Stack

### Frontend Framework
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool and dev server
- **React Router 7.13.0** - Routing (Data mode)

### Styling
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Custom CSS Variables** - Theme system
- **Responsive Design** - Mobile-first approach

### UI Components
- **Radix UI** - Headless component primitives
  - Dialog
  - Select
  - Checkbox
  - Tabs
  - Accordion
  - Progress
  - Scroll Area
  - And more...
- **Lucide React 0.487.0** - Icon library
- **Sonner 2.0.3** - Toast notifications

### Backend & Database
- **Supabase 2.98.0** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (ready)
  - Storage for images
  - Row Level Security (RLS)

### Additional Libraries
- **Motion (Framer Motion) 12.23.24** - Animations
- **React Slick 0.31.0** - Carousel/slider
- **React Responsive Masonry 2.7.1** - Masonry layouts
- **EmailJS 4.4.1** - Email service integration
- **Date-fns 3.6.0** - Date utilities
- **jsPDF 4.2.0** - PDF generation

### Image Optimization
- **Custom WebP Conversion** - Automatic image optimization
- **Compression** - Quality: 85%, Max dimensions: 1920x1080
- **Validation** - File type and size checks

---

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account (for production)

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd skyway-suites

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# WhatsApp Configuration
VITE_WHATSAPP_NUMBER=+254xxxxxxxxx
```

### Supabase Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Copy Project URL and Anon Key

2. **Run Database Migration**

Execute the following SQL in Supabase SQL Editor:

```sql
-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  area INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Features Table
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  bedrooms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_available ON properties(available);
CREATE INDEX IF NOT EXISTS idx_bookings_property ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
```

3. **Enable Row Level Security (RLS)** - Optional for production

```sql
-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies (example - adjust based on your needs)
CREATE POLICY "Public read access" ON properties FOR SELECT USING (true);
CREATE POLICY "Admin full access" ON properties FOR ALL USING (auth.role() = 'authenticated');
```

---

## Project Structure

```
skyway-suites/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── CategoriesModal.tsx
│   │   │   │   └── LocationsModal.tsx
│   │   │   ├── settings/
│   │   │   │   ├── SliderSettings.tsx
│   │   │   │   ├── EmailSettings.tsx
│   │   │   │   └── UsersSettings.tsx
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   └── ... (Radix UI components)
│   │   │   ├── figma/
│   │   │   │   └── ImageWithFallback.tsx
│   │   │   ├── HeroSlider.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── PropertiesPage.tsx
│   │   │   │   ├── FeaturesPage.tsx
│   │   │   │   ├── CustomersPage.tsx
│   │   │   │   ├── BookingsPage.tsx
│   │   │   │   ├── ReportsPage.tsx
│   │   │   │   └── SettingsPage.tsx
│   │   │   ├── HomePage.tsx
│   │   │   ├── PropertyDetailsPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── MaintenancePage.tsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts                    # API functions & interfaces
│   │   │   ├── supabaseClient.ts         # Supabase configuration
│   │   │   ├── syncService.ts            # Auto-sync functionality
│   │   │   ├── migrations.ts             # Data migration utilities
│   │   │   ├── emailService.ts           # EmailJS integration
│   │   │   └── whatsappService.ts        # WhatsApp integration
│   │   │
│   │   ├── utils/
│   │   │   ├── imageUtils.ts             # WebP conversion
│   │   │   ├── imageCompression.ts       # Image compression
│   │   │   ├── clipboard.ts              # Copy/download utilities
│   │   │   └── formatters.ts             # Data formatters
│   │   │
│   │   ├── App.tsx                       # Main app component
│   │   └── routes.ts                     # React Router configuration
│   │
│   ├── styles/
│   │   ├── theme.css                     # CSS variables & theme
│   │   ├── fonts.css                     # Font imports
│   │   └── app.css                       # Global styles
│   │
│   ├── imports/                          # Figma imports (if any)
│   │
│   └── index.html                        # HTML entry point
│
├── public/                               # Static assets
│
├── package.json                          # Dependencies
├── tsconfig.json                         # TypeScript config
├── vite.config.ts                        # Vite config
├── tailwind.config.js                    # Tailwind config (v4)
├── DOCUMENTATION.md                      # This file
└── README.md                             # Quick start guide
```

---

## Core Modules

### 1. Property Management (`/src/app/services/api.ts`)

#### Property Interface
```typescript
interface Property {
  id: string;
  name: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  category: 'Bedsitter' | '1 Bedroom' | '2 Bedroom' | '3 Bedroom' | '4 Bedroom';
  description: string;
  features: string[];
  images: PropertyImage[];
  available: boolean;
}

interface PropertyImage {
  id: string;
  url: string;
  isDefault: boolean;
  category?: 'Living Room' | 'Bedroom' | 'Dining' | 'Kitchen' | 'Bathroom' | 'Amenities';
}
```

#### Key Functions
- `getProperties()` - Fetch all properties
- `createProperty(data)` - Create new property
- `updateProperty(id, data)` - Update existing property
- `deleteProperty(id)` - Delete property

### 2. Booking System

#### Booking Interface
```typescript
interface Booking {
  id: string;
  propertyId: string;
  customerId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}
```

### 3. Customer Management

#### Customer Interface
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}
```

### 4. Image Processing

#### WebP Conversion
- **Location:** `/src/app/utils/imageUtils.ts`
- **Features:**
  - Automatic WebP conversion
  - Quality: 85%
  - Max dimensions: 1920x1080
  - Maintains aspect ratio
  - File size reduction

#### Compression Pipeline
```typescript
compressAndConvertToWebP(file: File) => {
  dataUrl: string;
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}
```

### 5. Sync Service (`/src/app/services/syncService.ts`)

#### Auto-Sync Functionality
- **Manual Sync:** `syncNow()`
- **Auto Sync:** `startAutoSync(interval)` / `stopAutoSync()`
- **Intervals:** 30s, 1min, 5min, 15min
- **Data Synced:**
  - Properties (with available/unavailable status)
  - Features
  - Categories
  - Locations
  - Customers
  - Bookings (with pending/confirmed/cancelled status)

---

## Database Schema

### Tables Overview

```
properties
├── id (UUID, PK)
├── name (TEXT)
├── price (NUMERIC)
├── location (TEXT)
├── bedrooms (INTEGER)
├── bathrooms (INTEGER)
├── area (INTEGER)
├── category (TEXT)
├── description (TEXT)
├── features (JSONB)
├── images (JSONB)
├── available (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

features
├── id (UUID, PK)
├── name (TEXT, UNIQUE)
├── icon (TEXT)
└── created_at (TIMESTAMP)

categories
├── id (UUID, PK)
├── name (TEXT, UNIQUE)
├── bedrooms (INTEGER)
└── created_at (TIMESTAMP)

locations
├── id (UUID, PK)
├── name (TEXT)
├── city (TEXT)
└── created_at (TIMESTAMP)

customers
├── id (UUID, PK)
├── name (TEXT)
├── email (TEXT, UNIQUE)
├── phone (TEXT)
└── created_at (TIMESTAMP)

bookings
├── id (UUID, PK)
├── property_id (UUID, FK)
├── customer_id (UUID, FK)
├── check_in (DATE)
├── check_out (DATE)
├── total_price (NUMERIC)
├── status (TEXT)
└── created_at (TIMESTAMP)
```

### Relationships
- `bookings.property_id` → `properties.id` (CASCADE DELETE)
- `bookings.customer_id` → `customers.id` (CASCADE DELETE)

### Indexes
- `idx_properties_category` - Fast category filtering
- `idx_properties_available` - Fast availability queries
- `idx_bookings_property` - Fast property bookings lookup
- `idx_bookings_customer` - Fast customer bookings lookup
- `idx_bookings_status` - Fast status filtering

---

## API Documentation

### Property API

#### Get All Properties
```typescript
getProperties(): Promise<Property[]>
```

#### Get Property by ID
```typescript
getPropertyById(id: string): Promise<Property>
```

#### Create Property
```typescript
createProperty(data: Omit<Property, 'id'>): Promise<Property>
```

#### Update Property
```typescript
updateProperty(id: string, data: Partial<Property>): Promise<Property>
```

#### Delete Property
```typescript
deleteProperty(id: string): Promise<void>
```

### Features API

```typescript
getFeatures(): Promise<Feature[]>
createFeature(data: Omit<Feature, 'id'>): Promise<Feature>
updateFeature(id: string, data: Partial<Feature>): Promise<Feature>
deleteFeature(id: string): Promise<void>
```

### Categories API

```typescript
getCategories(): Promise<Category[]>
createCategory(data: Omit<Category, 'id'>): Promise<Category>
updateCategory(id: string, data: Partial<Category>): Promise<Category>
deleteCategory(id: string): Promise<void>
```

### Locations API

```typescript
getLocations(): Promise<Location[]>
createLocation(data: Omit<Location, 'id'>): Promise<Location>
updateLocation(id: string, data: Partial<Location>): Promise<Location>
deleteLocation(id: string): Promise<void>
```

### Customers API

```typescript
getCustomers(): Promise<Customer[]>
createCustomer(data: Omit<Customer, 'id'>): Promise<Customer>
updateCustomer(id: string, data: Partial<Customer>): Promise<Customer>
deleteCustomer(id: string): Promise<void>
```

### Bookings API

```typescript
getBookings(): Promise<Booking[]>
createBooking(data: Omit<Booking, 'id'>): Promise<Booking>
updateBooking(id: string, data: Partial<Booking>): Promise<Booking>
deleteBooking(id: string): Promise<void>
```

---

## Configuration

### Tailwind CSS v4 Configuration

Located in `/src/styles/theme.css`:

```css
@theme {
  --color-primary: #36454f;
  --color-accent: #6b7f39;
  --color-background: #faf4ec;
  
  --font-family-sans: 'Century Gothic', -apple-system, sans-serif;
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

### EmailJS Setup

1. Create account at https://emailjs.com
2. Create email service
3. Create email template
4. Get Public Key
5. Add to `.env`:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### WhatsApp Configuration

Format phone number with country code:

```env
VITE_WHATSAPP_NUMBER=+254712345678
```

### Maintenance Mode

Enable via Settings page or directly in localStorage:

```javascript
localStorage.setItem('maintenanceMode', JSON.stringify({
  enabled: true,
  message: 'We are currently performing scheduled maintenance.'
}));
```

---

## Deployment

### cPanel Deployment

#### Prerequisites
- cPanel hosting account
- Node.js support
- Database access (MySQL/PostgreSQL)

#### Steps

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Upload Files**
   - Upload contents of `dist/` folder to `public_html/`
   - Upload `.htaccess` for SPA routing

3. **Configure `.htaccess`**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. **Set Environment Variables**
   - Use cPanel environment variables or
   - Create `.env.production` before build

5. **Configure Supabase**
   - Run database migration in Supabase
   - Update RLS policies
   - Enable required APIs

#### Post-Deployment

- ✅ Test all functionality
- ✅ Verify image uploads
- ✅ Test WhatsApp integration
- ✅ Check email functionality
- ✅ Verify sync operations
- ✅ Test maintenance mode

---

## Version History

### v1.82 (Current) - March 1, 2026
**Major Update: Auto-Connect Supabase + Real-Time Sync**

#### 🚀 New Features
- ✅ **Default Supabase Connection**
  - App now connects to Supabase automatically on every load
  - Pre-configured with default database credentials
  - Users can override credentials in Settings > Database
  - No manual setup required - works out of the box
  
- ✅ **Real-Time Auto-Sync to Supabase**
  - All CRUD operations now automatically sync to Supabase
  - **Properties**: Create/Update/Delete instantly syncs
  - **Features**: All operations sync automatically
  - **Customers**: Real-time sync to cloud
  - **Bookings**: Immediate cloud backup
  - Console logging for sync status verification
  
- ✅ **Hybrid Storage Strategy**
  - Always saves to localStorage first (instant + offline support)
  - Then automatically syncs to Supabase (cloud backup)
  - Continues to work even if Supabase sync fails
  - Best of both worlds: speed + reliability

- ✅ **Singleton Supabase Client**
  - Smart client reuse - only creates new client if credentials change
  - Prevents multiple GoTrueClient instances warning
  - Unique storage key to avoid conflicts
  - Better performance and memory usage

#### 🐛 Bug Fixes
- ✅ **Fixed Multiple GoTrueClient Instances Warning**
  - Implemented proper singleton pattern for Supabase client
  - Reuses existing client when credentials haven't changed
  - Only creates new client when credentials are updated
  - Added unique auth storage key: `skyway-suites-auth`
  - Eliminated duplicate client instances
  - Console now shows: "♻️ Reusing existing Supabase client"

#### 🔧 Technical Implementation

**Modified `/src/app/services/initialization.ts`:**
```typescript
// Default credentials (can be overridden in Settings)
const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://kxsavebrzaczjscyroth.supabase.co',
  anonKey: 'eyJhbG...' // Your actual key
};

// Auto-connect on app load
initializeSupabase(supabaseConfig);
syncSupabaseToLocalStorage(); // Pull latest data
```

**Modified `/src/app/services/storage.ts`:**
```typescript
async createProperty(property: Property): Promise<Property> {
  // 1. Save to localStorage first (fast + offline)
  const localProperty = this.createPropertyLocal(property);
  
  // 2. Sync to Supabase if connected (cloud backup)
  const supabase = getSupabaseClient();
  if (supabase) {
    await this.createPropertyRemote(property);
    console.log('✅ Property synced to Supabase');
  }
  
  return localProperty;
}
// Same pattern for update, delete, features, customers, bookings
```

**Modified `/src/app/services/supabaseClient.ts`:**
```typescript
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabaseClient;
};

export const initializeSupabase = (config: {
  url: string;
  anonKey: string;
}): void => {
  const { url, anonKey } = config;
  
  // Check if existing client matches new credentials
  if (supabaseClient && supabaseClient.url === url && supabaseClient.key === anonKey) {
    console.log('♻️ Reusing existing Supabase client');
    return;
  }
  
  // Create new client with unique auth storage key
  supabaseClient = createClient(url, anonKey, {
    auth: {
      storageKey: 'skyway-suites-auth'
    }
  });
  
  console.log('🔄 Connecting to Supabase...');
  // Add any additional initialization here if needed
};
```

#### ✨ What This Fixes

**Before:**
- ❌ Properties saved to localStorage only
- ❌ No automatic Supabase sync
- ❌ Data not backed up to cloud
- ❌ Manual sync required via "Push to Supabase" button

**After:**
- ✅ Properties save to localStorage AND Supabase automatically
- ✅ Every create/update/delete syncs instantly
- ✅ Cloud backup happens automatically
- ✅ Manual sync button still available as backup

#### 🎯 How It Works Now

**On App Load:**
1. App checks localStorage for saved Supabase credentials
2. If not found, uses default credentials (your database)
3. Connects to Supabase automatically
4. Pulls latest data from cloud to localStorage
5. Ready to use!

**When Adding a Property:**
1. Property saved to localStorage (instant)
2. Property synced to Supabase (automatic)
3. Console logs: "✅ Property synced to Supabase"
4. Done! Property is in both local storage and cloud

**Using Your Own Database:**
1. Go to Settings > Database
2. Enter your Supabase URL and Anon Key
3. Click "Test Connection"
4. Click "Push to Supabase" to upload your data
5. Your credentials are saved and used on next load

#### 📊 Console Logging

Watch the browser console for real-time sync status:
```
🔄 Using saved Supabase credentials...
🔄 Connecting to Supabase...
✅ Supabase connected successfully
🔄 Pulling latest data from Supabase...
✅ Data synced from Supabase to localStorage
✅ Property synced to Supabase
✅ Feature synced to Supabase
✅ Customer synced to Supabase
✅ Booking synced to Supabase
```

#### 🔐 Default Database Credentials

**Supabase URL:** `https://kxsavebrzaczjscyroth.supabase.co`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4c2F2ZWJyemFjempzY3lyb3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNTgyODksImV4cCI6MjA4NzkzNDI4OX0.DacfUFOOnZX0l5lv3keyPcjRGT7phS28l-4AZlIjFVM`

These credentials are:
- ✅ Pre-configured in the app
- ✅ Saved to localStorage on first load
- ✅ Used automatically on every app load
- ✅ Can be overridden by users in Settings

#### 🎉 User Benefits

- 💾 **No setup required** - Works immediately
- 🔄 **Automatic sync** - No manual buttons to click
- 🌐 **Cloud backup** - All data backed up in real-time
- 📱 **Cross-device** - Pull latest data on any device
- 🔌 **Offline support** - localStorage ensures offline access
- 🔧 **Customizable** - Use your own database if needed
- 🐛 **Easy debugging** - Console logs show sync status

#### 🚀 Migration Notes

**For Existing Users:**
1. App will auto-connect on next page load
2. Existing localStorage data is preserved
3. Data will be synced to Supabase automatically
4. No manual action required

**For New Users:**
1. App connects to default database immediately
2. Pulls any existing data from cloud
3. Start using the app right away
4. All operations auto-sync to cloud

---

### v1.81 - March 1, 2026
**Feature: Functional Backup & Restore System**

#### New Features
- ✅ **Download Backup File**
  - Click "Download Backup File" button to download all data as JSON
  - Automatic file naming: `skyway-suites-backup-YYYY-MM-DD.json`
  - Includes all data: Properties, Features, Customers, Bookings, Payments, Settings
  - Shows detailed success message with item counts
  - Timestamp and version included in backup file
  
- ✅ **Restore from Backup File**
  - Select .json backup file to restore
  - Comprehensive confirmation dialog showing backup details
  - Validates backup file format and structure
  - Automatic page reload after successful restore
  - Clear file input after operation
  
- ✅ **Enhanced Backup UI**
  - Download icon on backup button
  - Upload icon on restore button
  - File input accepts only .json files
  - Helpful tooltips and instructions
  - Updated warning message with tips

#### Bug Fixes
- ✅ **Fixed Input Component Ref Warning**
  - Updated Input component to use `React.forwardRef()`
  - Properly forwards refs to underlying input element
  - Eliminates console warnings about ref access
  - Enables ref usage in SettingsPage for file input control

#### Technical Implementation
- Modified `/src/app/pages/admin/SettingsPage.tsx`:
  - Implemented `handleBackup()` function:
    - Collects all localStorage data
    - Creates JSON blob with metadata
    - Triggers browser download
    - Shows success toast with statistics
  - Implemented `handleRestoreFileSelect()` function:
    - Reads and validates JSON file
    - Shows detailed confirmation dialog
    - Restores all data to localStorage
    - Reloads page to apply changes
  - Added `restoreFileInputRef` for file input control
  - Updated button labels and icons
  
- Modified `/src/app/components/ui/input.tsx`:
  - Wrapped component with `React.forwardRef()`
  - Added ref parameter and forwarding
  - Added displayName for debugging
  - Maintains all existing functionality

#### Backup File Structure
```json
{
  "timestamp": "2026-03-01T12:00:00.000Z",
  "version": "1.81",
  "data": {
    "properties": [...],
    "features": [...],
    "customers": [...],
    "bookings": [...],
    "payments": [...],
    "menuPages": [...],
    "appUsers": [...],
    "generalSettings": {...},
    "contactDetailsSettings": {...},
    "heroSlides": [...],
    "databaseSettings": {...}
  }
}
```

#### What This Enables
- ✅ **Local Backups:** Download complete data snapshots
- ✅ **Data Migration:** Transfer data between browsers/devices
- ✅ **Disaster Recovery:** Restore from backup if data is lost
- ✅ **Version Control:** Keep multiple backup versions
- ✅ **Testing:** Backup before major changes
- ✅ **Offline Access:** Store backups independently

#### User Benefits
- 💾 One-click backup download
- 📤 Easy restore from file
- 🔍 See exactly what's in each backup
- ⚠️ Confirmation before overwriting data
- ✅ Automatic page refresh after restore
- 📊 Detailed success/error feedback

---

### v1.80 - March 1, 2026
**Major Enhancement: Bidirectional Sync & Cross-Browser Support**

#### New Features
- ✅ **Pull from Supabase Button**
  - Download latest data from cloud to current browser
  - Blue button with Download icon
  - Automatic page reload after successful pull
  - Status tracking for last pull time
  
- ✅ **Auto-Pull on App Load**
  - When app loads with Supabase credentials, automatically pulls data
  - Ensures fresh data in every browser session
  - Console logging for debugging
  
- ✅ **Renamed Sync Button to "Push to Supabase"**
  - Clearer naming: "Push" vs "Pull"
  - Upload icon for visual clarity
  - Green button to distinguish from Pull
  
- ✅ **Enhanced Sync Status Display**
  - Separate timestamps for Pull and Push operations
  - Visual icons (Download for pull, Upload for push)
  - Last pull time and last push time shown separately

#### Problem Solved
**ISSUE:** When connecting Supabase in one browser, then switching to another browser, the app lost all data because:
- Supabase credentials were only in localStorage (browser-specific)
- No mechanism to fetch data FROM Supabase, only push TO it
- Each browser had its own isolated localStorage

**SOLUTION:**
1. **Auto-initialization:** App automatically connects to Supabase on load using saved credentials
2. **Auto-pull:** After connection, app automatically pulls latest data from cloud
3. **Manual pull button:** Users can manually refresh data from cloud anytime
4. **Bidirectional sync:** Clear separation between Push (upload) and Pull (download)

#### Technical Changes
- Modified `/src/app/services/initialization.ts`:
  - Added `syncSupabaseToLocalStorage()` call after auto-init
  - Automatic data pull on every app load
  - Console logging for debugging
  
- Enhanced `/src/app/pages/admin/SettingsPage.tsx`:
  - Added `handlePullFromSupabase()` function
  - Added "Pull from Supabase" button (blue with Download icon)
  - Renamed "Sync Now" to "Push to Supabase" (green with Upload icon)
  - Updated sync info UI to explain bidirectional sync
  - Added `pulling` state and `lastPullTime` tracking
  - Page auto-reload after successful pull
  
- Updated UI text and tooltips:
  - **Pull from Supabase:** "Download latest data from cloud to this browser"
  - **Push to Supabase:** "Upload data from this browser to cloud"
  - Added helpful tip: "💡 Use 'Pull' when switching browsers to get your data!"

#### How It Works Now

**First-time setup:**
1. Open app in Browser A
2. Go to Settings → Database
3. Connect to Supabase
4. Push your data to cloud

**Switching to Browser B:**
1. Open app in Browser B
2. App auto-connects to Supabase (reads credentials from cloud if set up)
3. App auto-pulls data from Supabase
4. All your data appears in Browser B! ✅

**Manual refresh:**
- Click "Pull from Supabase" button anytime to get latest data
- Page reloads automatically to show updated data

#### What This Fixes
- ✅ Cross-browser data synchronization
- ✅ No data loss when switching browsers
- ✅ Fresh data on every app load
- ✅ Clear push/pull workflow
- ✅ Better user understanding of sync direction
- ✅ Works perfectly on live cPanel deployment

---

### v1.79 - March 1, 2026
**Critical Fix: Auto-Initialize Supabase on App Load**

#### Bug Fixes
- ✅ **Fixed Supabase Sync Issue on Live Site**
  - Supabase client now auto-initializes on app load
  - Reads saved credentials from localStorage
  - No need to manually reconnect after page refresh
  - Automatic connection when app starts
  
#### Technical Changes
- Modified `/src/app/services/initialization.ts`:
  - Added auto-init logic for Supabase
  - Checks for saved credentials in localStorage
  - Automatically calls `initializeSupabase()` if credentials exist
  - Console logging for connection status
- Enhanced error logging in `/src/app/services/migrations.ts`:
  - Detailed error messages for sync failures
  - JSON stringified error details in console

#### How It Works
```typescript
// On app load, automatically connect to Supabase if credentials exist
const databaseSettings = localStorage.getItem('databaseSettings');
if (databaseSettings) {
  const settings = JSON.parse(databaseSettings);
  if (settings.supabaseUrl && settings.supabaseAnonKey) {
    initializeSupabase({
      url: settings.supabaseUrl,
      anonKey: settings.supabaseAnonKey,
    });
  }
}
```

#### What This Fixes
- ✅ Live site sync now works immediately after page load
- ✅ No need to visit Settings and click "Connect" after refresh
- ✅ Sync button works on first click
- ✅ Auto-sync starts working immediately
- ✅ All CRUD operations persist to Supabase

---

### v1.78 - March 1, 2026
**Major Feature: Categorized Photo Upload**

#### New Features
- ✅ **Categorized Photo Upload for Properties**
  - 6 category tabs: Living Room, Bedroom, Dining, Kitchen, Bathroom, Amenities
  - Visual badge counters on each category
  - Images grouped by category in preview
  - Upload multiple images per category
  - Set default image across all categories
  
#### Updates
- ✅ Updated `PropertyImage` interface to include `category` field
- ✅ Enhanced property upload UI with category tabs
- ✅ Improved image organization and display
- ✅ Added category-based image filtering

#### Technical Changes
- Modified `/src/app/services/api.ts` - Added category to PropertyImage
- Enhanced `/src/app/pages/admin/PropertiesPage.tsx` - Category upload UI
- Updated image upload state management

---

### v1.77 - February 28, 2026
**Feature: Individual Slide Deletion**

#### New Features
- ✅ Delete individual hero slider slides
- ✅ Add new slides dynamically
- ✅ Minimum 1 slide requirement protection
- ✅ Confirmation dialog for deletions
- ✅ Auto-save after slide operations

#### UI Improvements
- ✅ Red "Delete" button on each slide (top-right)
- ✅ "Add New Slide" button with Plus icon
- ✅ Visual indicators for required slides
- ✅ Improved slide management layout

---

### v1.76 - February 27, 2026
**Feature: Enhanced Multi-Upload**

#### New Features
- ✅ Multiple image selection for property uploads
- ✅ Enhanced button text: "Upload Images (Multiple)"
- ✅ Helpful instructions for multi-select
- ✅ Individual progress tracking per image
- ✅ Batch upload notifications

#### Improvements
- ✅ Smart success/error feedback
- ✅ Compression stats for batch uploads
- ✅ Better UX for selecting multiple files

---

### v1.75 - February 26, 2026
**Feature: Enhanced Sync Feedback**

#### New Features
- ✅ Detailed sync feedback in Settings
- ✅ Shows exact counts of synced data
- ✅ Property status breakdown (available/unavailable)
- ✅ Booking status breakdown (pending/confirmed/cancelled)
- ✅ Real-time sync progress indicators

#### Improvements
- ✅ Better visual feedback during sync
- ✅ Clearer error messages
- ✅ Enhanced sync status display

---

### v1.74 - February 25, 2026
**Deployment: cPanel Success**

#### Achievements
- ✅ Successfully deployed to cPanel
- ✅ Resolved database table creation issues
- ✅ Ran simplified SQL migration in Supabase
- ✅ Fixed routing for SPA

#### Technical
- ✅ Configured `.htaccess` for SPA routing
- ✅ Set up environment variables
- ✅ Optimized build for production

---

### v1.73 - February 24, 2026
**Backend: Complete Supabase Integration**

#### New Features
- ✅ Supabase database setup
- ✅ All CRUD operations connected
- ✅ Real-time sync functionality
- ✅ Data migration scripts

---

### v1.72 - February 23, 2026
**Feature: Maintenance Mode**

#### New Features
- ✅ Maintenance mode toggle in Settings
- ✅ Custom maintenance message
- ✅ Admin bypass functionality
- ✅ Dedicated maintenance page

---

### v1.71 - February 22, 2026
**Feature: Fullscreen Image Lightbox**

#### New Features
- ✅ Click to expand property images
- ✅ Navigation arrows (prev/next)
- ✅ Close button and ESC key support
- ✅ Smooth transitions

---

### v1.70 - February 21, 2026
**Feature: Automatic WebP Conversion**

#### New Features
- ✅ All image uploads auto-convert to WebP
- ✅ Compression to 85% quality
- ✅ Max dimensions: 1920x1080
- ✅ Maintains aspect ratio
- ✅ Progress indicators

#### Performance
- ✅ Reduced image sizes by ~60-80%
- ✅ Faster page loads
- ✅ Better SEO scores

---

### v1.69 - February 20, 2026
**Feature: WhatsApp Integration**

#### New Features
- ✅ WhatsApp inquiry button on property details
- ✅ Pre-filled message templates
- ✅ Property details auto-included
- ✅ Configurable phone number

---

### v1.68 - February 19, 2026
**Backend: Reports Module**

#### New Features
- ✅ Customers Report
- ✅ Properties Report
- ✅ Payments Report
- ✅ Bookings Report
- ✅ Export functionality

---

### v1.67 - February 18, 2026
**Backend: Settings Page**

#### New Features
- ✅ Hero Slider Settings
- ✅ Email Settings (EmailJS)
- ✅ Users Settings
- ✅ Data Export/Import

---

### v1.66 - February 17, 2026
**Backend: Bookings Management**

#### New Features
- ✅ Create/Edit/Delete bookings
- ✅ Status tracking
- ✅ Customer assignment
- ✅ Price calculation

---

### v1.65 - February 16, 2026
**Backend: Customers Management**

#### New Features
- ✅ CRUD operations for customers
- ✅ Email validation
- ✅ Phone number formatting
- ✅ Search and filter

---

### v1.64 - February 15, 2026
**Backend: Locations Module**

#### New Features
- ✅ Add/Edit/Delete locations
- ✅ City management
- ✅ Location modal interface

---

### v1.63 - February 14, 2026
**Backend: Categories Module**

#### New Features
- ✅ Property categories management
- ✅ Automatic bedroom assignment
- ✅ Category modal interface

---

### v1.62 - February 13, 2026
**Backend: Features Management**

#### New Features
- ✅ CRUD operations for features
- ✅ Icon selection
- ✅ Feature assignment to properties

---

### v1.61 - February 12, 2026
**Backend: Properties CRUD**

#### New Features
- ✅ Full CRUD for properties
- ✅ Image upload functionality
- ✅ Feature selection
- ✅ Availability toggle

---

### v1.60 - February 11, 2026
**Backend: Admin Dashboard**

#### New Features
- ✅ Admin layout with sidebar
- ✅ Dashboard analytics
- ✅ Quick stats cards
- ✅ Navigation menu

---

### v1.50 - February 10, 2026
**Frontend: Property Details Page**

#### New Features
- ✅ Detailed property view
- ✅ Image gallery
- ✅ Feature icons
- ✅ Pricing information
- ✅ Contact buttons

---

### v1.40 - February 9, 2026
**Frontend: Category Filtering**

#### New Features
- ✅ Category filter tabs
- ✅ Real-time filtering
- ✅ Active state indicators
- ✅ Smooth transitions

---

### v1.30 - February 8, 2026
**Frontend: Property Cards Grid**

#### New Features
- ✅ Responsive grid layout
- ✅ Property cards with hover effects
- ✅ Image thumbnails
- ✅ Quick property info

---

### v1.20 - February 7, 2026
**Frontend: Hero Slider**

#### New Features
- ✅ Auto-play slider
- ✅ Multiple slides support
- ✅ Navigation indicators
- ✅ Responsive images

---

### v1.10 - February 6, 2026
**Frontend: Navigation & Layout**

#### New Features
- ✅ Sticky navigation bar
- ✅ Mobile hamburger menu
- ✅ Logo branding
- ✅ Footer with links

---

### v1.00 - February 5, 2026
**Initial Release**

#### Foundation
- ✅ React + TypeScript setup
- ✅ Tailwind CSS v4 integration
- ✅ Vite build configuration
- ✅ Project structure
- ✅ Design system foundation

---

## Troubleshooting

### Common Issues

#### 1. Images Not Uploading

**Symptoms:**
- Upload progress stuck
- Error messages during upload
- Images not appearing

**Solutions:**
```javascript
// Check file size
console.log('File size:', file.size / 1024 / 1024, 'MB');

// Check file type
console.log('File type:', file.type);

// Verify WebP conversion
import { convertToWebP } from './utils/imageUtils';
const result = await convertToWebP(file);
console.log('Conversion result:', result);
```

**Common Fixes:**
- Ensure file is under 5MB
- Check file format (JPG, PNG, WebP accepted)
- Clear browser cache
- Check console for errors

---

#### 2. Supabase Sync Failing

**Symptoms:**
- "Sync failed" errors
- Data not persisting
- Missing records

**Solutions:**
```javascript
// Check Supabase connection
import { supabase } from './services/supabaseClient';
const { data, error } = await supabase.from('properties').select('count');
console.log('Connection test:', { data, error });

// Verify environment variables
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
```

**Common Fixes:**
- Verify `.env` configuration
- Check Supabase dashboard for errors
- Ensure tables exist (run migration)
- Check RLS policies
- Verify internet connection

---

#### 3. Slider Not Auto-Playing

**Symptoms:**
- Slider stuck on first slide
- No automatic progression

**Solutions:**
```javascript
// Check slider settings in localStorage
const slides = JSON.parse(localStorage.getItem('heroSlides') || '[]');
console.log('Slides:', slides);

// Verify slider component is mounted
// Check browser console for errors
```

**Common Fixes:**
- Ensure at least 2 slides exist
- Check for JavaScript errors
- Clear localStorage and re-add slides
- Verify React Slick is installed

---

#### 4. WhatsApp Integration Not Working

**Symptoms:**
- Button not opening WhatsApp
- Incorrect phone number
- Message not pre-filled

**Solutions:**
```javascript
// Check WhatsApp number format
console.log('WhatsApp number:', import.meta.env.VITE_WHATSAPP_NUMBER);

// Test WhatsApp URL
const testUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`;
console.log('WhatsApp URL:', testUrl);
```

**Common Fixes:**
- Ensure phone number includes country code (+254)
- Remove spaces from phone number
- Test URL in browser directly
- Check mobile vs desktop WhatsApp app

---

#### 5. Maintenance Mode Issues

**Symptoms:**
- Can't disable maintenance mode
- Users see maintenance page when it's off

**Solutions:**
```javascript
// Check maintenance mode status
const maintenanceMode = JSON.parse(
  localStorage.getItem('maintenanceMode') || '{"enabled": false}'
);
console.log('Maintenance mode:', maintenanceMode);

// Force disable
localStorage.setItem('maintenanceMode', JSON.stringify({ enabled: false }));
```

**Common Fixes:**
- Clear localStorage
- Use admin panel to toggle
- Check for typos in localStorage key

---

#### 6. Category Images Not Showing

**Symptoms:**
- Uploaded images don't appear in correct category
- Category tabs show wrong counts

**Solutions:**
```javascript
// Verify category assignment
const images = uploadingImages.filter(img => img.category === 'Living Room');
console.log('Living Room images:', images);

// Check image data structure
console.log('All images:', uploadingImages);
```

**Common Fixes:**
- Ensure category is selected before upload
- Verify ImageUpload interface includes category
- Re-upload images if needed
- Clear and re-add images

---

### Debug Mode

Enable detailed logging:

```javascript
// Add to top of App.tsx
window.DEBUG = true;

// In any file
if (window.DEBUG) {
  console.log('Debug info:', data);
}
```

---

### Performance Optimization

#### Image Loading
```javascript
// Use lazy loading
<img loading="lazy" src={imageUrl} />

// Optimize image sizes
const optimizedImage = await compressAndConvertToWebP(file, {
  maxWidth: 1200,
  quality: 0.8
});
```

#### Database Queries
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_property_location ON properties(location);
CREATE INDEX idx_booking_dates ON bookings(check_in, check_out);
```

---

### Getting Help

#### Resources
- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite Docs:** https://vitejs.dev

#### Contact
For issues or questions:
1. Check this documentation first
2. Review console errors
3. Test in incognito mode
4. Check network tab for failed requests
5. Verify environment variables

---

## Future Enhancements

### Planned Features

#### Phase 1 (Next Release)
- [ ] Property Details Page with categorized masonry gallery
- [ ] Tab-based image viewing by category
- [ ] Enhanced lightbox with category filtering
- [ ] Virtual tours integration
- [ ] 360° property views

#### Phase 2
- [ ] User authentication (landlords vs tenants)
- [ ] Online payment integration (M-Pesa)
- [ ] Automated booking confirmations via email
- [ ] SMS notifications
- [ ] Review and rating system

#### Phase 3
- [ ] Mobile app (React Native)
- [ ] Advanced search filters
- [ ] Map view for properties
- [ ] Saved searches and favorites
- [ ] Property comparison tool

#### Phase 4
- [ ] Analytics dashboard
- [ ] Revenue tracking
- [ ] Occupancy reporting
- [ ] Automated invoicing
- [ ] Multi-language support

---

## Best Practices

### Code Standards

```typescript
// Use TypeScript for type safety
interface PropertyData {
  name: string;
  price: number;
  // ... other fields
}

// Use async/await for API calls
const fetchData = async () => {
  try {
    const data = await getProperties();
    return data;
  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to fetch data');
  }
};

// Component naming: PascalCase
export const PropertyCard = ({ property }: { property: Property }) => {
  // ...
};

// Utility functions: camelCase
export const formatCurrency = (amount: number) => {
  return `Ksh ${amount.toLocaleString()}`;
};
```

### State Management

```typescript
// Use useState for local state
const [properties, setProperties] = useState<Property[]>([]);

// Use useEffect for side effects
useEffect(() => {
  loadProperties();
}, []);

// Avoid prop drilling - use context when needed
const PropertyContext = createContext<PropertyContextType | null>(null);
```

### Performance

```typescript
// Memoize expensive calculations
const filteredProperties = useMemo(
  () => properties.filter(p => p.category === selectedCategory),
  [properties, selectedCategory]
);

// Debounce search inputs
const debouncedSearch = useMemo(
  () => debounce((query) => performSearch(query), 300),
  []
);
```

### Error Handling

```typescript
// Always handle errors
try {
  await createProperty(data);
  toast.success('Property created');
} catch (error) {
  console.error('Error creating property:', error);
  toast.error(error instanceof Error ? error.message : 'Failed to create property');
}
```

---

## Security Considerations

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use `.env.example` for documentation
- ✅ Rotate API keys regularly

### Supabase Security
- ✅ Enable Row Level Security (RLS)
- ✅ Create appropriate policies
- ✅ Use service role key only server-side
- ✅ Validate all inputs

### Image Uploads
- ✅ Validate file types
- ✅ Limit file sizes
- ✅ Sanitize file names
- ✅ Use content delivery network (CDN)

### Data Validation
```typescript
// Validate inputs
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Sanitize user inputs
const sanitizeInput = (input: string) => {
  return input.trim().replace(/[<>]/g, '');
};
```

---

## Contributing Guidelines

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
```

### Commit Message Format

```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
style: Format code
refactor: Refactor component
test: Add tests
chore: Update dependencies
```

---

## License

**Proprietary Software**  
© 2026 Skyway Suites. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

## Changelog Summary

- **v1.80:** Auto-initialize Supabase on app load
- **v1.78:** Categorized photo upload (Living Room, Bedroom, etc.)
- **v1.77:** Individual slide deletion with protection
- **v1.76:** Enhanced multi-image upload with batch feedback
- **v1.75:** Detailed sync feedback with status breakdowns
- **v1.74:** Successful cPanel deployment
- **v1.73:** Complete Supabase integration
- **v1.72:** Maintenance mode implementation
- **v1.71:** Fullscreen image lightbox
- **v1.70:** Automatic WebP conversion
- **v1.69:** WhatsApp integration
- **v1.60-68:** Admin dashboard modules
- **v1.50:** Property details page
- **v1.40:** Category filtering
- **v1.30:** Property cards grid
- **v1.20:** Hero slider
- **v1.10:** Navigation & layout
- **v1.00:** Initial release

---

**Last Updated:** March 1, 2026 | **Version:** v1.82  
**Maintained by:** Skyway Suites Development Team