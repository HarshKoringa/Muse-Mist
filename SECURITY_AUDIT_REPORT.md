# MUSE & MIST — SECURITY AUDIT REPORT
Date: 2026-05-25
Auditor: Claude Sonnet 4.6 (automated static analysis)
Branch audited: main @ 8fa386a

---

## SUMMARY

| Category | Count |
|---|---|
| Total checks | 38 |
| PASS | 22 |
| FAIL (Critical) | 3 |
| FAIL (High) | 4 |
| WARNING (Medium) | 6 |
| WARNING (Low) | 3 |

---

## CRITICAL FAILURES — Fix immediately

---

### CRIT-1: Replay attack — same Razorpay payment ID can create multiple orders

**File:** `src/app/api/verify-payment/route.ts`
**Lines:** 231–248 (order INSERT)
**Check:** 5.3

Before inserting the order, there is **no uniqueness check** on `razorpay_payment_id`. A user who captures a valid `razorpay_payment_id` + `razorpay_signature` from a completed payment can call `/api/verify-payment` a second time and a duplicate order will be created — at zero additional cost, with a second Shiprocket shipment dispatched.

The `razorpay_signature` check (line 34) only proves the payment was real; it does not prevent re-use of the same signature.

**Fix:**
```sql
-- In Supabase: add a unique constraint
ALTER TABLE orders ADD CONSTRAINT orders_razorpay_payment_id_unique
  UNIQUE (razorpay_payment_id);
```
And in the route, check before insert:
```typescript
if (razorpay_payment_id) {
  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('razorpay_payment_id', razorpay_payment_id)
    .single()
  if (existing) {
    return NextResponse.json({ error: 'Payment already processed' }, { status: 409 })
  }
}
```

---

### CRIT-2: Race condition — stock check and decrement are not atomic

**File:** `src/app/api/verify-payment/route.ts`
**Lines:** 86–100 (stock READ), 313–323 (stock WRITE — `decrement_stock` RPC)
**Check:** 5.1

The stock availability check (line 94: `product.stock_count < item.quantity`) happens at step 4. The `decrement_stock` RPC is called at step 12, after order creation, order_items insert, and early access update — potentially hundreds of milliseconds later. Two simultaneous requests for the last unit will **both** pass the stock check and both create valid orders, resulting in negative inventory.

**Fix:** The `decrement_stock` PostgreSQL function should enforce a floor and return a boolean indicating success. The verify-payment route should check the RPC return value and roll back (or cancel) the order if stock was insufficient:

```sql
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity int)
RETURNS boolean AS $$
DECLARE
  updated_rows int;
BEGIN
  UPDATE products
  SET stock_count = stock_count - quantity
  WHERE id = product_id AND stock_count >= quantity;
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;
```

Then in the route:
```typescript
const { data: decremented } = await supabase.rpc('decrement_stock', { ... })
if (!decremented) {
  // Cancel the order, return error
}
```

---

### CRIT-3: User ID spoofing — verify-payment does not authenticate the caller

**File:** `src/app/api/verify-payment/route.ts`
**Line:** 51–53
**Check:** 2.2

```typescript
const userId = order_data.user_id   // ← taken from client body, unverified
if (!userId) {
  return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
}
```

The `userId` is taken directly from the request body with no verification that the caller IS that user. Any authenticated user who knows another user's UUID (Supabase UUIDs are not secret — they appear in order confirmation pages, URLs, etc.) can place a COD order attributed to that user's account, polluting their order history and potentially triggering WhatsApp messages to victim addresses.

Compare with `/api/checkout` which correctly calls `supabase.auth.admin.getUserById(user_id)` (line 31) — `verify-payment` lacks this check entirely.

