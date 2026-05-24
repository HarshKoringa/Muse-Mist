"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { UserCircle2, ShoppingBag } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isDarkHero = pathname === '/' || pathname === '/routine' || pathname === '/about';

  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const supabase = createClient();
  const [cartCount, setCartCount] = useState(0);
  const openCart = useCartUIStore((state) => state.openCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setCartCount(useCartStore.getState().totalItems());
    const unsub = useCartStore.subscribe((state) => {
      setCartCount(state.totalItems());
    });
    return () => unsub();
  }, [mounted]);

  const handleShopClick = () => {
    if (pathname === "/") {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#products");
    }
  };

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

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 80);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastY;
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
  }, []);

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

    const handleHash = () =>
      setActive(window.location.hash.replace("#", "") || "");
    handleHash();
    window.addEventListener("hashchange", handleHash);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  const isDark = mounted && isDarkHero && !scrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transform transition-all duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"} ${isDark ? 'bg-white/5 backdrop-blur-md border-b border-white/10' : 'bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-sm shadow-black/5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Muse & Mist"
            width={36}
            height={36}
            className="object-contain"
          />
          <span
            style={{ fontFamily: 'var(--font-display)' }}
            className={`text-xl font-semibold hidden sm:block transition-colors duration-300 ${mounted && isDarkHero && !scrolled ? 'text-[#1A237E]/70' : 'text-[#1A237E]'}`}
          >
            Muse &amp; Mist
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          <button
            onClick={handleShopClick}
            className={`text-base font-medium transition-colors duration-300 hover:opacity-70 cursor-pointer ${isDark ? 'text-white/90' : 'text-[#1A237E]'}`}
          >
            Shop
          </button>
          <Link
            href="/routine"
            className={`text-base font-medium transition-colors duration-300 hover:opacity-70 ${isDark ? 'text-white/90' : 'text-[#1A237E]'}`}
          >
            Routine
          </Link>
          <Link
            href="/about"
            className={`text-base font-medium transition-colors duration-300 hover:opacity-70 ${isDark ? 'text-white/90' : 'text-[#1A237E]'}`}
          >
            About
          </Link>

          {/* Cart icon with badge */}
          <button onClick={openCart} className="relative cursor-pointer" aria-label="Open cart">
            <ShoppingBag
              size={24}
              className={`transition-colors duration-300 hover:opacity-70 ${isDark ? 'text-white/90' : 'text-[#1A237E]'}`}
            />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#1A237E] text-white text-xs font-semibold flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* User account */}
          {mounted && user ? (
            <Link href="/profile">
              {user.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  width={36}
                  height={36}
                  className={`rounded-full border-2 object-cover cursor-pointer hover:opacity-90 transition-opacity w-9 h-9 ${isDark ? 'border-white' : 'border-[#1A237E]'}`}
                />
              ) : (
                <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity ${isDark ? 'border-white bg-white/10' : 'border-[#1A237E] bg-[#DCD9F8]'}`}>
                  <UserCircle2 size={22} className={isDark ? 'text-white' : 'text-[#1A237E]'} />
                </div>
              )}
            </Link>
          ) : mounted ? (
            <Link
              href="/login"
              className={`px-5 py-2.5 rounded-xl text-base font-medium transition-all duration-300 hover:opacity-90 ${isDark ? 'bg-white/15 backdrop-blur-sm text-white border border-white/20 hover:bg-white/25' : 'bg-[#1A237E] text-white'}`}
            >
              Sign In
            </Link>
          ) : null}
        </div>

        {/* Mobile: cart icon only */}
        <div className="md:hidden">
          <button onClick={openCart} className="relative cursor-pointer" aria-label="Open cart">
            <ShoppingBag
              size={22}
              className={`transition-colors duration-300 ${isDark ? 'text-white/90' : 'text-[#1A237E]'}`}
            />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#1A237E] text-white text-[10px] font-semibold flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
