# Supabase Integration - Visual Architecture

## 🔄 Complete User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER EXPERIENCE                           │
└─────────────────────────────────────────────────────────────────┘

1. USER VISITS PAGE
   └─> Sees:
       • Animated mist blob background
       • Headline: "SECURE YOUR GLOW."
       • Email/Phone form with consent checkbox
       • "JOIN THE MUSES" button (fancy with gradient)

2. USER FILLS FORM
   └─> Form state updates:
       • email: ""
       • phone: ""
       • consent: false
       • isLoading: false
       • error: ""

3. USER CLICKS BUTTON
   ├─> CLIENT VALIDATION (instant feedback)
   │   ├─ Email format? (regex check)
   │   ├─ Phone format? (10 or 12 digits)
   │   ├─ At least one field? (email or phone)
   │   ├─ Consent checked?
   │   └─ All good? → Continue
   │      Otherwise → Show red error message
   │
   └─> If validation passes:
       └─> SET isLoading = true
           Button shows: "PROCESSING..." + spinner
           Button is now disabled

4. API CALL SENT
   ├─> POST /api/signup
   ├─> Body:
   │   {
   │     "email": "user@example.com",  // or null
   │     "phone": "9876543210",        // or null
   │     "type": "email"               // or "phone"
   │   }
   └─> Response: 2-5 seconds

5. BACKEND PROCESSING (route.ts)
   ├─ RATE LIMIT CHECK
   │  └─ Is IP making >5 requests per 60 seconds?
   │     ├─ YES → Return 429 (Too Many Requests)
   │     └─ NO → Continue
   │
   ├─ SERVER VALIDATION
   │  ├─ Email format valid?
   │  ├─ Phone format valid?
   │  ├─ At least one field?
   │  ├─ Email not too long?
   │  └─ If invalid → Return 400 + error message
   │
   └─ DATABASE INSERT
      └─ Supabase.from('muses').insert({
         email: ...,
         phone: ...,
         contact_type: ...,
         submitted_at: ...
      })
         ├─ INSERT SUCCEEDS → Return 201 + success message
         ├─ EMAIL ALREADY EXISTS → Return 409 (duplicate)
         └─ PHONE ALREADY EXISTS → Return 409 (duplicate)

6. RESPONSE HANDLING (frontend)
   ├─ Response 201 (SUCCESS)
   │  └─> isSubmitted = true
   │      SET toast: "Welcome to the Muse List!"
   │      Show: ✓ "Access Secured, Muse." screen
   │
   ├─ Response 409 (ALREADY SIGNED)
   │  └─> SET isLoading = false
   │      SET toast (error): "You're already a Muse!"
   │      Red toast shown for 4 seconds then disappears
   │
   └─ Response 400/429/500 (ERROR)
      └─> SET isLoading = false
          SET error: "Error message"
          SET toast (error): "Error message"
          Red toast shown for 4 seconds then disappears

7. USER SEES RESULT
   ├─ SUCCESS: Beautiful "Access Secured, Muse." screen
   │  └─ With checkmark icon
   │     Success message
   │     Decorative dots
   │
   └─ ERROR: Toast notification (bottom-left)
      └─ Red background
         Error message
         Auto-dismisses after 4 seconds
         User can retry form
```

## 🗂️ Code Structure

```
src/
├── app/
│   ├── api/
│   │   └── signup/
│   │       └── route.ts
│   │           ├─ createClient(Supabase)
│   │           ├─ Rate limiting (Map store)
│   │           ├─ validateInput()
│   │           ├─ POST handler
│   │           └─ Error handling
│   │
│   ├── page.tsx
│   │   ├─ State hooks (email, phone, consent, isLoading, toast)
│   │   ├─ validateEmail() & validatePhone()
│   │   ├─ showToast() handler
│   │   ├─ validateAndSubmit() async
│   │   │   ├─ Client-side checks
│   │   │   ├─ fetch(/api/signup)
│   │   │   ├─ Handle responses (201/409/4xx/5xx)
│   │   │   └─ Show toast & success state
│   │   │
│   │   ├─ JSX Form
│   │   │   ├─ Mist blob background (11 blobs)
│   │   │   ├─ Headline: "SECURE YOUR GLOW."
│   │   │   ├─ Email input
│   │   │   ├─ Phone input
│   │   │   ├─ Consent checkbox
│   │   │   ├─ CTA Button (with loading state)
│   │   │   └─ Toast notification component
│   │   │
│   │   └─ Success State JSX
│   │       ├─ Checkmark icon
│   │       ├─ "Access Secured, Muse." message
│   │       └─ Decorative dots
│   │
│   └── globals.css
│       └─ Tailwind imports + color variables
│
├── env.local
│   ├─ NEXT_PUBLIC_SUPABASE_URL
│   └─ NEXT_PUBLIC_SUPABASE_ANON_KEY
│
└── package.json
    └─ "@supabase/supabase-js": "^2.43.4"
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────┘

LAYER 1: FRONTEND (Client-side - UX only, not security!)
├─ Email format regex check
├─ Phone digit validation
├─ Consent checkbox requirement
└─ ⚠️ User can bypass this with browser dev tools!

LAYER 2: API RATE LIMITING (Backend)
├─ Extract client IP from headers
├─ Track request count per IP
├─ Allow 5 requests per 60 seconds
├─ Return 429 if exceeded
└─ ✓ Prevents bot spam & brute force attacks

LAYER 3: SERVER VALIDATION (Backend - STRICT!)
├─ Re-validate email format (NOT trusting client)
├─ Re-validate phone digits (NOT trusting client)
├─ Check for suspicious patterns (long emails)
├─ Sanitize inputs (lowercase emails, extract digits)
└─ ✓ Prevents SQL injection & junk data