**Fix:** Extract the user from the request's auth cookie/session and verify it matches `order_data.user_id`:
```typescript
// At the top of verify-payment, before any processing:
const { createClient: createServerClient } = await import('@/utils/supabase/server')
const serverSupabase = await createServerClient()
const { data: { user: sessionUser } } = await serverSupabase.auth.getUser()
if (!sessionUser || sessionUser.id !== order_data.user_id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

## HIGH PRIORITY — Fix this week

---

### HIGH-1: No rate limiting on /api/checkout or /api/verify-payment

**Files:** `src/app/api/checkout/route.ts`, `src/app/api/verify-payment/route.ts`
**Check:** 3.2

Neither endpoint has any rate limiting. Consequences:
- **COD spam:** An attacker can place thousands of COD orders using any valid product ID, causing Shiprocket shipments, inventory depletion, and operational chaos. COD orders cost nothing to create.
- **Razorpay order spam:** `/api/checkout` with `payment_method: prepaid` calls `razorpay.orders.create()` on every request. Each call counts against your Razorpay API rate limit and could incur costs depending on plan.

By contrast, `/api/signup` has rate limiting (5 requests/60s per IP) — checkout/payment should have the same or stricter limits.

**Fix:** Add rate limiting middleware or use Upstash/Redis. At minimum, an in-memory approach like in signup/route.ts, but ideally a persistent store for production. Vercel's Edge Middleware or a library like `@upstash/ratelimit` is the recommended approach.

---

### HIGH-2: No maximum quantity cap

**Files:** `src/app/api/checkout/route.ts` line 40, `src/app/api/verify-payment/route.ts` line 62
**Check:** 1.5

```typescript
quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
```

This correctly rejects zero/negative quantities. But there is **no upper bound**. A user can send `quantity: 99999`, which would be accepted and passed to the stock check. While the stock check would likely reject it for most products, it creates unnecessary DB lookups and adds noise to logs.

More importantly: if a product ever has `stock_count >= 99999`, a single request could exhaust all stock.

**Fix:**
```typescript
const MAX_QUANTITY = 10
quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number(item.quantity) || 1))),
```

---

### HIGH-3: CartItem exposes `stock_count` and `category` in localStorage (main branch)

**File:** `src/store/cartStore.ts`
**Lines:** 11–12
**Check:** 1.4

The `HEAD~4` reset reverted the cart store security hardening. The current main branch `CartItem` type still includes:
```typescript
category: string;    // unnecessary product metadata
stock_count: number; // EXPOSES INVENTORY LEVELS to browser localStorage
```

Any visitor who opens DevTools → Application → Local Storage → `muse-mist-cart` can see exact inventory counts for all products in their cart. This leaks real-time stock data that should stay server-side.

**Fix:** Re-apply the cart store security hardening commit (`4bd5d3d`) that was lost in the reset. Remove `stock_count` and `category` from `CartItem`. Strip fields in `addItem`. Bump `version` to force cache clear.

---

### HIGH-4: In-memory rate limiting in signup/route.ts is ineffective in production

**File:** `src/app/api/signup/route.ts`
**Lines:** 14–36
**Check:** 3.2

```typescript
const requestLog = new Map<string, number[]>();  // In-memory — resets on cold start
```

Vercel serverless functions run in multiple isolated instances. The in-memory `requestLog` Map is **per-instance** and resets on every cold start. An attacker can bypass it trivially by either:
1. Sending requests across enough time to trigger cold starts
2. Distributing requests across enough IPs to spread across instances

The comment in the code even acknowledges this: `// Rate limiting - simple in-memory store (use Redis in production)`.

**Fix:** Replace with a persistent rate limiter. Upstash Redis with `@upstash/ratelimit` is the recommended solution for Vercel:
```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
const ratelimit = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(5, '60s') })
```

---

## MEDIUM PRIORITY — Fix before scaling

---

### MED-1: No HTTP security headers

**File:** `next.config.ts` (entire file)
**Check:** 3.4

`next.config.ts` contains only `reactCompiler` and `images` configuration. There are **no security headers** configured:

| Header | Status | Risk |
|---|---|---|
| `Content-Security-Policy` | Missing | XSS amplification |
| `X-Frame-Options` | Missing | Clickjacking |
| `X-Content-Type-Options` | Missing | MIME sniffing |
| `Strict-Transport-Security` | Missing | Downgrade attacks |
| `Referrer-Policy` | Missing | Referrer leakage |
| `Permissions-Policy` | Missing | Feature abuse |

**Fix:** Add to `next.config.ts`:
```typescript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ],
  }]
}
```
CSP requires more thought given inline styles, Razorpay, and Supabase connections.

---

### MED-2: Shipping address not format-validated server-side

**File:** `src/app/api/verify-payment/route.ts`
**Lines:** 217–224
**Check:** 3.1

The address validation only checks for presence (truthy values):
```typescript
if (!address.name || !address.phone || !address.address || !address.city ||
    !address.state || !address.pincode) {
```

There is no validation of:
- Phone format (any string like `"abc"` passes)
- Pincode format (6 digits — `"1"` passes)
- Name/address length limits (no cap — could accept a 10,000-character name)
- Email format (not even checked)

