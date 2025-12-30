# Looma Schools Dashboard

A comprehensive management dashboard for monitoring and managing Looma educational devices deployed across schools in Nepal. Built with Next.js, TypeScript, and MongoDB.

**Live URL**: [schools.looma.website](https://schools.looma.website)

## Overview

This dashboard enables Looma administrators to:
- View and monitor all Looma schools on an interactive Nepal map
- Track device status (online/offline/maintenance) in real-time
- Manage school information and contacts
- View QR code scan logs from field staff
- Remote access to connected Looma devices (terminal interface)
- Import schools via spreadsheet (CSV)
- Role-based user authentication

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4, Radix UI (shadcn/ui) |
| Database | MongoDB |
| Authentication | Session-based with bcrypt |
| Maps | Interactive SVG Nepal map |

## Quick Start

### Prerequisites
- Node.js 18+ (or Bun)
- MongoDB instance (optional - demo mode available)

### Installation

```bash
# Clone repository
git clone <repository-url>
```
***Frontend:***

```bash
cd looma-dashboard/frontend

# Install dependencies for frontend
npm install

# Start development server
npm run dev
```

***Backend:***

```bash
cd ../backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies for frontend
pip install -r requirements.txt

# Start development server
fastapi dev app/main.py
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Mode

If `MONGODB_URI` is not configured, the app runs in **demo mode** with 144 sample schools across Nepal's 7 provinces.

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create database user with read/write permissions
4. Whitelist your IP address
5. Get connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/looma-dashboard
   ```
6. Add to `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/looma-dashboard
   MONGODB_DB_NAME="looma-dashboard"
   ```

### Option 2: Local MongoDB

```bash
# Install MongoDB locally
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB
mongod

# Set connection string
MONGODB_URI=mongodb://localhost:27017/looma-dashboard
```

### Database Seeding

Populate the database with sample data:

```bash
# TypeScript seeder
npx tsx scripts/seed-database.ts

```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | No (demo mode) |
| `SESSION_SECRET` | Session encryption key | Recommended |

Create `.env.local`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/looma-dashboard
SESSION_SECRET=your-secure-random-string-here
```

## Default Login Credentials

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |
| staff | staff123 | Staff |
| viewer | view123 | Viewer |

## Project Structure

```
looma-dashboard/
├── app/                      # Next.js App Router
│   ├── api/                  # REST API endpoints
│   │   ├── auth/             # Authentication
│   │   ├── schools/          # School CRUD
│   │   ├── qr-scans/         # QR scan logs
│   │   └── access-logs/      # Access audit trail
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── dashboard.tsx         # Main dashboard
│   ├── nepal-map.tsx         # Interactive map
│   ├── school-list.tsx       # Table view
│   ├── school-card.tsx       # Card view
│   ├── admin-panel.tsx       # Admin features
│   └── spreadsheet-import.tsx # CSV import
├── lib/                      # Utilities
│   ├── db/                   # Database layer
│   │   ├── mongodb.ts        # Connection
│   │   ├── models.ts         # Data models
│   │   └── *-service.ts      # Services
│   ├── types.ts              # TypeScript types
│   └── utils.ts              # Helpers
├── hooks/                    # React hooks
├── public/                   # Static assets
├── scripts/                  # Database seeders
└── .vscode/                  # VSCode config
```

## API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Current user info |
| PATCH | `/api/auth/change_password` | Update user password |

### Schools
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools` | List all schools |
| GET | `/api/schools?search=query` | Search schools |
| GET | `/api/schools?stats=true` | Get statistics |
| POST | `/api/schools` | Create school |
| GET | `/api/schools/:id` | Get school details |
| PUT | `/api/schools/:id` | Update school |
| DELETE | `/api/schools/:id` | Delete school |
| PATCH | `/api/schools/:id/status` | Update status |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/add` | Add a user |
| DELETE | `/api/users/:user_id` | Delete a user |
| PATCH | `/api/users/:user_id` | Update user data |
| PATCH | `/api/users/me` | Update your own user data |

### Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/qr-scans` | QR scan history |
| GET | `/api/access-logs` | Access audit logs |

## User Roles & Permissions

| Role | View Schools | Edit Schools | Manage Users | Remote Access |
|------|--------------|--------------|--------------|---------------|
| Admin | Yes | Yes | Yes | Yes |
| Staff | Yes | Yes | No | Yes |
| Viewer | Yes | No | No | No |

## Development

### VSCode Setup

The project includes VSCode configuration. Install recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript

### Available Scripts

```bash
npm run dev      # Development server (port 5000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Replit
1. Set `MONGODB_URI` in Secrets
2. Click "Publish"

### Vercel
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Features

### Dashboard Views
- **Map View**: Interactive Nepal map with color-coded status pins
- **List View**: Sortable, filterable table
- **Card View**: Visual grid with school photos

### School Management
- Add schools manually or via CSV import
- Assign Looma Device IDs
- Track device status and last seen time
- View QR scan and access logs

### Admin Panel
- User management
- Bulk import from spreadsheet
- Export data to CSV
- System settings

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/xyz`)
3. Commit changes (`git commit -m 'Add xyz'`)
4. Push to branch (`git push origin feature/xyz`)
5. Open Pull Request

## License

Proprietary - Looma Education Company

## Support

Contact the Looma Education technical team for support.

---

**Looma Education** - Quality education for Nepal
