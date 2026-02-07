# Muse & Mist - Vercel Deployment Checklist

## Production Hardening ✅

### 1. Console Output Security

- ✅ All `console.log` and `console.error` statements wrapped with `process.env.NODE_ENV === "development"` check
- ✅ Error details never leak to production clients
- **Files Updated:** `/src/app/api/signup/route.ts`

### 2. Supabase Configuration

- ✅ Environment variables correctly configured:
  - `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key (safe for client-side use, row-level security enforced)
- ✅ Supabase client initialized with proper error handling
- ✅ Rate limiting enabled (5 requests per 60 seconds per IP)
- ✅ Server-side validation prevents data corruption

## SEO & Metadata ✅

### Updated in `/src/app/layout.tsx`

```typescript
Title: "Muse & Mist | Secure Your Glow";
Description: "Join the Muse List for early access to the 3-in-1 Day Shield. Luxury skincare, scientifically softened.";
Robots: "index, follow";
Favicon: "/favicon.ico";
```

### Viewport Configuration

- ✅ Moved to separate `Viewport` export (Next.js 15+ best practice)
- ✅ Device-width responsive scaling enabled

## Vercel Optimization ✅

### `vercel.json` Configuration

**File Created:** `/vercel.json`

#### Build & Dev Commands

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

#### Security Headers (Auto-applied to all routes)

- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer leakage
- `Permissions-Policy: geolocation=(), microphone=(), camera=()` - Disables unnecessary APIs

#### Performance Optimization

- **Static Routes:** 1-hour cache (3600s) for HTML/CSS/JS
  - Route: `/`
  - Benefits: Reduces origin requests, speeds up FCP (First Contentful Paint)
- **API Routes:** No-cache policy
  - Route: `/api/*`
  - Rationale: Always fresh signup responses

#### Routing

- `/home-v1` redirected to `/` (permanent 301 redirect)
- All traffic routes to single Coming Soon landing page

## Deployment Steps

### 1. Set Environment Variables in Vercel Dashboard

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Connect GitHub Repository

- Push all changes to `main` branch
- Vercel auto-detects Next.js project
- Build command: `npm run build`

### 3. Custom Domain

- Domain: `museandmist.in`
- Configure DNS records in domain registrar
- SSL certificate auto-provisioned by Vercel

### 4. Monitoring

- Vercel Analytics: Track FCP, LCP, CLS
- Supabase Logs: Monitor signup submissions
- Error tracking: Sentry integration (optional)

## Performance Targets

| Metric                             | Target | Expected                             |
| ---------------------------------- | ------ | ------------------------------------ |
| **FCP** (First Contentful Paint)   | < 1.0s | ~800ms (static HTML cached)          |
| **LCP** (Largest Contentful Paint) | < 2.5s | ~1.2s (optimized images + preload)   |
| **CLS** (Cumulative Layout Shift)  | < 0.1  | ~0.05 (fixed layouts, no jank)       |
| **Time to Interactive**            | < 3.5s | ~2.8s (minimal JS, optimized bundle) |

## Pre-Launch Verification Checklist

- [ ] All environment variables set in Vercel dashboard
- [ ] DNS records pointing to Vercel nameservers
- [ ] Test form submission end-to-end at `museandmist.in`
- [ ] Verify 100vh viewport lock on iOS 15+
- [ ] Test mobile responsiveness (375px-1920px)
- [ ] Check Supabase database receives submissions
- [ ] Verify rate limiting (test 6+ rapid submissions)
- [ ] Confirm no console errors in production DevTools
- [ ] Check security headers with https://securityheaders.com
- [ ] Test duplicate submission handling (409 response)

## Rollback Procedure

If issues occur post-launch:

1. Vercel dashboard → Deployments → Select previous working build
2. Click "Promote to Production"
3. Changes live in < 30 seconds

## Support & Monitoring

- **Vercel Status:** https://vercel.status.page/
- **Supabase Status:** https://status.supabase.io
- **Metrics Dashboard:** Vercel Project Settings → Analytics

---

**Deployment Date:** February 7, 2026
**Status:** ✅ Ready for Production Launch