The frontend validates these in `address/page.tsx`, but **API validation must be independent of frontend validation**.

**Fix:**
```typescript
if (!/^[6-9]\d{9}$/.test(address.phone?.toString().replace(/\D/g, '').slice(-10))) {
  return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
}
if (!/^\d{6}$/.test(String(address.pincode))) {
  return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
}
if (address.name.length > 100 || address.address.length > 500) {
  return NextResponse.json({ error: 'Address fields too long' }, { status: 400 })
}
```

---

### MED-3: Full customer PII logged to production logs (Shiprocket payload)

**File:** `src/app/api/verify-payment/route.ts`
**Line:** 390
**Check:** 3.3

```typescript
console.log('[Shiprocket] FULL PAYLOAD:', JSON.stringify(shiprocketPayload, null, 2))
```

This logs the **complete** Shiprocket payload on every order, including:
- Customer full name, address, city, state, pincode
- Customer phone number
- Order items with prices

This PII is sent to Vercel's log aggregation service. Vercel logs are accessible to anyone with project access and may be stored longer than your DPDP/GDPR retention requirements.

Similarly in `lib/whatsapp.ts:21`:
```typescript
console.log('[WhatsApp] Attempting:', { to: toPhone, ... })
```

**Fix:** Remove the full payload log from production. If needed for debugging, gate it:
```typescript
if (process.env.NODE_ENV === 'development') {
  console.log('[Shiprocket] FULL PAYLOAD:', JSON.stringify(shiprocketPayload, null, 2))
} else {
  console.log('[Shiprocket] Creating order for:', order.id)
}
```

---

### MED-4: Shiprocket token fetched fresh on every order (no caching)

**File:** `src/lib/shiprocket.ts`
**Lines:** 3–16
**Check:** 6.1

`getShiprocketToken()` makes an authenticated POST to Shiprocket on every single order. Shiprocket tokens are valid for **24 hours**. This causes:
1. Extra latency on every order (one extra network round-trip)
2. If Shiprocket's auth endpoint is down or slow, ALL orders fail to create shipments
3. Unnecessary load on Shiprocket's auth service

**Fix:** Cache the token server-side. Since Vercel functions are stateless, use a global variable with an expiry check:
```typescript
let cachedToken: string | null = null
let tokenExpiry: number = 0

export async function getShiprocketToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  // ... fetch new token
  cachedToken = data.token
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000 // 23 hours
  return cachedToken
}
```
Or store in Supabase/Redis for true cross-instance caching.

---

### MED-5: Admin endpoint has no brute-force protection

**File:** `src/app/api/admin/shiprocket-check/route.ts`
**Lines:** 5–8
**Check:** 2.3

