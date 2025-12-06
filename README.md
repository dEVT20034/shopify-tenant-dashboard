# Shopify Analytics Platform

A premium **AAA-class multi-tenant Shopify analytics platform** built with Next.js 15, featuring enterprise-grade architecture, real-time data synchronization, and a stunning Apple/Nike-inspired UI.

## 🌟 Features

- **Multi-tenant Architecture**: Secure tenant isolation with PostgreSQL and Row-Level Security
- **Real-time Sync**: Automatic data synchronization via Shopify webhooks and scheduled cron jobs
- **Premium UI/UX**: Apple/Nike-inspired design with Framer Motion animations
- **Advanced Analytics**: Beautiful charts and visualizations with Recharts
- **Secure Authentication**: Email-based auth with NextAuth and tenant scoping
- **Type-safe**: Full TypeScript with Prisma ORM
- **Production-ready**: Optimized for Vercel deployment with edge functions

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js with email/password
- **Shopify Integration**: Shopify API with webhooks
- **Charts**: Recharts for data visualization
- **Deployment**: Vercel with cron jobs

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Shopify development store (optional for testing)

### Installation

1. **Clone and install dependencies**:
```bash
npm install
# or
bun install
```

2. **Set up environment variables**:

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shopify_analytics?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Shopify
SHOPIFY_API_KEY="c462ce0b857426dd78b076230690a4a6"
SHOPIFY_API_SECRET="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"

# App Configuration
NODE_ENV="development"
```

Generate a secret for NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

3. **Set up the database**:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

4. **Run the development server**:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating Your First Tenant

1. Visit `http://localhost:3000/onboarding`
2. Fill in the form:
   - **Store Name**: Your store name
   - **Shopify Domain**: your-store.myshopify.com
   - **Access Token**: (optional) Your Shopify access token
   - **Admin Details**: Email and password for login
3. Click "Create account"
4. Sign in at `/login` with your credentials

### Dashboard Features

Once logged in, you'll see:

- **Summary Stats**: Total revenue, orders, customers, and products
- **Orders Timeline**: Line chart showing orders over the last 30 days
- **Top Customers**: Bar chart of highest-spending customers
- **Recent Orders**: Table of latest transactions

### API Endpoints

#### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

#### Tenants
- `POST /api/tenants` - Create new tenant/store

#### Dashboard Data (Protected)
- `GET /api/dashboard/summary` - Summary statistics
- `GET /api/dashboard/orders-timeline?days=30` - Orders over time

#### Resources (Protected)
- `GET /api/products` - List products
- `GET /api/customers` - List customers
- `GET /api/orders` - List orders

#### Shopify Integration
- `POST /api/shopify/webhook/orders` - Order webhooks
- `POST /api/shopify/webhook/products` - Product webhooks
- `POST /api/shopify/webhook/customers` - Customer webhooks
- `POST /api/shopify/sync` - Manual sync (also runs via cron)

## 🔐 Security Features

- **Tenant Isolation**: All queries filtered by `tenantId`
- **Session-based Auth**: Secure JWT sessions with NextAuth
- **Protected Routes**: Middleware protects dashboard and API routes
- **Environment Variables**: Secrets stored securely
- **Row-Level Security**: (Optional) PostgreSQL RLS for database-level protection

## 📊 Database Schema

Key models with tenant isolation:

- **Tenant**: Store information and Shopify credentials
- **User**: Admin/user accounts (belongs to tenant)
- **Product**: Shopify products (isolated by tenant)
- **Customer**: Customer data (isolated by tenant)
- **Order**: Order history (isolated by tenant)
- **CartEvent**: Abandoned cart tracking

All tables include `tenantId` for complete data isolation.

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

2. **Import to Vercel**:
   - Connect your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables**:
   - Add all variables from `.env` in Vercel dashboard
   - For production, use Vercel Postgres or your own database

4. **Deploy**:
   - Vercel will automatically deploy
   - The `vercel.json` configures cron jobs for syncing

### Database Setup

For production, use:
- **Vercel Postgres** (automatic integration)
- **Supabase** (PostgreSQL with built-in tools)
- **Railway** (easy PostgreSQL hosting)
- **AWS RDS** (enterprise-grade)

Run migrations in production:
```bash
npx prisma db push
```

## 🔄 Shopify Integration

### Setting Up Webhooks

1. In your Shopify admin, go to Settings > Notifications > Webhooks
2. Create webhooks for:
   - **Orders** → `https://your-domain.com/api/shopify/webhook/orders`
   - **Products** → `https://your-domain.com/api/shopify/webhook/products`
   - **Customers** → `https://your-domain.com/api/shopify/webhook/customers`

3. Set the header `x-shopify-shop-domain` to your shop domain

### Automatic Sync

The cron job in `vercel.json` runs every 6 hours:
```json
{
  "crons": [{
    "path": "/api/shopify/sync",
    "schedule": "0 */6 * * *"
  }]
}
```

## 🎨 UI/UX Design

The platform features a premium design inspired by Apple and Nike:

- **Color Palette**: Grayscale with black accents
- **Typography**: Inter font with careful hierarchy
- **Animations**: Subtle Framer Motion transitions
- **Layout**: Generous whitespace and rounded corners
- **Components**: Glass-morphism effects and hover states
- **Responsive**: Mobile-first with fluid layouts

## 📝 Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth
│   │   │   ├── dashboard/     # Dashboard data
│   │   │   ├── shopify/       # Shopify webhooks & sync
│   │   │   ├── tenants/       # Tenant management
│   │   │   ├── products/      # Products API
│   │   │   ├── customers/     # Customers API
│   │   │   └── orders/        # Orders API
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/             # Login page
│   │   ├── onboarding/        # Onboarding page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # Shadcn components
│   │   ├── DashboardHeader.tsx
│   │   ├── StatsCard.tsx
│   │   ├── OrdersChart.tsx
│   │   ├── TopCustomersChart.tsx
│   │   ├── RecentOrders.tsx
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client
│   │   └── shopify.ts         # Shopify API client
│   ├── types/
│   │   └── next-auth.d.ts     # TypeScript definitions
│   └── middleware.ts          # Route protection
├── vercel.json                # Vercel config with cron
├── .env.example               # Environment template
└── package.json
```

## 🛠️ Development

### Database Migrations

```bash
# Create a migration
npx prisma migrate dev --name your_migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# View data in Prisma Studio
npx prisma studio
```

### Testing API Endpoints

Use the built-in examples or tools like Postman/Insomnia:

```bash
# Create a tenant
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "Test Store",
    "shopifyDomain": "test.myshopify.com",
    "shopifyApiKey": "key",
    "shopifyApiSecret": "secret",
    "adminEmail": "admin@test.com",
    "adminPassword": "password123",
    "adminFirstName": "John",
    "adminLastName": "Doe"
  }'
```

## 🎯 Roadmap

- [ ] Add product management UI
- [ ] Implement customer detail pages
- [ ] Add export functionality (CSV/PDF)
- [ ] Create custom tenant themes
- [ ] Add email notifications
- [ ] Implement 2FA authentication
- [ ] Add advanced filtering and search
- [ ] Create mobile app
- [ ] Add AI-powered insights

## 📄 License

MIT License - feel free to use this project for commercial or personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Prisma, and modern web technologies.