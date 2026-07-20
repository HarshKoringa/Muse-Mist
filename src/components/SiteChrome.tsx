"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BottomNav from "@/components/BottomNav";
import MetaPixel from "@/components/MetaPixel";
import ContentWrapper from "@/components/ContentWrapper";
import { ToastContainer } from "@/components/ToastContainer";

// The maintenance page must render with zero backend calls — Header and
// CartDrawer both talk to Supabase, so they (and the rest of the normal
// site chrome) are skipped entirely on that route rather than just hidden.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/maintenance") {
    return <>{children}</>;
  }

  return (
    <>
      <MetaPixel />
      <Header />
      <ToastContainer />
      <CartDrawer />
      <BottomNav />
      <ContentWrapper>
        <main>{children}</main>
        <Footer />
      </ContentWrapper>
    </>
  );
}
