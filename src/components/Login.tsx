"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/lib/toast-context";
import { Phone, Lock, Eye, EyeOff, LogIn } from "lucide-react";

type AuthStep = "phone" | "otp";

export function Login() {
  const router = useRouter();
  const { addToast } = useToast();
  const supabase = createClient();

  const [authStep, setAuthStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showOtpPassword, setShowOtpPassword] = useState(false);
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState("");

  // Timer effect for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value.slice(0, 10));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (phoneNumber.length !== 10) {
      addToast("Please enter a valid 10-digit phone number", "error");
      return;
    }

    const fullPhoneNumber = `+91${phoneNumber}`;
    setDisplayPhoneNumber(fullPhoneNumber);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (error) {
        addToast(error.message || "Failed to send OTP", "error");
      } else {
        setAuthStep("otp");
        setResendTimer(30);
        addToast("OTP sent to your phone number", "success");
      }
    } catch (err) {
      addToast("An error occurred while sending OTP", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      addToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    setLoading(true);

    try {
      const { error, data } = await supabase.auth.verifyOtp({
        phone: displayPhoneNumber,
        token: otp,
        type: "sms",
      });

      if (error) {
        addToast(error.message || "Invalid OTP", "error");
      } else if (data.user) {
        addToast("Welcome back, Muse", "success");
        // Redirect to home-v1 after a short delay to show the toast
        setTimeout(() => {
          router.push("/home-v1");
        }, 500);
      }
    } catch (err) {
      addToast("An error occurred while verifying OTP", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: displayPhoneNumber,
      });

      if (error) {
        addToast(error.message || "Failed to resend OTP", "error");
      } else {
        setResendTimer(30);
        addToast("OTP resent to your phone number", "success");
      }
    } catch (err) {
      addToast("An error occurred while resending OTP", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        addToast(error.message || "Failed to sign in with Google", "error");
      }
    } catch (err) {
      addToast("An error occurred while signing in with Google", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-8">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#DCD9F8] via-white to-[#DCEFFF]" />

      {/* Main card */}
      <div
        className="w-full max-w-md backdrop-blur-xl bg-white/90 rounded-[24px] 
        shadow-2xl border border-white/20 p-8 sm:p-10 space-y-8"
      >
        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#1A237E]">Muse & Mist</h1>
          <p className="text-sm text-gray-600">Secure Your Glow</p>
        </div>

        {authStep === "phone" ? (
          // Phone Authentication Form
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="9876543210"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  className="w-full pl-20 pr-4 py-3 text-base rounded-lg
                  border border-gray-300 focus:border-[#1A237E] focus:ring-2 
                  focus:ring-[#1A237E]/20 outline-none transition-all
                  bg-gray-50 hover:bg-white placeholder-gray-400"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500">
                We'll send you a 6-digit OTP to verify your number
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || phoneNumber.length !== 10}
              className="w-full bg-[#1A237E] hover:bg-[#0d1456] text-white font-semibold 
              py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center 
              justify-center gap-2 text-base"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // OTP Verification Form
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <p className="text-xs text-gray-500">
                Sent to {displayPhoneNumber}
              </p>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showOtpPassword ? "text" : "password"}
                  inputMode="numeric"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                  className="w-full pl-12 pr-12 py-3 text-base tracking-widest font-semibold
                  rounded-lg border border-gray-300 focus:border-[#1A237E] focus:ring-2 
                  focus:ring-[#1A237E]/20 outline-none transition-all
                  bg-gray-50 hover:bg-white placeholder-gray-400"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowOtpPassword(!showOtpPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 
                  hover:text-gray-600 transition-colors"
                >
                  {showOtpPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#1A237E] hover:bg-[#0d1456] text-white font-semibold 
              py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 
              disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center 
              justify-center gap-2 text-base"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* Resend OTP section */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the OTP?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="text-[#1A237E] hover:text-[#0d1456] font-semibold 
                  disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                </button>
              </p>
            </div>

            {/* Back to phone input */}
            <button
              type="button"
              onClick={() => {
                setAuthStep("phone");
                setOtp("");
                setResendTimer(0);
              }}
              disabled={loading}
              className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 
              transition-colors disabled:opacity-50"
            >
              ← Use Different Number
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm font-medium text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg
          border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50
          font-semibold text-gray-700 transition-all duration-300 hover:scale-105 
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
