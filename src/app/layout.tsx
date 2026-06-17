import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono_Font({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UBFSF Modern Portfolio",
  description: "Headless media streaming network and contributor archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-gray text-brand-black">
        {children}
        
        {/* Engine 1: Vercel Native Client Analytics */}
        <Analytics />

        {/* Engine 2: Google Analytics GA4 Client Wrapper */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}