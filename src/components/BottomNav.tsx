"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Sparkles, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { scrollToProducts } from "@/lib/scroll";

type Tab = "shop" | "routine" | "account";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const hidden =
    pathname.startsWith("/checkout") || pathname === "/login";

  if (hidden) return null;

  const active: Tab | null =
    pathname === "/" || pathname.startsWith("/products") ? "shop"
    : pathname.startsWith("/routine") ? "routine"
    : pathname === "/profile" ? "account"
    : null;

  const handleShop = () => {
    if (pathname === "/") {
      scrollToProducts();
    } else {
      router.push("/#products");
    }
  };

  const handleTab = (tab: Tab) => {
    if (tab === "shop") {
      handleShop();
    } else if (tab === "routine") {
      router.push("/routine");
    } else if (tab === "account") {
      router.push(user ? "/profile" : "/login");
    }
  };

  const tabs: { key: Tab; label: string; Icon: typeof ShoppingBag }[] = [
    { key: "shop", label: "Shop", Icon: ShoppingBag },
    { key: "routine", label: "Routine", Icon: Sparkles },
    { key: "account", label: "Account", Icon: User },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {tabs.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => handleTab(key)}
              style={{ minHeight: "44px", minWidth: "44px" }}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.6}
                color={isActive ? "#1A237E" : "#9CA3AF"}
              />
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#1A237E" : "#9CA3AF",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