```typescript
const secret = req.headers.get('x-admin-secret')
if (secret !== process.env.ADMIN_SECRET) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

The check mechanism itself is fine (header-based, not query param). However, there is no rate limiting, no lockout, and no alerting on repeated failures. An attacker with knowledge of this endpoint can try an unlimited number of secrets.

The endpoint also returns sensitive operational data (unshipped orders with full `shipping_address` fields) to anyone who passes the secret.

**Fix:** Add rate limiting (same as HIGH-4 approach). Also consider IP allowlisting for admin endpoints, or moving them behind a separate Vercel protection layer.

---

### MED-6: Shiprocket raw API response logged

**File:** `src/lib/shiprocket.ts`
**Line:** 65
**Check:** 3.3

```typescript
console.log('[Shiprocket] Raw response:', JSON.stringify(data))
```

The raw Shiprocket API response may contain order IDs, tracking numbers, and other operational data that needn't be in production logs.

**Fix:** Log only the relevant fields: `console.log('[Shiprocket] Response:', { order_id: data.order_id, awb: data.awb_code })`

---

## LOW PRIORITY — Good to have

---

### LOW-1: Middleware refreshes session but does not enforce route protection

**File:** `src/middleware.ts`
**Lines:** 33–36
**Check:** 2.1

The middleware correctly refreshes the Supabase session cookie on every request, but it does not enforce authentication for any routes. Protected pages (`/orders`, `/profile`) each perform their own per-page auth check using `redirect('/login')`.

This is functional but fragile — if a new protected route is added and its developer forgets the per-page auth check, it silently becomes public. Centralizing auth enforcement in middleware is more robust.

**Note:** Currently all protected routes do correctly check auth:
- `/orders/page.tsx:13` → `if (!user) redirect('/login')`
- `/orders/[id]/page.tsx:16` → `if (!user) redirect('/login')`
- `/profile/page.tsx:24` → `if (!user) redirect('/login')`
- `/checkout/address` → checks sessionStorage, redirects to `/cart` if missing (soft protection)

The `/checkout/address` page is only soft-protected (sessionStorage check), not hard auth-guarded server-side. An unauthenticated user who constructs a `checkout_data` sessionStorage entry manually could reach the page.

---

### LOW-2: No vercel.json — function timeouts at Vercel default

**Check:** 8.3

`vercel.json` does not exist. The `/api/verify-payment` function performs ~7 sequential network operations (DB reads, Razorpay API, Shiprocket API, WhatsApp API) and could approach Vercel's default 10-second function timeout on the Hobby plan, especially if any third-party is slow.

**Fix:** Create `vercel.json` with appropriate timeouts:
```json
{
  "functions": {
    "src/app/api/verify-payment/route.ts": { "maxDuration": 60 },
    "src/app/api/checkout/route.ts": { "maxDuration": 30 }
  }
}
```

---

### LOW-3: npm audit reports 11 vulnerabilities (6 moderate, 5 high)

**Check:** 8.1

The build log reports: `11 vulnerabilities (6 moderate, 5 high)`. The npm audit command was unavailable in the current environment but the Vercel build output confirmed these. Most are likely in transitive dependencies. Run `npm audit` locally to assess which are exploitable in a Next.js SSR context.

**Fix:** Run `npm audit fix` for non-breaking fixes. Review `npm audit` report and update packages with high-severity issues that are in the server-side request path.

---

## PASSED CHECKS

| Check | File | Result |
|---|---|---|
| 1.1 Server-side price calculation | `checkout/route.ts:47-50` | PASS — fetches from `products` table, ignores client prices |
| 1.1 Client prices stripped | `checkout/route.ts:37-42` | PASS — only `id` and `quantity` extracted from client |
| 1.2 DB price recalculation in verify-payment | `verify-payment/route.ts:74-77` | PASS — re-fetches all products from DB |
| 1.2 Razorpay signature verified | `verify-payment/route.ts:34-45` | PASS — HMAC-SHA256 verification before any processing |
| 1.2 Razorpay amount verified against DB total | `verify-payment/route.ts:182-212` | PASS — fetches Razorpay order and compares `amount` |
| 1.2 COD prices server-calculated | `verify-payment/route.ts:140-151` | PASS — same DB-sourced calculation path as prepaid |
| 1.3 Early access discount from DB only | `checkout/route.ts:88-116` | PASS — queries `profiles` then `muses` table, no client flag trusted |
| 1.3 Discount percent hardcoded server-side | `checkout/route.ts:5-6` | PASS — `const PREPAID_DISCOUNT_PERCENT = 5` |
| 1.3 No client discount accepted | Both routes | PASS — discount recalculated independently in verify-payment |
| 1.5 Negative quantity prevented | `checkout/route.ts:40`, `verify-payment/route.ts:62` | PASS — `Math.max(1, ...)` |
| 1.5 Stock checked before order | `verify-payment/route.ts:94-99` | PASS — stock check present (though non-atomic, see CRIT-2) |
| 1.6 RAZORPAY_KEY_SECRET server-only | `lib/razorpay.ts:5` | PASS — not prefixed with `NEXT_PUBLIC_` |
| 2.1 /orders auth guarded | `app/orders/page.tsx:13` | PASS |
| 2.1 /profile auth guarded | `app/profile/page.tsx:24` | PASS |
| 2.2 User verified in checkout | `checkout/route.ts:31` | PASS — `getUserById` called |
| 2.3 Admin secret via header | `admin/shiprocket-check/route.ts:5` | PASS — uses `x-admin-secret` header, not query param |
| 4.1 .env files in .gitignore | `.gitignore:3-4` | PASS |
| 4.1 No .env committed to git history | git log | PASS — no .env files in commit history |
| 4.1 No hardcoded API keys | grep across src/ | PASS — all secrets via `process.env` |
| 4.2 createAdminClient server-only | All usages | PASS — only in API routes, server actions (`use server`), server pages |
| 4.2 Secret env vars not in client code | grep | PASS — `RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `TWILIO_AUTH_TOKEN`, `SHIPROCKET_PASSWORD`, `ADMIN_SECRET` all in server-only files |
| 6.2 Razorpay initialized securely | `lib/razorpay.ts` | PASS — `getRazorpayInstance()` pattern (no module-level singleton) |
| 7.1 No dangerouslySetInnerHTML | grep across src/ | PASS — zero occurrences found |
| 7.1 No eval() or Function() | grep across src/ | PASS — zero occurrences found |
| 7.3 No open redirect | `auth/callback/route.ts:7,24` | PASS — redirects to `${origin}/` (uses request origin, not user input) |
| 7.3 Login redirect param not used | `components/Login.tsx:55` | PASS — always pushes to `/`, no `?redirect=` param consumed |
| 3.1 Phone validation in login | `components/Login.tsx:23` | PASS — `/^[6-9]\d{9}$/` regex |
| 3.1 Input validation in early-access | `api/early-access/route.ts:22-26` | PASS — phone regex validated |
| 5.2 No user-facing order status endpoint | grep across api/ | PASS — no such endpoint exists |
| 6.3 WhatsApp uses server env only | `lib/whatsapp.ts:10-12` | PASS — all Twilio creds via `process.env`, no 'use client' |
| 6.4 No webhook endpoints | Glob | PASS — no `app/api/webhooks/` directory found |

