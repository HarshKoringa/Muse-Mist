import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rate limiting - simple in-memory store (use Redis in production)
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 5; // 5 requests
const RATE_WINDOW = 60000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestLog.get(ip) || [];

  // Remove old requests outside the window
  const recentRequests = userRequests.filter(
    (time) => now - time < RATE_WINDOW,
  );

  if (recentRequests.length >= RATE_LIMIT) {
    return true;
  }

  // Add current request
  recentRequests.push(now);
  requestLog.set(ip, recentRequests);

  return false;
}

// Server-side validation
function validateInput(
  name: string,
  email: string,
  phone: string,
): { valid: boolean; error?: string } {
  // Name validation
  if (!name || name.trim().length < 2 || name.trim().length > 100) {
    return { valid: false, error: "Name must be 2-100 characters" };
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Phone validation
  const phoneDigits = phone.replace(/\D/g, "");
  if (
    phone &&
    !(
      phoneDigits.length === 10 ||
      (phoneDigits.length === 12 && phone.includes("91"))
    )
  ) {
    return { valid: false, error: "Invalid phone format" };
  }

  // At least one field must be present
  if (!email && !phone) {
    return { valid: false, error: "Email or phone is required" };
  }

  // Check for suspicious patterns
  if (email && email.length > 254) {
    return { valid: false, error: "Email is too long" };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { name, email, phone, type } = body;

    // Server-side validation
    const validation = validateInput(name, email, phone);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Validate type
    if (!type || !["email", "phone"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid submission type" },
        { status: 400 },
      );
    }

    // Prepare data for insertion
    const insertData: Record<string, string | null> = {
      name: name.trim(),
      email: email && email.trim() ? email.trim().toLowerCase() : null,
      phone: phone && phone.trim() ? phone.replace(/\D/g, "") : null,
      contact_type: type,
      submitted_at: new Date().toISOString(),
    };

    // Insert into Supabase 'muses' table
    const { data, error } = await supabase
      .from("muses")
      .insert([insertData])
      .select();

    if (error) {
      // Check if it's a uniqueness constraint violation
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You're already a Muse!", isExisting: true },
          { status: 409 },
        );
      }

      // Log errors only in development
      if (process.env.NODE_ENV === "development") {
        console.error("Supabase error:", error);
      }
      return NextResponse.json(
        { error: "Failed to process signup. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Welcome to the Muse List!",
        data: data?.[0],
      },
      { status: 201 },
    );
  } catch (error) {
    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
      console.error("API route error:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
