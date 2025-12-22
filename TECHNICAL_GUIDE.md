# Looma Schools Dashboard - Technical Guide

This document provides complete technical details about every folder, file, and configuration in this project. Use this guide to understand how the system works and how to modify or connect to MongoDB.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Configuration Files](#configuration-files)
4. [Application Flow](#application-flow)
5. [MongoDB Connection Guide](#mongodb-connection-guide)
6. [API Endpoints](#api-endpoints)
7. [Database Models](#database-models)
8. [Component Reference](#component-reference)
9. [Authentication System](#authentication-system)
10. [Demo Mode vs Production Mode](#demo-mode-vs-production-mode)

---

## Project Overview

**Name**: Looma Schools Dashboard  
**Version**: 1.0.0  
**Framework**: Next.js 16 with App Router  
**Language**: TypeScript  
**Database**: MongoDB  
**Styling**: Tailwind CSS v4 + shadcn/ui  

The dashboard monitors Looma educational devices across 70+ schools in Nepal. It provides:
- Real-time device status monitoring
- Interactive Nepal map with school locations
- Role-based access control (Admin, Staff, Viewer)
- School management (add, edit, delete)
- CSV bulk import functionality
- QR scan logging
- Access audit trail

---

## Directory Structure

```
looma-dashboard/
├── app/                    # Next.js App Router (pages and API routes)
│   ├── api/               # Backend API endpoints
│   ├── globals.css        # Global styles and Tailwind configuration
│   ├── layout.tsx         # Root HTML layout
│   └── page.tsx           # Main entry point (login/dashboard switching)
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   └── *.tsx             # Application-specific components
├── hooks/                 # Custom React hooks
├── lib/                   # Core utilities and database
│   └── db/               # MongoDB services and models
├── public/               # Static assets (images, icons)
├── scripts/              # Database seeding scripts
└── [config files]        # Various configuration files
```

---

## Configuration Files

### 1. package.json

**Location**: `/package.json`  
**Purpose**: Defines project metadata, scripts, and dependencies

```json
{
  "name": "looma-schools-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "next build",      // Build for production
    "dev": "next dev",          // Start development server
    "lint": "eslint .",         // Run linting
    "start": "next start"       // Start production server
  }
}
```

**Key Dependencies**:
| Package | Purpose |
|---------|---------|
| `next` | React framework with server-side rendering |
| `react`, `react-dom` | React library |
| `mongodb` | MongoDB Node.js driver |
| `bcryptjs` | Password hashing for authentication |
| `tailwindcss` | Utility-first CSS framework |
| `@radix-ui/*` | Accessible UI primitives (used by shadcn) |
| `lucide-react` | Icon library |
| `recharts` | Charting library for statistics |
| `zod` | Schema validation |
| `react-hook-form` | Form handling |

**How to modify**:
- Add new dependencies: `npm install <package-name>`
- Remove dependencies: `npm uninstall <package-name>`
- After changes, run `npm install` to update `pnpm-lock.yaml`

---

### 2. next.config.mjs

**Location**: `/next.config.mjs`  
**Purpose**: Next.js framework configuration

```javascript
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,    // Skip TypeScript errors during build
  },
  images: {
    unoptimized: true,          // Disable image optimization (for Replit)
  },
  allowedDevOrigins: [          // Allow Replit preview domains
    "*.replit.dev",
    "*.picard.replit.dev",
    "*.repl.co",
  ],
}
```

**What each setting does**:
- `ignoreBuildErrors`: Allows build even with TypeScript warnings
- `unoptimized`: Disables Next.js image optimization (needed for some hosting)
- `allowedDevOrigins`: Whitelist of domains that can access dev server (required for Replit's iframe preview)

**Common modifications**:
```javascript
// Add custom domain for production
allowedDevOrigins: [
  "*.replit.dev",
  "*.yourdomain.com",
],

// Enable image optimization for production
images: {
  unoptimized: false,
  domains: ['your-image-host.com'],
},
```

---

### 3. tsconfig.json

**Location**: `/tsconfig.json`  
**Purpose**: TypeScript compiler configuration

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],  // Available APIs
    "allowJs": true,                            // Allow JavaScript files
    "target": "ES6",                            // Compile to ES6
    "skipLibCheck": true,                       // Skip type checking node_modules
    "strict": true,                             // Enable strict type checking
    "noEmit": true,                             // Don't output JS (Next.js handles this)
    "esModuleInterop": true,                    // CommonJS/ES module compatibility
    "module": "esnext",                         // Use ES modules
    "moduleResolution": "bundler",              // Use bundler resolution
    "resolveJsonModule": true,                  // Allow importing JSON
    "isolatedModules": true,                    // Required for Next.js
    "jsx": "react-jsx",                         // JSX transform
    "incremental": true,                        // Faster rebuilds
    "paths": {
      "@/*": ["./*"]                            // Path alias: @/ = project root
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Path Aliases**:
- `@/` maps to project root
- Example: `import { Button } from "@/components/ui/button"` = `import { Button } from "./components/ui/button"`

---

### 4. postcss.config.mjs

**Location**: `/postcss.config.mjs`  
**Purpose**: PostCSS configuration for CSS processing

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},  // Process Tailwind CSS
  },
}
```

**How it works**:
- PostCSS processes CSS files during build
- The Tailwind plugin converts Tailwind classes to actual CSS
- No modification needed unless adding other CSS processors

---

### 5. components.json

**Location**: `/components.json`  
**Purpose**: shadcn/ui component library configuration

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",           // UI style variant
  "rsc": true,                   // React Server Components support
  "tsx": true,                   // Use TypeScript
  "tailwind": {
    "config": "",                // Tailwind config path
    "css": "app/globals.css",    // Main CSS file
    "baseColor": "neutral",      // Color palette
    "cssVariables": true,        // Use CSS variables for theming
    "prefix": ""                 // No class prefix
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"        // Icon library
}
```

**How to add new shadcn components**:
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
```

---

### 6. .env.example

**Location**: `/.env.example`  
**Purpose**: Template for environment variables

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/looma_dashboard

# Session Security
SESSION_SECRET=your-secret-key-here

# Environment
NODE_ENV=development
```

**Required Variables**:
| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes* | MongoDB connection string |
| `SESSION_SECRET` | Recommended | Random string for session encryption |
| `NODE_ENV` | No | `development` or `production` |

*Without MONGODB_URI, the app runs in demo mode with mock data.

---

## Application Flow

### Startup Sequence

```
1. User visits website
   └─> app/layout.tsx (HTML structure)
       └─> app/page.tsx (Main page)
           └─> AuthProvider wraps app
               └─> Checks /api/auth/me for existing session
                   ├─> If authenticated: Show Dashboard
                   └─> If not authenticated: Show LoginForm
```

### Authentication Flow

```
1. User enters credentials on LoginForm
   └─> lib/auth-context.tsx calls authAPI.login()
       └─> lib/api-client.ts sends POST to /api/auth/login
           └─> app/api/auth/login/route.ts
               └─> lib/db/user-service.ts
                   ├─> getUserByUsername() - Find user
                   ├─> validatePassword() - Check password
                   ├─> createSession() - Generate session token
                   └─> Return user data + set cookie
```

### Data Flow (Schools Example)

```
1. Dashboard loads
   └─> components/dashboard.tsx fetches schools
       └─> lib/api-client.ts calls GET /api/schools
           └─> app/api/schools/route.ts
               └─> lib/db/school-service.ts
                   └─> getDatabase() from lib/db/mongodb.ts
                       ├─> If MONGODB_URI valid: Connect to MongoDB
                       └─> If invalid/missing: Return null (demo mode)
                           └─> Use mock data from lib/mock-data.ts
```

---

## MongoDB Connection Guide

### How the Connection Works

**File**: `lib/db/mongodb.ts`

```typescript
import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI || ""

// Validates MongoDB URI format
function isValidMongoUri(uri: string): boolean {
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")
}

// Check if running in demo mode
export function isDemoMode(): boolean {
  return !uri || !isValidMongoUri(uri)
}

// Get database connection
export async function getDatabase(): Promise<Db | null> {
  // If no valid URI, return null (triggers demo mode)
  if (!uri || !isValidMongoUri(uri)) {
    console.warn("MONGODB_URI not set or invalid - running in demo mode")
    return null
  }

  // Development: Reuse connection across hot reloads
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // Production: Create single connection
    if (!clientPromise) {
      client = new MongoClient(uri, options)
      clientPromise = client.connect()
    }
  }

  const connectedClient = await clientPromise
  return connectedClient.db("looma_dashboard")  // Database name
}
```

### Step-by-Step: Connect to MongoDB

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**
   - Go to https://cloud.mongodb.com
   - Sign up for free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose M0 (Free tier)
   - Select region closest to Nepal (Singapore or Mumbai)
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access" in sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

6. **Add to Replit**
   - In Replit, click "Secrets" tab (lock icon)
   - Add new secret:
     - Key: `MONGODB_URI`
     - Value: `mongodb+srv://username:password@cluster.mongodb.net/looma_dashboard`
   - Click "Add Secret"

7. **Restart the Application**
   - Restart the workflow to apply changes

#### Option B: Local MongoDB

1. **Install MongoDB**
   ```bash
   # macOS
   brew install mongodb-community
   
   # Ubuntu
   sudo apt install mongodb
   
   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Start MongoDB**
   ```bash
   mongod --dbpath /path/to/data
   ```

3. **Set Environment Variable**
   ```bash
   MONGODB_URI=mongodb://localhost:47017/looma_dashboard
   ```

### Verify Connection

After setting `MONGODB_URI`, restart the app and check the console:
- **Success**: No warning messages, data persists
- **Failure**: Shows "MONGODB_URI not set or invalid - running in demo mode"

### Seed Initial Data

After connecting MongoDB, populate with sample data:

```bash
# Using TypeScript seeder
npx tsx scripts/seed-database.ts

# Using Python seeder (requires pymongo)
pip install pymongo
python scripts/seed-database.py
```

---

## API Endpoints

All API routes are in `app/api/` using Next.js App Router conventions.

### Authentication APIs

#### POST /api/auth/login
**File**: `app/api/auth/login/route.ts`

Authenticates user and creates session.

```typescript
// Request
{
  "username": "admin",
  "password": "admin123"
}

// Response (success)
{
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@looma.edu.np",
    "role": "admin"
  },
  "token": "session-token-here"
}

// Response (failure)
{ "error": "Invalid credentials" }
```

**How it works**:
1. Receives username/password from request body
2. Calls `getUserByUsername()` to find user in database
3. Calls `validatePassword()` to verify password
   - Demo mode: Compares plain text passwords
   - Production mode: Uses bcrypt to compare hashed passwords
4. Creates session token with `createSession()`
5. Sets `session_token` cookie (httpOnly, secure in production)
6. Returns user data

---

#### GET /api/auth/me
**File**: `app/api/auth/me/route.ts`

Returns current authenticated user.

```typescript
// Response (authenticated)
{
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@looma.edu.np",
    "role": "admin"
  }
}

// Response (not authenticated)
{ "error": "Not authenticated" }
```

**How it works**:
1. Reads `session_token` from cookies
2. Calls `getSessionByToken()` to validate session
3. If valid, calls `getUserById()` to get user data
4. Returns user without password field

---

#### POST /api/auth/logout
**File**: `app/api/auth/logout/route.ts`

Logs out current user.

```typescript
// Response
{ "success": true }
```

**How it works**:
1. Reads `session_token` from cookies
2. Calls `deleteSession()` to remove from database
3. Clears the cookie
4. Returns success

---

### Schools APIs

#### GET /api/schools
**File**: `app/api/schools/route.ts`

Returns all schools.

```typescript
// Response
{
  "schools": [
    {
      "id": "...",
      "name": "Shree Himalaya Secondary School",
      "latitude": 27.7172,
      "longitude": 85.3240,
      "status": "online",
      "province": "Bagmati",
      "district": "Kathmandu",
      // ... more fields
    }
  ]
}
```

---

#### POST /api/schools
**File**: `app/api/schools/route.ts`

Creates a new school.

```typescript
// Request
{
  "name": "New School",
  "latitude": 27.5,
  "longitude": 85.5,
  "province": "Bagmati",
  "district": "Kathmandu",
  "palika": "Kathmandu Metropolitan",
  "loomaId": "NPL-SCH-NEW-001",
  "contact": {
    "email": "school@example.com",
    "phone": "+977-1234567890",
    "headmaster": "Name Here"
  }
}

// Response
{
  "school": { /* created school data */ }
}
```

---

#### GET /api/schools/[id]
**File**: `app/api/schools/[id]/route.ts`

Returns single school by ID.

---

#### PUT /api/schools/[id]
**File**: `app/api/schools/[id]/route.ts`

Updates a school.

---

#### DELETE /api/schools/[id]
**File**: `app/api/schools/[id]/route.ts`

Deletes a school.

---

#### PUT /api/schools/[id]/status
**File**: `app/api/schools/[id]/status/route.ts`

Updates school status (online/offline/maintenance).

---

### Users APIs

#### GET /api/users
**File**: `app/api/users/route.ts`

Returns all users (admin only).

#### POST /api/users
Creates new user.

#### DELETE /api/users/[id]
**File**: `app/api/users/[id]/route.ts`

Deletes a user.

#### PUT /api/users/[id]
Updates user role.

---

### Other APIs

#### GET /api/qr-scans
**File**: `app/api/qr-scans/route.ts`

Returns QR scan history from field staff visits.

#### GET /api/access-logs
**File**: `app/api/access-logs/route.ts`

Returns audit trail of dashboard access.

---

## Database Models

**File**: `lib/db/models.ts`

### SchoolDocument

Represents a school with Looma devices.

```typescript
interface SchoolDocument {
  _id?: ObjectId              // MongoDB ID
  name: string                // School name
  latitude: number            // GPS latitude
  longitude: number           // GPS longitude
  contact: {
    email: string             // Contact email
    phone: string             // Phone number
    headmaster: string        // Headmaster name
  }
  province: string            // Province name
  district: string            // District name
  palika: string              // Local government unit
  status: "online" | "offline" | "maintenance"
  lastSeen: Date              // Last device activity
  loomaId: string             // Unique Looma device ID
  loomaCount?: number         // Number of Looma devices
  looma: {
    id: string                // Device ID
    serialNumber: string      // Hardware serial
    version: string           // Software version
    lastUpdate: Date          // Last software update
  }
  createdAt: Date
  updatedAt: Date
}
```

### UserDocument

Represents a dashboard user.

```typescript
interface UserDocument {
  _id?: ObjectId
  username: string            // Login username
  email: string               // Email address
  password: string            // Hashed password (bcrypt)
  role: "admin" | "staff" | "viewer"
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date            // Last login timestamp
}
```

### SessionDocument

Represents an active login session.

```typescript
interface SessionDocument {
  _id?: ObjectId
  userId: ObjectId            // Reference to user
  token: string               // Random session token
  expiresAt: Date             // Session expiration (7 days)
  createdAt: Date
}
```

### QRScanDocument

Represents a QR code scan by field staff.

```typescript
interface QRScanDocument {
  _id?: ObjectId
  schoolId: ObjectId          // School that was visited
  loomaId: string             // Looma device scanned
  timestamp: Date             // When scan occurred
  staffName: string           // Staff member name
  notes?: string              // Optional notes
}
```

### AccessLogDocument

Audit trail entry.

```typescript
interface AccessLogDocument {
  _id?: ObjectId
  schoolId: ObjectId          // Related school
  userId: ObjectId            // User who performed action
  timestamp: Date             // When action occurred
  user: string                // Username
  action: string              // Action description
  details?: string            // Additional details
  ipAddress?: string          // IP address
}
```

### Collection Names

```typescript
const COLLECTIONS = {
  SCHOOLS: "schools",
  USERS: "users",
  QR_SCANS: "qr_scans",
  ACCESS_LOGS: "access_logs",
  SESSIONS: "sessions",
}
```

---

## Component Reference

### Main Application Components

| File | Purpose |
|------|---------|
| `components/dashboard.tsx` | Main dashboard layout, tab navigation, data fetching |
| `components/login-form.tsx` | User login form |
| `components/dashboard-header.tsx` | Top navigation bar with user menu |
| `components/nepal-map.tsx` | Interactive SVG map of Nepal with school markers |
| `components/school-list.tsx` | Table view of schools with sorting/filtering |
| `components/school-card.tsx` | Card grid view of schools |
| `components/school-detail-modal.tsx` | Modal showing school details |
| `components/stats-overview.tsx` | Statistics cards (total schools, online, etc.) |
| `components/admin-panel.tsx` | Admin features: user management, data import |
| `components/spreadsheet-import.tsx` | CSV file import functionality |
| `components/theme-provider.tsx` | Dark/light theme switching |

### UI Components (shadcn/ui)

Located in `components/ui/`, these are reusable base components:

| Component | Purpose |
|-----------|---------|
| `button.tsx` | Button with variants (primary, secondary, outline, etc.) |
| `card.tsx` | Card container with header, content, footer |
| `dialog.tsx` | Modal dialog |
| `dropdown-menu.tsx` | Dropdown menus |
| `form.tsx` | Form with validation (react-hook-form integration) |
| `input.tsx` | Text input field |
| `select.tsx` | Dropdown select |
| `table.tsx` | Data table |
| `tabs.tsx` | Tab navigation |
| `toast.tsx` | Toast notifications |
| `badge.tsx` | Status badges |
| `avatar.tsx` | User avatars |
| `scroll-area.tsx` | Scrollable container |
| `separator.tsx` | Visual separator |
| `skeleton.tsx` | Loading skeleton |
| `switch.tsx` | Toggle switch |
| `tooltip.tsx` | Hover tooltips |

---

## Authentication System

### Session-Based Auth

This app uses session-based authentication:

1. **Login**: User submits credentials
2. **Validation**: Server verifies against database
3. **Session Creation**: Random 32-byte token generated
4. **Cookie**: Token stored as httpOnly cookie
5. **Subsequent Requests**: Cookie sent automatically
6. **Session Lookup**: Server validates token on each request

### Password Security

**File**: `lib/db/user-service.ts`

```typescript
// Demo mode: Plain text comparison
if (isDemoMode()) {
  const plainPasswords = {
    admin: "admin123",
    staff: "staff123",
    viewer: "viewer123",
  }
  return plainPasswords[user.username] === password
}

// Production: Bcrypt comparison
return bcrypt.compare(password, user.password)
```

### Creating New Users

With MongoDB connected:

```typescript
// New users are created with hashed passwords
const hashedPassword = await bcrypt.hash(user.password, 12)
```

### Role Permissions

| Role | Can View | Can Edit | Can Delete | Can Manage Users |
|------|----------|----------|------------|------------------|
| Viewer | Yes | No | No | No |
| Staff | Yes | Yes | No | No |
| Admin | Yes | Yes | Yes | Yes |

---

## Demo Mode vs Production Mode

### How Demo Mode Works

When `MONGODB_URI` is missing or invalid:

1. `getDatabase()` returns `null`
2. All service functions check for `null` database
3. If null, they use mock data from `lib/mock-data.ts`
4. Sessions stored in memory (lost on restart)
5. Changes don't persist

### Mock Data Location

**File**: `lib/mock-data.ts`

Contains sample schools, users, and other data for demo purposes.

### Switching Modes

| Condition | Mode |
|-----------|------|
| No `MONGODB_URI` | Demo |
| Invalid `MONGODB_URI` (doesn't start with mongodb://) | Demo |
| Valid `MONGODB_URI` | Production |

### Feature Differences

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| Data persistence | No | Yes |
| User creation | Memory only | Saved to database |
| Password hashing | Plain text | Bcrypt |
| Sessions | Memory (lost on restart) | Database |
| Multiple users | Works in single session | Full support |

---

## Files Reference

### /app/ Directory

| Path | Type | Purpose |
|------|------|---------|
| `app/layout.tsx` | Page | Root HTML layout, fonts, metadata |
| `app/page.tsx` | Page | Main page, auth switching |
| `app/globals.css` | CSS | Tailwind config, CSS variables |
| `app/api/auth/login/route.ts` | API | Login endpoint |
| `app/api/auth/logout/route.ts` | API | Logout endpoint |
| `app/api/auth/me/route.ts` | API | Current user endpoint |
| `app/api/schools/route.ts` | API | List/create schools |
| `app/api/schools/[id]/route.ts` | API | Get/update/delete school |
| `app/api/schools/[id]/status/route.ts` | API | Update school status |
| `app/api/users/route.ts` | API | List/create users |
| `app/api/users/[id]/route.ts` | API | Delete/update user |
| `app/api/qr-scans/route.ts` | API | QR scan history |
| `app/api/access-logs/route.ts` | API | Access audit logs |

### /lib/ Directory

| Path | Purpose |
|------|---------|
| `lib/db/mongodb.ts` | MongoDB connection management |
| `lib/db/models.ts` | TypeScript interfaces for documents |
| `lib/db/user-service.ts` | User CRUD, authentication |
| `lib/db/school-service.ts` | School CRUD operations |
| `lib/db/qr-scan-service.ts` | QR scan operations |
| `lib/db/access-log-service.ts` | Access log operations |
| `lib/api-client.ts` | Frontend API wrapper |
| `lib/auth-context.tsx` | React auth context |
| `lib/mock-data.ts` | Demo mode mock data |
| `lib/types.ts` | Frontend TypeScript types |
| `lib/utils.ts` | Utility functions (cn, etc.) |

### /hooks/ Directory

| Path | Purpose |
|------|---------|
| `hooks/use-mobile.ts` | Detect mobile viewport |
| `hooks/use-toast.ts` | Toast notification hook |

### /scripts/ Directory

| Path | Purpose |
|------|---------|
| `scripts/seed-database.ts` | TypeScript database seeder |
| `scripts/seed-database.py` | Python database seeder |

### /public/ Directory

| Path | Purpose |
|------|---------|
| `public/schools/*.jpg` | Sample school photos |
| `public/hero-bg.jpg` | Login page background |
| `public/icon.svg` | Favicon SVG |
| `public/*.png` | Various icon sizes |

---

## Making Changes

### Change Database Name

In `lib/db/mongodb.ts`, change:
```typescript
return connectedClient.db("looma_dashboard")  // Change this
```

### Add New Collection

1. Add interface to `lib/db/models.ts`
2. Add collection name to `COLLECTIONS`
3. Create service file in `lib/db/`
4. Create API route in `app/api/`

### Add New API Endpoint

1. Create folder in `app/api/`
2. Add `route.ts` file
3. Export HTTP method functions (GET, POST, PUT, DELETE)

### Add New Component

1. Create file in `components/`
2. Import and use in parent component

### Add New UI Component

```bash
npx shadcn@latest add [component-name]
```

---

## Troubleshooting

### "Invalid credentials" Error

1. Check if MONGODB_URI is valid
2. Verify it starts with `mongodb://` or `mongodb+srv://`
3. If invalid, app uses demo mode credentials:
   - admin / admin123
   - staff / staff123
   - viewer / viewer123

### MongoDB Connection Failed

1. Check connection string format
2. Verify username/password
3. Check IP whitelist in Atlas (allow 0.0.0.0/0)
4. Test connection with MongoDB Compass

### Data Not Persisting

1. Verify you're in production mode (check console for "demo mode" warning)
2. Ensure MONGODB_URI is correctly set
3. Restart the application after changing secrets

### Page Shows Loading Forever

1. Check browser console for errors
2. Check server logs for API errors
3. Verify database connection

---

## Environment Variables Summary

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | For production | None (demo mode) | MongoDB connection string |
| `SESSION_SECRET` | Recommended | None | Session encryption key |
| `NODE_ENV` | No | development | Environment mode |

---

## Quick Reference

### Start Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Seed Database
```bash
npx tsx scripts/seed-database.ts
```

### Add shadcn Component
```bash
npx shadcn@latest add [name]
```

### Default Credentials (Demo Mode)
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| staff | staff123 | Staff |
| viewer | viewer123 | Viewer |