---

## RECOMMENDED VALIDATIONS TO ADD

### 1. Unique payment ID constraint (CRIT-1)
```sql
ALTER TABLE orders ADD CONSTRAINT orders_razorpay_payment_id_unique
  UNIQUE (razorpay_payment_id);
```

### 2. Atomic stock decrement (CRIT-2)
```sql
CREATE OR REPLACE FUNCTION decrement_stock(product_id uuid, quantity int)
RETURNS boolean AS $$
DECLARE updated_rows int;
BEGIN
  UPDATE products SET stock_count = stock_count - quantity
  WHERE id = product_id AND stock_count >= quantity;
  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql;
```

### 3. Caller authentication in verify-payment (CRIT-3)
```typescript
// Verify caller matches claimed user_id
const serverClient = await createServerClientFromRequest(req)
const { data: { user } } = await serverClient.auth.getUser()
if (!user || user.id !== order_data.user_id) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### 4. Max quantity cap (HIGH-2)
```typescript
const MAX_QUANTITY_PER_ITEM = 10
quantity: Math.min(MAX_QUANTITY_PER_ITEM, Math.max(1, Math.floor(Number(item.quantity) || 1))),
```

### 5. Address format validation (MED-2)
```typescript
const phone = address.phone?.toString().replace(/\D/g, '').slice(-10)
if (!/^[6-9]\d{9}$/.test(phone)) {
  return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
}
if (!/^\d{6}$/.test(String(address.pincode))) {
  return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 })
}
```

### 6. Security headers in next.config.ts (MED-1)
```typescript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ],
  }]
}
```

---

## ENVIRONMENT VARIABLE CLASSIFICATION

| Variable | Classification | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | PUBLIC — safe | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | PUBLIC — safe | Anon key; RLS is the security layer |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | PUBLIC — safe | Razorpay public key (publishable) |
| `SUPABASE_SERVICE_ROLE_KEY` | SECRET | Bypasses RLS — server only |
| `RAZORPAY_KEY_SECRET` | SECRET | Payment signing — server only |
| `TWILIO_ACCOUNT_SID` | SECRET | WhatsApp account identifier |
| `TWILIO_AUTH_TOKEN` | SECRET | WhatsApp auth — server only |
| `TWILIO_WHATSAPP_FROM` | SECRET | WhatsApp sender number |
| `TWILIO_WHATSAPP_TEMPLATE_COD` | SECRET | Template SID |
| `TWILIO_WHATSAPP_TEMPLATE_CONFIRMED` | SECRET | Template SID |
| `TWILIO_WHATSAPP_TEMPLATE_SHIPPED` | SECRET | Template SID |
| `SHIPROCKET_EMAIL` | SECRET | Shipping login |
| `SHIPROCKET_PASSWORD` | SECRET | Shipping password — server only |
| `ADMIN_SECRET` | SECRET | Admin API key — server only |

All SECRET variables are confirmed server-only (no `NEXT_PUBLIC_` prefix, no `'use client'` in consuming files). ✓

---

*This report was generated by static analysis only. Dynamic testing (penetration testing, fuzzing) was not performed. RLS policy enforcement at the Supabase database layer was not audited (no access to migration files). Severity ratings assume a public-facing production application.*
