# Rakshak AI - Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Build Process](#build-process)
4. [Deployment Options](#deployment-options)
5. [Vercel Deployment](#vercel-deployment)
6. [Netlify Deployment](#netlify-deployment)
7. [Docker Deployment](#docker-deployment)
8. [Post-Deployment Checklist](#post-deployment-checklist)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**: For version control
- **Supabase Account**: For backend services
- **Domain Name**: (Optional) For custom domain

### Required Accounts

- **Vercel/Netlify**: For hosting (choose one)
- **Supabase**: For database and backend
- **GitHub/GitLab**: For source code hosting

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/rakshak-ai.git
cd rakshak-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env
```

Required environment variables:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=production
```

### 4. Setup Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Run the SQL from `SUPABASE_COMPLETE_SCHEMA.md`
4. Enable real-time for all tables
5. Get your project URL and anon key
6. Add them to your `.env` file

---

## Build Process

### Development Build

```bash
npm run dev
```

This starts the development server at `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Build Verification

```bash
# Preview production build locally
npm run preview
```

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Pros:**
- Zero configuration
- Automatic HTTPS
- Built-in CI/CD
- Free tier available
- Fast global CDN

**Cons:**
- Vendor lock-in
- Limited build time on free tier

### Option 2: Netlify

**Pros:**
- Free tier with more features
- Easy form handling
- Built-in edge functions
- Great documentation

**Cons:**
- Slightly slower builds
- Less intuitive than Vercel

### Option 3: Docker

**Pros:**
- Complete control
- Portable
- Scalable
- Production-ready

**Cons:**
- More complex setup
- Requires server management
- Higher cost

---

## Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? → Yes
- Link to existing project? → No
- Project name? → rakshak-ai
- Directory? → ./
- Override settings? → No

### Step 4: Configure Environment Variables

Go to Vercel Dashboard → Settings → Environment Variables

Add the following:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_ENV=production
```

### Step 5: Redeploy

```bash
vercel --prod
```

### Step 6: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

---

## Netlify Deployment

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

### Step 3: Initialize Project

```bash
netlify init
```

Follow the prompts:
- Create new site? → Yes
- Site name? → rakshak-ai
- Build command? → npm run build
- Publish directory? → dist

### Step 4: Deploy

```bash
netlify deploy --prod
```

### Step 5: Configure Environment Variables

Go to Netlify Dashboard → Site Settings → Environment Variables

Add the required environment variables.

### Step 6: Custom Domain (Optional)

1. Go to Domain Settings
2. Add custom domain
3. Update DNS records
4. Wait for SSL provisioning

---

## Docker Deployment

### Step 1: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass https://your-project.supabase.co;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Step 3: Build Docker Image

```bash
docker build -t rakshak-ai .
```

### Step 4: Run Container

```bash
docker run -p 80:80 -e VITE_SUPABASE_URL=your_url -e VITE_SUPABASE_ANON_KEY=your_key rakshak-ai
```

### Step 5: Deploy to Cloud

**Docker Hub:**
```bash
docker tag rakshak-ai username/rakshak-ai
docker push username/rakshak-ai
```

**AWS ECS:**
```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-registry
docker tag rakshak-ai your-registry/rakshak-ai
docker push your-registry/rakshak-ai
```

---

## Post-Deployment Checklist

### 1. Verify Deployment

- [ ] Application loads without errors
- [ ] All pages are accessible
- [ ] Navigation works correctly
- [ ] Forms submit successfully
- [ ] API calls work properly

### 2. Test Critical Features

- [ ] SOS trigger works
- [ ] Location tracking functions
- [ ] Emergency alerts send
- [ ] Guardian notifications work
- [ ] Trip sharing functions
- [ ] Nearby help displays
- [ ] Offline mode activates

### 3. Test PWA Features

- [ ] Service Worker registers
- [ ] App can be installed
- [ ] Works offline
- [ ] Cache functions properly
- [ ] Updates correctly

### 4. Performance Check

- [ ] Page load time < 3 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Time to Interactive < 3.5 seconds
- [ ] Lighthouse score > 90
- [ ] Bundle size optimized

### 5. Security Check

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Environment variables hidden
- [ ] API keys not exposed
- [ ] CSP headers set

### 6. Mobile Test

- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Responsive design verified
- [ ] Touch interactions work
- [ ] PWA installable

### 7. Cross-Browser Test

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers

---

## Monitoring and Maintenance

### Application Monitoring

**Vercel Analytics:**
- Built-in with Vercel deployment
- Monitor page views, performance
- Track errors and issues

**Sentry Integration:**
```bash
npm install @sentry/react
```

Add to `main.jsx`:
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VITE_APP_ENV,
});
```

### Database Monitoring

**Supabase Dashboard:**
- Monitor database performance
- Check query execution time
- Review storage usage
- Track API calls

### Performance Monitoring

**Lighthouse CI:**
```bash
npm install -g @lhci/cli
lhci autorun
```

**Web Vitals:**
```bash
npm install web-vitals
```

### Log Monitoring

**LogRocket:**
```bash
npm install logrocket
```

### Uptime Monitoring

**Uptime Robot:**
- Set up monitoring for your domain
- Configure alerts for downtime
- Monitor response times

---

## Troubleshooting

### Common Issues

**1. Build Fails**

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**2. Environment Variables Not Working**

- Verify variables are set in deployment platform
- Check variable names match exactly
- Restart deployment after adding variables
- Check for typos in variable names

**3. Service Worker Not Registering**

- Verify service-worker.js is in public folder
- Check HTTPS is enabled (required for SW)
- Clear browser cache
- Check browser console for errors

**4. API Calls Failing**

- Verify Supabase URL and key are correct
- Check Supabase project status
- Verify RLS policies allow access
- Check network connectivity

**5. PWA Not Installable**

- Verify manifest.json exists
- Check HTTPS is enabled
- Verify service worker is registered
- Check browser supports PWA
- Clear browser cache

**6. Offline Mode Not Working**

- Verify IndexedDB is supported
- Check service worker is active
- Verify cache is populated
- Check browser console for errors
- Test in incognito mode

### Debug Mode

Enable debug mode in `.env`:
```env
VITE_DEBUG=true
VITE_ENABLE_CONSOLE_LOGGING=true
```

### Rollback Procedure

**Vercel:**
1. Go to Deployments tab
2. Find previous successful deployment
3. Click "Redeploy"

**Netlify:**
1. Go to Deploys tab
2. Find previous successful deployment
3. Click "Publish deploy"

**Docker:**
```bash
# Revert to previous image tag
docker run -p 80:80 username/rakshak-ai:previous-tag
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
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
      env:
        VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## Scaling Considerations

### Horizontal Scaling

- Use load balancer for multiple instances
- Implement session affinity for WebSocket connections
- Use CDN for static assets
- Implement database read replicas

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add caching layer
- Implement connection pooling

### Database Scaling

- Add read replicas
- Implement connection pooling
- Use Supabase Pro plan
- Consider database sharding for large datasets

---

## Backup Strategy

### Automated Backups

**Supabase:**
- Enabled by default on Pro plan
- 7-day retention on free plan
- 30-day retention on Pro plan
- Point-in-time recovery available

### Manual Backups

```bash
# Export database
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Restore database
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

### Backup Schedule

- Daily automated backups
- Weekly full backups
- Monthly archive backups
- Retain backups for 90 days

---

## Security Best Practices

### 1. Environment Variables

- Never commit `.env` files
- Use different keys for dev/staging/prod
- Rotate keys regularly
- Use secret management services

### 2. HTTPS

- Always use HTTPS in production
- Implement HSTS headers
- Use strong SSL/TLS ciphers
- Enable certificate auto-renewal

### 3. Security Headers

Add to `vercel.json` or `netlify.toml`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 4. Rate Limiting

Implement rate limiting at application level:
```javascript
// Example rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

---

## Cost Optimization

### Vercel Pricing

- **Free Tier:** 100GB bandwidth/month, 6GB build/month
- **Pro Tier:** $20/month, 1TB bandwidth/month
- **Enterprise:** Custom pricing

### Netlify Pricing

- **Free Tier:** 100GB bandwidth/month
- **Pro Tier:** $19/month, 400GB bandwidth/month
- **Business Tier:** $99/month, 1TB bandwidth/month

### Supabase Pricing

- **Free Tier:** 500MB database, 1GB storage
- **Pro Tier:** $25/month, 8GB database, 100GB storage
- **Enterprise:** Custom pricing

### Cost Reduction Tips

- Optimize bundle size
- Use CDN for static assets
- Implement caching strategies
- Monitor and optimize database queries
- Use serverless functions efficiently

---

## Support and Resources

### Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Supabase Docs](https://supabase.com/docs)
- [Docker Docs](https://docs.docker.com)

### Community

- [Vercel Community](https://vercel.com/community)
- [Netlify Community](https://community.netlify.com)
- [Supabase Community](https://supabase.com/community)
- [GitHub Issues](https://github.com/yourusername/rakshak-ai/issues)

### Emergency Contacts

For deployment emergencies:
- Check status pages: [Vercel Status](https://www.vercel-status.com), [Netlify Status](https://www.netlifystatus.com)
- Contact support through respective platforms
- Check GitHub issues for known problems

---

## Version History

- **v1.0.0** - Initial deployment guide
- **v1.1.0** - Added Docker deployment
- **v1.2.0** - Added CI/CD pipeline
- **v1.3.0** - Added monitoring section
