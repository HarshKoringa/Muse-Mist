"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { User, UserCircle2, ShoppingBag } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const handleShopClick = () => {
    if (pathname === "/home-v1") {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/home-v1#products");
    }
  };
  const [hidden, setHidden] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();
  const [cartCount, setCartCount] = useState(0);
  const totalItems = useCartStore((state) => state.totalItems);

  useEffect(() => {
    setCartCount(totalItems());
    const unsub = useCartStore.subscribe((state) => {
      setCartCount(state.totalItems());
    });
    return () => unsub();
  }, []);

  // Track Supabase auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Hide on scroll down, show on scroll up — improved thresholds and menu handling
  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY;

      if (open) {
        // keep header visible while mobile menu is open
        if (hidden) setHidden(false);
        lastY = currentY;
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastY;

          // use a slightly larger threshold so small jitters don't toggle visibility
          if (currentY > 80 && delta > 10) {
            setHidden(true);
          } else if (delta < -10 || currentY < 60) {
            setHidden(false);
          }

          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll("section[id]"),
    ) as HTMLElement[];

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.25, 0.5],
      },
    );

    sections.forEach((s) => observerRef.current?.observe(s));

    // handle hash on load
    const handleHash = () =>
      setActive(window.location.hash.replace("#", "") || "");
    handleHash();
    window.addEventListener("hashchange", handleHash);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  const linkClass = (id: string) =>
    `font-medium transition ${active === id ? "text-[#1A237E]" : "text-[#131824] hover:text-[#1A237E]"}`;

  return (
    <>
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md bg-[#DCEFFF]/70 border-b-[0.5px] border-indigo-900/10 transform transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-[#1A237E]">
            Muse &amp; Mist
          </div>

          <div className="hidden md:flex gap-8 items-center">
            <button
              onClick={handleShopClick}
              className="text-base font-medium text-[#1A237E] hover:opacity-70 transition-opacity cursor-pointer"
            >
              Shop
            </button>
            <Link
              href="/about"
              className="text-base font-medium text-[#1A237E] hover:opacity-70 transition-opacity"
            >
              About
            </Link>

            {/* Cart icon with badge */}
            <Link href="/cart" className="relative">
              <ShoppingBag
                size={24}
                className="text-[#1A237E] cursor-pointer hover:opacity-70 transition-opacity"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1A237E] text-white text-xs font-semibold flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User account trigger */}
            {user ? (
              <Link href="/profile">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-[#1A237E] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full border-2 border-[#1A237E] bg-[#DCD9F8] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                    <UserCircle2 size={22} className="text-[#1A237E]" />
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-[#1A237E] text-white text-base font-medium hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A237E]/30"
            >
              <svg
                className="w-6 h-6 text-[#1A237E]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-over */}
      <div className={`fixed inset-0 z-40 md:hidden pointer-events-none`}>
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />

        <aside
          className={`absolute inset-y-0 right-0 w-72 bg-white/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="text-lg font-bold text-[#1A237E]">Menu</div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-2"
            >
              <svg
                className="w-5 h-5 text-[#1A237E]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col gap-4 px-6 py-2">
            <button
              onClick={() => { handleShopClick(); setOpen(false); }}
              className="py-2 text-base font-medium text-[#1A237E] text-left hover:opacity-70 transition-opacity cursor-pointer"
            >
              Shop
            </button>
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="py-2 text-base font-medium text-[#131824] hover:text-[#1A237E]"
            >
              About
            </Link>

            {/* Mobile Login / Account */}
            <div className="pt-4 mt-2 border-t border-indigo-900/10">
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#DCD9F8] text-[#1A237E] text-base font-semibold hover:bg-[#c9c5f4] transition"
                >
                  {user.user_metadata?.avatar_url ? (
                    <Image
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-full border border-[#1A237E] object-cover"
                    />
                  ) : (
                    <UserCircle2 size={18} className="text-[#1A237E]" />
                  )}
                  My Account
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#1A237E] text-white text-base font-semibold hover:bg-[#151c6b] transition"
                >
                  <User className="w-4 h-4" strokeWidth={1.75} />
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}
