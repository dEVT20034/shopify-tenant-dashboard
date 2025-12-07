# Deployment Guide - Shopify Analytics Platform

## 🚀 Deploy to Vercel

This guide will walk you through deploying your Shopify Analytics Platform to Vercel.

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ A [GitHub](https://github.com) account
2. ✅ A [Vercel](https://vercel.com) account
3. ✅ A [Turso](https://turso.tech) database (already set up)
4. ✅ Shopify API credentials (already configured)

---

## Step 1: Push Code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Shopify Analytics Platform"

# Add your remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Import Project to Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository
5. Click **"Import"**

---

## Step 3: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

### Database (Turso)
```
TURSO_CONNECTION_URL=libsql://[your-database].turso.io
TURSO_AUTH_TOKEN=[your-turso-auth-token]
```

### Authentication (NextAuth)
```
NEXTAUTH_URL=https://your-deployed-url.vercel.app
NEXTAUTH_SECRET=[generate-using-command-below]
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Shopify Integration
```
SHOPIFY_API_KEY=1999b2303b346baa294f825cda8c7c47
SHOPIFY_API_SECRET=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
```

### App Configuration
```
NODE_ENV=production
```

---

## Step 4: Deploy

1. Click **"Deploy"** button in Vercel
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll receive a production URL like:
   ```
   https://your-app-name.vercel.app
   ```

---

## Step 5: Update NEXTAUTH_URL

After first deployment:

1. Copy your production URL
2. Go to **Project Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` to your actual Vercel URL
4. Redeploy the project

---

## Step 6: Verify Deployment

Test your deployed application:

1. Visit your Vercel URL
2. Navigate to `/onboarding` to create a test tenant
3. Login at `/login` with created credentials
4. Check `/dashboard` to see analytics

---

## 🔄 Automatic Deployments

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every pull request gets a preview URL

---

## 📊 Monitoring & Logs

### View Logs
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **"Deployments"**
4. Click on any deployment to view logs

### Runtime Logs
Click **"Functions"** tab to see serverless function logs

---

## 🔐 Security Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] `NEXTAUTH_SECRET` is a strong, random string
- [ ] Database credentials are kept secure
- [ ] Shopify API keys are for the correct environment
- [ ] CORS and security headers are configured
- [ ] SSL/HTTPS is enabled (automatic on Vercel)

---

## 🛠️ Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Ensure all required env vars are set in Vercel dashboard

**Error: Database connection failed**
- Verify `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` are correct
- Check Turso database is active

### Runtime Issues

**Authentication not working**
- Verify `NEXTAUTH_URL` matches your actual domain
- Check `NEXTAUTH_SECRET` is set correctly

**Shopify sync fails**
- Verify Shopify credentials are correct
- Check webhook configuration in Shopify admin

---

## 📞 Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Check application logs in Vercel dashboard

---

## 🎉 Success!

Your Shopify Analytics Platform is now live! 

**Next Steps:**
- Set up custom domain (optional)
- Configure Shopify webhooks for real-time updates
- Monitor performance in Vercel Analytics
- Scale as needed with Vercel's infrastructure

**Your URLs:**
- Production: `https://your-app.vercel.app`
- Dashboard: `https://your-app.vercel.app/dashboard`
- Onboarding: `https://your-app.vercel.app/onboarding`
