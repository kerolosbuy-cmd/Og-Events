# Deployment Guide

## Overview

This guide covers deploying the OG Event application to various hosting platforms. The application is a Next.js 16 app with Supabase backend.

**Prerequisites:**

- Supabase project set up
- Git repository
- Environment variables configured

---

## Table of Contents

1. [Quick Deploy (Vercel)](#quick-deploy-vercel)
2. [Netlify Deployment](#netlify-deployment)
3. [Self-Hosted Deployment](#self-hosted-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Post-Deployment](#post-deployment)

---

## Quick Deploy (Vercel)

**Recommended** for Next.js applications.

### Step 1: Push to Git

```bash
git add .
git commit -m "feat: ready for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 3: Configure Environment Variables

Add in Vercel dashboard under "Settings → Environment Variables":

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### Step 4: Deploy

Click "Deploy" - Vercel will automatically build and deploy your app.

**Live URL**: `https://your-app.vercel.app`

---

## Netlify Deployment

### Step 1: Create netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

### Step 2: Deploy

1. Visit [netlify.com](https://netlify.com)
2. Click "Add new site"
3. Connect Git repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Step 3: Add Environment Variables

In Netlify dashboard under "Site settings → Environment variables"

---

## Self-Hosted Deployment

### Using Docker

#### Create Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Build and Run

```bash
# Build image
docker build -t og-event .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  -e SUPABASE_SERVICE_ROLE_KEY=your-service-key \
  -e NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  og-event
```

### Using Docker Compose

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
    restart: unless-stopped
```

Run:

```bash
docker-compose up -d
```

### Traditional Server (PM2)

```bash
# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "og-event" -- start

# Save PM2 config
pm2 save
pm2 startup
```

---

## Environment Variables

### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# App Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Setting in Different Platforms

**Vercel**: Dashboard → Settings → Environment Variables  
**Netlify**: Dashboard → Site settings → Environment variables  
**Docker**: `.env` file or `-e` flags  
**Traditional**: `.env.production` file

### Security Notes

- ✅ **NEVER** commit `.env.local` or `.env.production`
- ✅ Use `.env.example` as template
- ✅ Use different keys for staging/production
- ✅ Rotate keys regularly
- ❌ Don't expose service role key to client

---

## Database Setup

### Supabase Configuration

1. **Create Tables**: Run SQL scripts from `/sql` directory
2. **Set up RLS Policies**: Run `/supabase/storage_policies.sql`
3. **Create Storage Buckets**:

   ```sql
   -- Run in Supabase SQL editor
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('payment-proofs', 'payment-proofs', false);

   INSERT INTO storage.buckets (id, name, public)
   VALUES ('tickets', 'tickets', true);
   ```

4. **Test Connection**: Visit your deployed app and check database connectivity

---

## Post-Deployment

### Checklist

- [ ] Verify environment variables are set
- [ ] Test database connection
- [ ] Test file uploads (payment proofs)
- [ ] Test booking flow
- [ ] Test admin panel access
- [ ] Test ticket generation
- [ ] Check error logging
- [ ] Set up monitoring
- [ ] Configure custom domain (if applicable)
- [ ] Enable HTTPS

### Testing Deployment

```bash
# Test API endpoints
curl https://your-domain.com/api/book-seats

# Test health check
curl https://your-domain.com
```

### Monitoring

**Vercel**:

- Built-in analytics
- Error tracking in dashboard
- Performance insights

**Custom**:

- Add Sentry for error tracking
- Use Vercel Analytics or Google Analytics
- Set up uptime monitoring (UptimeRobot, Pingdom)

---

## Custom Domain

### Vercel

1. Go to "Settings → Domains"
2. Add your domain
3. Configure DNS:

   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify

1. Go to "Domain settings"
2. Add custom domain
3. Follow DNS configuration instructions

---

## SSL/HTTPS

**Vercel & Netlify**: Automatic SSL with Let's Encrypt (free)

**Self-hosted**: Use Let's Encrypt with Certbot or Cloudflare

---

## Rollback Procedure

### Vercel

1. Go to "Deployments"
2. Find previous successful deployment
3. Click "..." → "Promote to Production"

### Git-based

```bash
git revert HEAD
git push origin main
# Triggers new deployment
```

---

## Performance Optimization

### Before Deployment

- [ ] Run `npm run build` locally to check for errors
- [ ] Test production build: `npm run start`
- [ ] Check bundle size
- [ ] Optimize images
- [ ] Enable caching headers

### After Deployment

- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Monitor loading times
- [ ] Optimize based on metrics

---

## Troubleshooting

### Build Fails

```bash
# Check locally
npm run build

# Common issues:
- TypeScript errors
- Missing environment variables
- Dependency issues
```

### 404 Errors

- Check routing configuration
- Verify all pages are in `/app` directory
- Check middleware configuration

### Database Connection Issues

- Verify Supabase URL and keys
- Check database is accessible
- Verify RLS policies

### Image Upload Fails

- Check storage bucket exists
- Verify bucket policies
- Check file size limits

---

## CI/CD Pipeline

### GitHub Actions Example

```.github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        run: vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Scaling Considerations

### Database

- Monitor Supabase usage
- Consider upgrading plan for more connections
- Implement connection pooling if needed

### Application

- Vercel/Netlify auto-scales
- For self-hosted: Use load balancer + multiple instances

### Storage

- Monitor Supabase storage usage
- Consider CDN for static assets
- Implement image optimization

---

## Security Best Practices

- [ ] Use environment variables for secrets
- [ ] Enable HTTPS only
- [ ] Set up CORS properly
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Use Supabase RLS policies
- [ ] Audit admin access regularly

---

## Cost Estimation

### Vercel (Recommended)

- **Hobby**: Free (personal projects)
- **Pro**: $20/month (commercial)

### Supabase

- **Free**: 500MB database, 1GB storage
- **Pro**: $25/month (8GB database, 100GB storage)

### Total Estimated Cost

- Development: **$0** (free tiers)
- Production: **$25-45/month** (Supabase Pro + Vercel Pro)

---

## Support

For deployment issues:

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## Quick Commands Reference

```bash
# Local production build
npm run build && npm run start

# Deploy to Vercel (with CLI)
vercel --prod

# Docker build
docker build -t og-event .

# Check environment
env | grep NEXT_PUBLIC
```

---

**Next Steps**: After successful deployment, monitor your application and set up analytics and error tracking.
