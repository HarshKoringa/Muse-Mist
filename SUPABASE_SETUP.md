# Supabase Integration Setup Guide

## 1. Get Your Supabase Credentials

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in or create a new account
3. Create a new project (or select existing)
4. Go to **Settings > API**
5. Copy:
   - **Project URL** → Paste as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → Paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Create the Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create muses table with UNIQUE constraints
CREATE TABLE IF NOT EXISTS muses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(254) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  contact_type VARCHAR(10) NOT NULL CHECK (contact_type IN ('email', 'phone')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_muses_email ON muses(email);
CREATE INDEX IF NOT EXISTS idx_muses_phone ON muses(phone);
CREATE INDEX IF NOT EXISTS idx_muses_created_at ON muses(created_at);

-- Enable Row Level Security (optional, but recommended)
ALTER TABLE muses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow INSERT for public (coming soon page)
CREATE POLICY "Allow public insert" ON muses
  FOR INSERT WITH CHECK (true);

-- Create policy to prevent reading submissions (only you can see)
CREATE POLICY "Disable select" ON muses
  FOR SELECT USING (false);
```

## 3. Update `.env.local`

Open `.env.local` in the root directory and replace placeholders:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Note:**

- Never commit `.env.local` to Git
- The `.gitignore` should already exclude it
- Public keys prefixed with `NEXT_PUBLIC_` are safe to expose in the browser

## 4. Install Dependencies

```bash
npm install
```

This installs `@supabase/supabase-js` and updates your project.

## 5. How It Works

### Frontend Flow:

1. User fills email/phone and checks consent
2. Clicks "JOIN THE MUSES" button
3. Button shows "PROCESSING..." with spinner
4. Frontend sends POST to `/api/signup`

### API Route Flow (`/api/signup`):

1. **Rate Limiting:** Prevents 5+ requests per 60 seconds from same IP
2. **Validation:**
   - Checks email format (regex)
   - Checks phone digits (10 or 12 with +91)
   - Prevents junk/suspicious data
3. **Database Insert:** Uses Supabase to insert into `muses` table
4. **Error Handling:**
   - UNIQUE constraint violation (409) → "You're already a Muse!" toast
   - Other errors → Generic message with logging
5. **Response:** Success = show "Access Secured, Muse." screen

### Toast Notifications:

- Success: Green toast, auto-dismisses after 4 seconds
- Error: Red toast, auto-dismisses after 4 seconds
- Examples:
  - "Welcome to the Muse List!"
  - "You're already a Muse!"
  - "Invalid email format"

## 6. Testing Locally

```bash
npm run dev
```

Then visit `http://localhost:3000`

### Test Cases:

- ✅ Valid email only
- ✅ Valid phone only (10 digits)
- ✅ Valid phone (12 digits with 91)
- ✅ Both email and phone
- ✅ Duplicate submission (should show "already a Muse")
- ✅ Invalid email format
- ✅ Invalid phone format
- ✅ Missing consent checkbox
- ✅ Rapid submissions (rate limit after 5)

## 7. Security Features Implemented

| Feature                    | Purpose                                           |
| -------------------------- | ------------------------------------------------- |
| **Server-side Validation** | No trust in client data                           |
| **Rate Limiting**          | Prevents spam/bot abuse (5 requests/60sec per IP) |
| **UNIQUE Constraints**     | Prevents duplicate signups (high-quality list)    |
| **HTTPS Only**             | Anon key only works over HTTPS in production      |
| **RLS Policies**           | Users can't read other submissions                |
| **Environment Variables**  | Keys never exposed in code                        |
| **Input Sanitization**     | Phone numbers cleaned, emails lowercased          |

## 8. Production Deployment

When deploying to production (Vercel, etc.):

1. Add env vars in deployment platform settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. For higher traffic, consider:
   - Using Redis for rate limiting instead of in-memory
   - Implementing CAPTCHA for additional spam protection
   - Setting up email verification

3. Monitor submissions in Supabase dashboard:
   - Go to **Table Editor > muses**
   - View all signups in real-time

## 9. Troubleshooting

### "Cannot find module '@supabase/supabase-js'"

```bash
npm install
npm run dev
```

### "UNIQUE constraint violation"

This is expected! It means the email/phone already signed up. The UI shows: "You're already a Muse!"

### "Missing Supabase environment variables"

Check that `.env.local` has both:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Restart dev server after updating env vars.

### Rate limit hitting too fast during testing

The 5-request limit resets after 60 seconds. Or use different IPs (incognito mode).

## 10. What's Next?

- Add email verification flow
- Create admin dashboard to view signups
- Set up automated emails for early-bird codes
- Add analytics tracking
- Implement CAPTCHA for production

---

**CTO Wisdom:** You've now built a production-ready signup system with proper validation, rate limiting, and unique constraints. This keeps your Muse List clean, prevents gaming the system, and scales gracefully. 🚀
