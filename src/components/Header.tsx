"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { UserCircle2, ShoppingBag } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useCartStore } from "@/store/cartStore";
import { useCartUIStore } from "@/store/cartUIStore";
import { scrollToProducts } from "@/lib/scroll";

const LOGO_ICON = "/images/logo-icon.png";
const LOGO_TEXT = "/images/logo-text.png";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
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
      scrollToProducts();
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transform transition-all duration-300 bg-white/85 backdrop-blur-[10px] border-b border-white/50 shadow-sm shadow-black/5 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 lg:gap-2">
          <Image
            src={LOGO_ICON}
            alt="Muse & Mist"
            width={40}
            height={40}
            className="w-9 h-9 lg:w-12 lg:h-12 object-contain"
          />
          <Image
            src={LOGO_TEXT}
            alt="Muse & Mist"
            width={140}
            height={32}
            className="w-30 h-7 lg:w-40 lg:h-9 object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          <button
            onClick={handleShopClick}
            className="text-base font-medium text-[#0D1117] transition-opacity hover:opacity-60 cursor-pointer"
          >
            Shop
          </button>
          <Link
            href="/routine"
            className="text-base font-medium text-[#0D1117] transition-opacity hover:opacity-60"
          >
            Routine
          </Link>
          <Link
            href="/about"
            className="text-base font-medium text-[#0D1117] transition-opacity hover:opacity-60"
          >
            About
          </Link>

          {/* Cart icon with badge */}
          <button onClick={openCart} className="relative cursor-pointer" aria-label="Open cart">
            <ShoppingBag
              size={24}
              className="text-[#0D1117] transition-opacity hover:opacity-60"
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
              <div className="w-9 h-9 rounded-full border-2 border-[#1A237E] bg-[#DCD9F8] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                <UserCircle2 size={22} className="text-[#1A237E]" />
              </div>
            </Link>
          ) : mounted ? (
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl text-base font-medium bg-[#1A237E] text-white transition-opacity hover:opacity-90"
            >
              Sign In
            </Link>
          ) : null}
        </div>

        {/* Mobile: cart icon only */}
        <div className="md:hidden">
          <button onClick={openCart} className="relative cursor-pointer" aria-label="Open cart">
            <ShoppingBag size={22} className="text-[#0D1117]" />
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
