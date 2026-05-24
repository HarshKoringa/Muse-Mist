import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast-context";
import { ToastContainer } from "@/components/ToastContainer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ContentWrapper from "@/components/ContentWrapper";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: {
    default: 'Muse & Mist | Glazed Skin. No Drama.',
    template: '%s | Muse & Mist',
  },
  description: 'Hybrid Harmony Skincare. High-performance actives meet calming botanicals. Built for real Indian skin.',
  keywords: [
    'skincare', 'serum', 'sunscreen', 'moisturizer',
    'niacinamide', 'vitamin c', 'India', 'Gen Z skincare',
    'Muse and Mist', 'HRK Wellness',
  ],
  authors: [{ name: 'Muse & Mist' }],
  creator: 'HRK Wellness LLP',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://museandmist.in',
    siteName: 'Muse & Mist',
    title: 'Muse & Mist | Glazed Skin. No Drama.',
    description: 'Hybrid Harmony Skincare. High-performance actives meet calming botanicals.',
    images: [
      {
        url: '/logo.png',
        width: 1080,
        height: 1080,
        alt: 'Muse & Mist Logo',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} ${dmSans.variable} antialiased`}
      >
        <ToastProvider>
          <Header />
          <ToastContainer />
          <CartDrawer />
          <BottomNav />
          <ContentWrapper>
            <main>
              {children}
            </main>
            <Footer />
          </ContentWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
