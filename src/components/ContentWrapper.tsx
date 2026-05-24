"use client";

import { useEffect, useState } from "react";
import { useCartUIStore } from "@/store/cartUIStore";

export default function ContentWrapper({ children }: { children: React.ReactNode }) {
  const isCartOpen = useCartUIStore((state) => state.isCartOpen);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      style={{
        marginRight: isDesktop && isCartOpen ? "420px" : "0px",
        transition: "margin-right 0.3s ease",
      }}
    >
      {children}
    </div>
  );
}
