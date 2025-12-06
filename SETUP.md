# Quick Setup Guide

This guide will help you set up and run the Shopify Analytics Platform locally.

## Step 1: Install Dependencies

```bash
bun install
# or
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Database - Update with your PostgreSQL credentials
DATABASE_URL="postgresql://postgres:password@localhost:5432/shopify_analytics?schema=public"

# NextAuth - Generate a random secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run-this-command-to-generate: openssl rand -base64 32"

# Shopify - These are already provided in the requirements
SHOPIFY_API_KEY="c462ce0b857426dd78b076230690a4a6"
SHOPIFY_API_SECRET="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"

# App Configuration
NODE_ENV="development"
```

### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and replace the `NEXTAUTH_SECRET` value in your `.env` file.

## Step 3: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

If you have PostgreSQL installed locally:

```bash
# Create the database
createdb shopify_analytics

# Update DATABASE_URL in .env with your credentials
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/shopify_analytics?schema=public"
```

### Option B: Docker PostgreSQL

```bash
# Run PostgreSQL in Docker
docker run --name shopify-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=shopify_analytics \
  -p 5432:5432 \
  -d postgres:15

# DATABASE_URL will be:
DATABASE_URL="postgresql://postgres:password@localhost:5432/shopify_analytics?schema=public"
```

### Option C: Cloud Database (Recommended for Production)

Use one of these managed database services:
- **Vercel Postgres** - Easy integration with Vercel deployment
- **Supabase** - Free tier with 500MB database
- **Railway** - Simple PostgreSQL hosting
- **Neon** - Serverless PostgreSQL

## Step 4: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# (Optional) View your database in Prisma Studio
npx prisma studio
```

## Step 5: Run Development Server

```bash
bun dev
# or
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 6: Create Your First Account

1. Visit [http://localhost:3000](http://localhost:3000)
2. Click **"Get Started"** or navigate to [/onboarding](http://localhost:3000/onboarding)
3. Fill in the onboarding form:
   ```
   Store Name: My Test Store
   Shopify Domain: mystore.myshopify.com
   Access Token: (leave blank for now)
   First Name: John
   Last Name: Doe
   Email: admin@example.com
   Password: password123 (minimum 8 characters)
   ```
4. Click **"Create account"**
5. You'll be redirected to the login page
6. Sign in with your email and password
7. You'll see your dashboard!

## Step 7: Test the Dashboard

After logging in, you should see:

- **Landing Page** with animated hero section
- **Dashboard** with:
  - Summary statistics cards (Revenue, Orders, Customers, Products)
  - Orders timeline chart
  - Top customers bar chart
  - Recent orders table
  
Initially, all values will be 0 since no data has been synced yet.

## Step 8: Add Sample Data (Optional)

To see the dashboard with data, you can:

### Option A: Use Prisma Studio

```bash
npx prisma studio
```

1. Open Prisma Studio (usually at http://localhost:5555)
2. Add sample customers, products, and orders manually
3. Make sure to use the correct `tenantId` from your tenant

### Option B: Connect to Shopify

If you have a Shopify development store:

1. Get your store's access token from Shopify Admin
2. Update your tenant in the database with the access token
3. Run the sync endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/shopify/sync
   ```

### Option C: Use SQL

Connect to your database and run sample inserts (replace `YOUR_TENANT_ID`):

```sql
-- Add a sample customer
INSERT INTO "Customer" (id, "shopifyCustomerId", email, "firstName", "lastName", "totalSpent", "ordersCount", "tenantId", "createdAt", "updatedAt")
VALUES ('cust1', 'shop123', 'customer@example.com', 'Jane', 'Smith', 1250.00, 5, 'YOUR_TENANT_ID', NOW(), NOW());

-- Add a sample order
INSERT INTO "Order" (id, "shopifyOrderId", "orderNumber", "customerId", "customerEmail", "totalPrice", "subtotalPrice", "totalTax", "currency", "financialStatus", "lineItems", "tenantId", "orderCreatedAt", "createdAt", "updatedAt")
VALUES ('order1', 'shop456', '1001', 'cust1', 'customer@example.com', 250.00, 230.00, 20.00, 'USD', 'paid', '[]', 'YOUR_TENANT_ID', NOW(), NOW(), NOW());
```

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check that PostgreSQL is running
2. Verify your `DATABASE_URL` in `.env`
3. Ensure the database exists
4. Check firewall settings

### Prisma Issues

```bash
# If you get Prisma errors, try:
npx prisma generate --force
npx prisma db push --force-reset
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
PORT=3001 bun dev
```

### Authentication Issues

If you can't log in:

1. Check that `NEXTAUTH_SECRET` is set in `.env`
2. Clear browser cookies for localhost:3000
3. Restart the dev server

## Testing API Endpoints

### Create a Tenant

```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "tenantName": "API Test Store",
    "shopifyDomain": "apitest.myshopify.com",
    "shopifyApiKey": "test-key",
    "shopifyApiSecret": "test-secret",
    "adminEmail": "apitest@example.com",
    "adminPassword": "password123",
    "adminFirstName": "API",
    "adminLastName": "User"
  }'
```

### Get Dashboard Summary (Requires Authentication)

First login, then use the session cookie:

```bash
# Dashboard summary
curl http://localhost:3000/api/dashboard/summary \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

## Next Steps

1. **Connect to Real Shopify Store**: Get your store's API credentials and access token
2. **Set Up Webhooks**: Configure Shopify webhooks to point to your endpoints
3. **Deploy to Production**: Follow the deployment guide in README.md
4. **Customize UI**: Modify components to match your brand
5. **Add Features**: Extend with additional analytics and reports

## Useful Commands

```bash
# Development
bun dev                    # Start dev server
bun build                  # Build for production
bun start                  # Start production server

# Database
npx prisma studio          # Open database GUI
npx prisma generate        # Generate Prisma Client
npx prisma db push         # Push schema to database
npx prisma migrate dev     # Create a migration
npx prisma migrate reset   # Reset database (⚠️ deletes all data)

# Code Quality
bun run lint              # Run ESLint
bun run type-check        # Run TypeScript compiler check
```

## Support

If you encounter any issues:
1. Check the error logs in the terminal
2. Review the troubleshooting section above
3. Ensure all environment variables are set correctly
4. Check that your database is running and accessible

---

Happy coding! 🚀
