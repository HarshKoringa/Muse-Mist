# 🚀 Quick Start Guide - Supabase Integration

## Step 1: Get Credentials (5 minutes)
```
1. Go to https://supabase.com/dashboard
2. Create project OR select existing
3. Settings > API
4. Copy Project URL and anon key
```

## Step 2: Update `.env.local` (1 minute)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## Step 3: Create Database Table (2 minutes)
Open Supabase > SQL Editor > Run this:

```sql
CREATE TABLE IF NOT EXISTS muses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(254) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  contact_type VARCHAR(10) NOT NULL CHECK (contact_type IN ('email', 'phone')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_muses_email ON muses(email);
CREATE INDEX idx_muses_phone ON muses(phone);
CREATE INDEX idx_muses_created_at ON muses(created_at);

ALTER TABLE muses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON muses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Disable select" ON muses
  FOR SELECT USING (false);
```

## Step 4: Install & Run (2 minutes)
```bash
npm install
npm run dev
```
Visit: `http://localhost:3000`

## Step 5: Test
- Fill email OR phone
- Check consent box
- Click "JOIN THE MUSES"
- Should show "Access Secured, Muse."
- Check Supabase > Table Editor > muses to see data

## That's It! 🎉

---

## File Structure
```
src/
├── app/
│   ├── api/
│   │   └── signup/
│   │       └── route.ts          ← API endpoint
│   ├── page.tsx                  ← Frontend (updated)
│   └── globals.css
.env.local                         ← NEW (your secrets)
package.json                       ← Updated (+supabase)
SUPABASE_SETUP.md                  ← Full guide
INTEGRATION_SUMMARY.md             ← Detailed overview
```

## API Endpoint
- **POST** `/api/signup`
- **Body:** `{ email?, phone?, type: 'email'|'phone' }`
- **Response:** 
  - 201: Success `{ success: true, message: "...", data: {...} }`
  - 400: Bad input `{ error: "..." }`
  - 409: Already signed up `{ error: "You're already a Muse!", isExisting: true }`
  - 429: Rate limited `{ error: "Too many requests..." }`
  - 500: Server error `{ error: "Internal server error" }`

## What Happens Behind the Scenes

```
User Input
    ↓
Client Validation (frontend)
    ↓
POST /api/signup
    ↓
Rate Limit Check (5 req/min per IP)
    ↓
Server Validation (strict)
    ↓
Insert to Supabase
    ↓
Response (Success or Error)
    ↓
Toast Notification
    ↓
Success Screen or Retry
```

## Common Issues

### "Cannot find module '@supabase/supabase-js'"
→ Run `npm install`

### "Missing Supabase environment variables"
→ Check `.env.local` has both URL and Key

### Button shows "PROCESSING..." forever
→ Check browser console for errors
→ Check API route is working: `POST /api/signup`

### "You're already a Muse!" on first try
→ Email/phone already in database
→ Use different email or phone to test

### Too many rate limit errors
→ Wait 60 seconds or use incognito window

## Production Checklist

- [ ] Supabase credentials added to hosting (Vercel, etc.)
- [ ] Database table created with SQL
- [ ] `.env.local` never committed to Git
- [ ] `npm install` run locally
- [ ] API tested locally
- [ ] Deployed to production
- [ ] Supabase dashboard set up for monitoring
- [ ] Consider adding CAPTCHA for extra spam protection
- [ ] Set up email notifications for new signups

## Monitoring Signups

**In Supabase Dashboard:**
1. Table Editor > muses
2. See all signups with timestamps
3. Check for duplicates (shouldn't happen - UNIQUE prevents)
4. Monitor created_at for volume trends

**In Your Code:**
- API errors logged to server console
- Toast notifications show user feedback
- Frontend errors visible in browser console

## Support

Full detailed guide: See `SUPABASE_SETUP.md`
Architecture overview: See `INTEGRATION_SUMMARY.md`

---

**Questions? Check the detailed guides above! 🎯**
