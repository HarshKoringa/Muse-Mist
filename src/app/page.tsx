"use client";

import { useState, useEffect } from "react";

export default function Home() {
  // opt-in debug: add ?debug-blobs to URL to show bright outlines (client-only)
  const [showDebug, setShowDebug] = useState(false);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.search.includes("debug-blobs")
    ) {
      setShowDebug(true);
    }
  }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const validateName = (n: string) =>
    n.trim().length >= 2 && n.trim().length <= 100;
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePhone = (p: string) => {
    const cleaned = p.replace(/\D/g, "");
    return cleaned.length === 10 || (cleaned.length === 12 && p.includes("91"));
  };

  // Get phone error message in real-time
  const getPhoneError = (p: string): string => {
    if (!p.trim()) return "";
    const cleaned = p.replace(/\D/g, "");
    if (cleaned.length === 0) return "";
    if (cleaned.length < 10) return "Phone number must be 10 digits";
    if (cleaned.length === 10) return ""; // Valid 10 digits
    if (cleaned.length === 11)
      return "Please enter 10 digits or +91 with 10 digits";
    if (cleaned.length === 12 && p.includes("91")) return ""; // Valid +91 with 10 digits
    return "Phone number exceeds maximum length";
  };

  // Toast notification handler
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate name
    if (!validateName(name)) {
      setError("Name must be 2-100 characters");
      return;
    }

    const hasEmail = email.trim().length > 0;
    const hasPhone = phone.trim().length > 0;

    // At least one field must be filled
    if (!hasEmail && !hasPhone) {
      setError("Please enter an email or phone number");
      return;
    }

    // Validate filled fields
    if (hasEmail && !validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (hasPhone && !validatePhone(phone)) {
      setError("Phone must be 10 digits (Indian format)");
      return;
    }

    if (!consent) {
      setError("Please accept the consent to continue");
      return;
    }

    setIsLoading(true);

    try {
      const contactType = hasPhone ? "phone" : "email";
      const contactValue = hasPhone ? phone.replace(/\D/g, "") : email;

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: hasEmail ? email.trim().toLowerCase() : null,
          phone: hasPhone ? phone : null,
          type: contactType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if user already exists
        if (response.status === 409 && data.isExisting) {
          showToast("You're already a Muse!", "error");
          setIsLoading(false);
          return;
        }

        throw new Error(data.error || "Failed to submit");
      }

      // Success - show success state
      setIsSubmitted(true);
      showToast(data.message || "Welcome to the Muse List!", "success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-main">
      {/* Animated Mist Blobs - Layered Depth with Vibrant Colors */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 - Haze Lilac, top-left, slow */}
        <div
          className="absolute -top-1/3 -left-1/4 w-96 h-96 rounded-full bg-brand-lilac blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#c6b8e6",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            animationDuration: "14s",
            opacity: "0.8",
            mixBlendMode: "multiply",
            outline: showDebug ? "2px dashed rgba(255,0,0,0.9)" : undefined,
          }}
        />

        {/* Blob 2 - Soft Sky, top-right, medium */}
        <div
          className="absolute -top-20 -right-1/3 w-80 h-80 rounded-full bg-brand-sky blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#9ad6ff",
            borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%",
            animationDuration: "16s",
            animationDelay: "2s",
            opacity: "0.75",
            mixBlendMode: "multiply",
            outline: showDebug ? "2px dashed rgba(0,0,255,0.9)" : undefined,
          }}
        />

        {/* Blob 3 - Haze Lilac, middle-right, fast */}
        <div
          className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-brand-lilac blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#c6b8e6",
            borderRadius: "50% 50% 30% 70% / 50% 50% 70% 30%",
            animationDuration: "12s",
            animationDelay: "1s",
            opacity: "0.7",
            mixBlendMode: "multiply",
            outline: showDebug ? "2px dashed rgba(255,0,0,0.9)" : undefined,
          }}
        />

        {/* Blob 4 - Soft Sky, bottom-left, medium-fast */}
        <div
          className="absolute bottom-0 -left-1/3 w-80 h-80 rounded-full bg-brand-sky blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#9ad6ff",
            borderRadius: "70% 30% 70% 30% / 30% 70% 30% 70%",
            animationDuration: "13s",
            animationDelay: "3s",
            opacity: "0.72",
            mixBlendMode: "multiply",
            outline: showDebug ? "2px dashed rgba(0,0,255,0.9)" : undefined,
          }}
        />

        {/* Blob 5 - Haze Lilac, bottom-right, slow */}
        <div
          className="absolute -bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-lilac blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#c6b8e6",
            borderRadius: "30% 70% 30% 70% / 70% 30% 70% 30%",
            animationDuration: "15s",
            animationDelay: "4s",
            opacity: "0.75",
            mixBlendMode: "multiply",
            outline: showDebug ? "2px dashed rgba(255,0,0,0.9)" : undefined,
          }}
        />

        {/* Blob 6 - Soft Sky, center, very slow for depth */}
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-brand-sky blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#9ad6ff",
            borderRadius: "50% 50% 50% 50% / 30% 70% 30% 70%",
            animationDuration: "18s",
            animationDelay: "5s",
            opacity: "0.8",
            mixBlendMode: "multiply",
            outline: showDebug ? "2px dashed rgba(0,0,255,0.9)" : undefined,
          }}
        />

        {/* Blob 7 - Haze Lilac, bottom-left extra, medium */}
        <div
          className="absolute -bottom-1/3 -left-1/2 w-96 h-96 rounded-full bg-brand-lilac blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#b599d9",
            borderRadius: "70% 30% 30% 70% / 50% 50% 50% 50%",
            animationDuration: "16s",
            animationDelay: "2s",
            opacity: "0.95",
            mixBlendMode: "screen",
            outline: showDebug ? "2px dashed rgba(255,0,0,0.9)" : undefined,
          }}
        />

        {/* Blob 8 - Soft Sky, bottom-left corner, fast */}
        <div
          className="absolute -bottom-1/4 -left-1/4 w-72 h-72 rounded-full bg-brand-sky blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#5cb8ff",
            borderRadius: "30% 70% 70% 30% / 70% 30% 30% 70%",
            animationDuration: "11s",
            animationDelay: "4s",
            opacity: "0.95",
            mixBlendMode: "screen",
            outline: showDebug ? "2px dashed rgba(0,0,255,0.9)" : undefined,
          }}
        />

        {/* Blob 9 - Haze Lilac, left-middle, slow */}
        <div
          className="absolute top-1/3 -left-1/2 w-80 h-80 rounded-full bg-brand-lilac blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#a87fd5",
            borderRadius: "50% 50% 30% 70% / 70% 30% 70% 30%",
            animationDuration: "17s",
            animationDelay: "6s",
            opacity: "0.92",
            mixBlendMode: "screen",
            outline: showDebug ? "2px dashed rgba(255,0,0,0.9)" : undefined,
          }}
        />

        {/* Blob 10 - Soft Sky, top-center, medium */}
        <div
          className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full bg-brand-sky blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#6cc9ff",
            borderRadius: "70% 30% 30% 70% / 50% 50% 50% 50%",
            animationDuration: "15s",
            animationDelay: "1s",
            opacity: "0.95",
            mixBlendMode: "screen",
            outline: showDebug ? "2px dashed rgba(0,0,255,0.9)" : undefined,
          }}
        />

        {/* Blob 11 - Haze Lilac, right-middle extra, slow */}
        <div
          className="absolute top-2/3 -right-1/4 w-88 h-88 rounded-full bg-brand-lilac blur-3xl animate-blob"
          aria-hidden
          style={{
            backgroundColor: "#b89fdd",
            borderRadius: "30% 70% 50% 50% / 30% 50% 50% 70%",
            animationDuration: "19s",
            animationDelay: "3s",
            opacity: "0.93",
            mixBlendMode: "screen",
            outline: showDebug ? "2px dashed rgba(255,0,0,0.9)" : undefined,
          }}
        />
      </div>

      {/* Content Container - Single Frame Viewport */}
      <div className="relative z-10 h-screen w-full overflow-hidden flex flex-col px-3 md:px-4 py-0">
        {/* Logo Header - Compact on Mobile, Expanded on Desktop */}
        <div className="flex-shrink-0 pt-2 md:pt-4 pb-1 md:pb-2">
          <h2 className="text-brand-ink text-center tracking-widest font-semibold text-xs sm:text-sm uppercase">
            Muse & Mist
          </h2>
        </div>

        {/* Main Content - Flex Column Center */}
        <div className="flex-1 flex flex-col items-center  overflow-hidden">
          {!isSubmitted ? (
            <div className="w-full max-w-md flex flex-col gap-8 md:gap-2">
              {/* Headline - Mobile-optimized to fill vertical space */}
              <h1
                className="font-bold text-brand-ink text-center tracking-tight"
                style={{ fontSize: "clamp(3rem, 6.5vw, 2.75rem)" }}
              >
                SECURE YOUR GLOW.
              </h1>

              {/* Sub-headline - Responsive scaling, larger on mobile to use space */}
              <p
                className="text-brand-ink-muted text-center max-w-md mx-auto leading-tight"
                style={{ fontSize: "clamp(0.8rem, 2.5vw, 0.9rem)" }}
              >
                Secure your place on the Muse List. Get early access to the
                first drop and an exclusive early-bird launch discount.
              </p>

              {/* Glass Form - Compact on Mobile, Spacious on Desktop */}
              <form
                onSubmit={validateAndSubmit}
                className="backdrop-blur-sm bg-white/30 border border-white/50 rounded-2xl shadow-lg flex flex-col justify-center gap-1.5 md:gap-2 mt-0.5 md:mt-1"
                style={{ padding: "clamp(0.65rem, 2vw, 1.25rem)" }}
              >
                {/* Error Message */}
                {error && (
                  <div className="text-xs text-red-600 bg-red-50/80 border border-red-200 rounded-lg px-3 py-2 animate-fade-in">
                    {error}
                  </div>
                )}

                {/* Name Field */}
                <div className="flex flex-col gap-0.5 md:gap-1">
                  <label
                    htmlFor="name"
                    className="text-xs font-semibold text-brand-ink uppercase tracking-wider"
                  >
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    className="px-3 py-1 md:py-1.5 border border-white/50 rounded-lg bg-white/40 text-brand-ink placeholder-brand-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition-all duration-200 backdrop-blur-sm text-xs md:text-sm"
                  />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-0.5 md:gap-1">
                  <label
                    htmlFor="email"
                    className="text-xs font-semibold text-brand-ink uppercase tracking-wider"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="px-3 py-1 md:py-1.5 border border-white/50 rounded-lg bg-white/40 text-brand-ink placeholder-brand-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition-all duration-200 backdrop-blur-sm text-xs md:text-sm"
                  />
                </div>

                {/* OR Divider - Compact */}
                <div className="relative flex items-center my-0.5 md:my-1">
                  <div className="flex-grow border-t border-white/30" />
                  <span className="px-2 text-xs font-semibold text-brand-ink-muted uppercase tracking-widest">
                    Or
                  </span>
                  <div className="flex-grow border-t border-white/30" />
                </div>

                {/* Phone Field */}
                <div className="flex flex-col gap-0.5 md:gap-1">
                  <label
                    htmlFor="phone"
                    className="text-xs font-semibold text-brand-ink uppercase tracking-wider"
                  >
                    Phone (India)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPhone(value);
                      setPhoneError(getPhoneError(value));
                      setError("");
                    }}
                    className="px-3 py-1 md:py-1.5 border border-white/50 rounded-lg bg-white/40 text-brand-ink placeholder-brand-ink-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:border-transparent transition-all duration-200 backdrop-blur-sm text-xs md:text-sm"
                  />
                  {phoneError && (
                    <div className="text-xs text-orange-600 mt-0.5 animate-fade-in">
                      ⚠️ {phoneError}
                    </div>
                  )}
                </div>

                {/* Consent Checkbox - Extra spacing on mobile for thumb-zone clarity */}
                <div className="flex items-start gap-2 pt-1 md:pt-0.5">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      setError("");
                    }}
                    className="w-4 h-4 mt-0.5 rounded border border-white/50 bg-white/40 cursor-pointer accent-brand-sky transition-all duration-200 flex-shrink-0"
                  />
                  <label
                    htmlFor="consent"
                    className="text-xs text-brand-ink-muted leading-tight cursor-pointer hover:text-brand-ink transition-colors"
                  >
                    I agree to receive launch updates and early access alerts.
                    Consent required per Digital Personal Data Protection Act
                    2026.
                  </label>
                </div>

                {/* CTA Button - Maintains 44px min height for accessibility */}
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !validateName(name) ||
                    (!email.trim() && !phone.trim()) ||
                    (email.trim() && !validateEmail(email)) ||
                    (phone.trim() && !validatePhone(phone)) ||
                    !consent
                  }
                  className="w-full mt-1.5 md:mt-1 px-4 py-2.5 min-h-[44px] font-semibold text-xs md:text-sm rounded-lg transition-all duration-300 relative overflow-hidden group enabled:hover:shadow-2xl enabled:active:scale-95 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, #6cc9ff 0%, #5cb8ff 100%)",
                    color: "#131824",
                    boxShadow: "0 4px 15px rgba(108, 201, 255, 0.3)",
                  }}
                >
                  {/* Shimmer Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-enabled:group-hover:opacity-20 transform -translate-x-full group-enabled:group-hover:translate-x-full transition-transform duration-700" />

                  {/* Button Content */}
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            opacity="0.3"
                          />
                          <path
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        JOIN THE MUSES
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-enabled:group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </>
                    )}
                  </span>

                  {/* Disabled State Styling */}
                  {(isLoading ||
                    !validateName(name) ||
                    (!email.trim() && !phone.trim()) ||
                    (email.trim() && !validateEmail(email)) ||
                    (phone.trim() && !validatePhone(phone)) ||
                    !consent) && (
                    <style>{`
                      button[disabled] {
                        background: linear-gradient(135deg, #9ad6ff 0%, #9ad6ff 100%) !important;
                        opacity: 0.5 !important;
                        box-shadow: 0 2px 8px rgba(108, 201, 255, 0.15) !important;
                      }
                    `}</style>
                  )}
                </button>

                <p className="text-xs text-brand-ink-muted text-center pt-0.5 md:pt-1 text-[0.65rem] md:text-xs">
                  We respect your privacy. No spam, ever.
                </p>
              </form>
            </div>
          ) : (
            /* Success State - Single Frame */
            <div
              className="text-center max-w-md backdrop-blur-sm bg-white/30 border border-white/50 rounded-2xl shadow-lg flex flex-col items-center justify-center animate-fade-in"
              style={{ padding: "clamp(1rem, 3vw, 1.25rem)" }}
            >
              {/* Success Icon */}
              <div className="mb-2 flex justify-center flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-brand-sky/20 border border-brand-sky/50 flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-6 h-6 text-brand-sky"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              {/* Success Message */}
              <h2
                className="font-bold text-brand-ink mb-1"
                style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)" }}
              >
                Access Secured, Muse.
              </h2>

              <p
                className="text-brand-ink-muted leading-tight"
                style={{ fontSize: "clamp(0.75rem, 1.8vw, 0.875rem)" }}
              >
                We will contact you once at launch with your exclusive
                early-bird code. Welcome to the circle.
              </p>

              {/* Decorative Element */}
              <div className="mt-3 flex justify-center gap-1.5 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-brand-lilac-soft opacity-60" />
                <div className="w-2 h-2 rounded-full bg-brand-lilac-soft opacity-40" />
                <div className="w-2 h-2 rounded-full bg-brand-lilac-soft opacity-20" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-6 right-6 max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 animate-fade-in ${
            toast.type === "success"
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
