import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/toast-context";
import { ToastContainer } from "@/components/ToastContainer";

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
  title: "Muse & Mist | Secure Your Glow",
  description:
    "Join the Muse List for early access to the 3-in-1 Day Shield. Luxury skincare, scientifically softened.",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
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
          <ToastContainer />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