LAYER 4: DATABASE CONSTRAINTS (Supabase)
├─ UNIQUE constraint on email column
├─ UNIQUE constraint on phone column
├─ CHECK constraint on contact_type
├─ Row Level Security (RLS) policies
└─ ✓ Prevents duplicates & unauthorized access

LAYER 5: ENVIRONMENT SECURITY
├─ Private keys in .env.local (never committed)
├─ Only public "anon" key exposed in browser
├─ HTTPS enforced in production
└─ ✓ Keys never leaked to GitHub

RESULT: Defense in depth!
If hacker bypasses #1, they hit #2-5 in sequence.
```

## 📊 Request/Response Examples

### ✅ SUCCESS CASE
```
REQUEST:
POST /api/signup
{
  "email": "newuser@example.com",
  "phone": null,
  "type": "email"
}

BACKEND PROCESS:
1. Rate limit check: PASS (1st request from IP)
2. Validation: PASS (valid email)
3. Database: INSERT succeeds

RESPONSE (201):
{
  "success": true,
  "message": "Welcome to the Muse List!",
  "data": {
    "id": "uuid-xxx",
    "email": "newuser@example.com",
    "phone": null,
    "contact_type": "email",
    "submitted_at": "2025-02-07T10:30:00Z"
  }
}

FRONTEND RESULT:
→ setIsSubmitted(true)
→ Show "Access Secured, Muse." screen
→ Toast: "Welcome to the Muse List!" (green)
```

### ❌ DUPLICATE CASE
```
REQUEST:
POST /api/signup
{
  "email": "duplicate@example.com",  // Already in DB!
  "phone": null,
  "type": "email"
}

BACKEND PROCESS:
1. Rate limit check: PASS
2. Validation: PASS
3. Database: INSERT fails (UNIQUE constraint)
   → Error code: 23505 (uniqueness violation)

RESPONSE (409):
{
  "error": "You're already a Muse!",
  "isExisting": true
}

FRONTEND RESULT:
→ setIsLoading(false)
→ showToast("You're already a Muse!", "error")
→ Toast: Red notification at bottom (4 sec)
→ Stay on form, user can try different email
```

### ❌ RATE LIMITED CASE
```
REQUEST (6th within 60 seconds):
POST /api/signup
{...}

BACKEND PROCESS:
1. Rate limit check: FAIL
   → IP already made 5 requests in last 60 seconds
   → Return immediately

RESPONSE (429):
{
  "error": "Too many requests. Please try again later."
}

FRONTEND RESULT:
→ setIsLoading(false)
→ showToast("Too many requests. Please try again later.", "error")
→ Red toast shown
→ User must wait 60 seconds before next attempt
```

### ❌ INVALID INPUT CASE
```
REQUEST:
POST /api/signup
{
  "email": "not-an-email",  // Missing @ and domain!
  "phone": null,
  "type": "email"
}

BACKEND PROCESS:
1. Rate limit check: PASS
2. Validation: FAIL
   → Email regex test fails
   → Return error immediately

RESPONSE (400):
{
  "error": "Invalid email format"
}

FRONTEND RESULT:
→ setError("Invalid email format")
→ showToast("Invalid email format", "error")
→ Red error message shown in form
→ Red toast shown
```

## 🚀 Database Schema

```sql
TABLE: muses

COLUMNS:
┌─────────────────┬─────────────────────────┬─────────────────┐
│ Column          │ Type                    │ Constraints     │
├─────────────────┼─────────────────────────┼─────────────────┤
│ id              │ UUID                    │ PRIMARY KEY     │
│ email           │ VARCHAR(254)            │ UNIQUE, NULL OK │
│ phone           │ VARCHAR(20)             │ UNIQUE, NULL OK │
│ contact_type    │ VARCHAR(10)             │ NOT NULL        │
│ submitted_at    │ TIMESTAMP WITH TZ       │ NOT NULL        │
│ created_at      │ TIMESTAMP WITH TZ       │ NOT NULL        │
└─────────────────┴─────────────────────────┴─────────────────┘

INDEXES:
- idx_muses_email: Fast email lookups
- idx_muses_phone: Fast phone lookups
- idx_muses_created_at: Fast date range queries

ROW LEVEL SECURITY:
- "Allow public insert": Users can submit their data
- "Disable select": Only owners/admins can read (you!)
```

## 📈 Monitoring Dashboard

```
IN YOUR SUPABASE DASHBOARD:
─────────────────────────────────────────────────────────────

1. TABLE EDITOR > muses
   ├─ See all submissions
   ├─ Filter by email/phone
   ├─ Sort by created_at (newest first)
   └─ Manually review data quality

2. INSPECT ROW DATA:
   ├─ Click any row
   ├─ See:
   │  • Full email address
   │  • Full phone number
   │  • Contact type (email or phone)
   │  • Exact submission time
   │  • Auto-generated UUID
   └─ No duplicates (UNIQUE prevents)

3. SQL QUERIES:
   Total submissions:
   → SELECT COUNT(*) FROM muses;

   Submissions today:
   → SELECT COUNT(*) FROM muses
     WHERE DATE(created_at) = CURRENT_DATE;

   Email vs Phone ratio:
   → SELECT contact_type, COUNT(*) FROM muses
     GROUP BY contact_type;

   Recent submissions:
   → SELECT * FROM muses
     ORDER BY created_at DESC LIMIT 10;
```

---

**Architecture Complete! You have a production-grade signup system. 🎯**
