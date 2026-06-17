import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
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
      <body className="min-h-full flex flex-col bg-slate-50 text-brand-black">
        {/* Global Architecture Header */}
        <header className="bg-brand-black text-white sticky top-0 z-40 border-b border-brand-gray shadow-md">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="w-3 h-3 rounded-full bg-brand-gold animate-pulse" />
              <span className="font-bold tracking-wider text-sm md:text-base uppercase group-hover:text-brand-gold transition-colors">
                UBFSF FOUNDATION
              </span>
            </Link>
            
            <nav className="flex items-center gap-6 text-sm font-semibold tracking-wide uppercase">
              <Link href="/" className="hover:text-brand-gold transition-colors">
                Home
              </Link>
              <Link href="/contributors" className="hover:text-brand-gold transition-colors">
                Matrix Feed
              </Link>
              <a 
                href="https://ubfsf.org/" 
                target="_blank" 
                rel="noreferrer"
                className="bg-brand-gold text-brand-black px-4 py-2 rounded font-bold hover:bg-opacity-90 transition-all text-xs"
              >
                DONATE NOW
              </a>
            </nav>
          </div>
        </header>

        {/* Dynamic Route Content Execution Layer */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global Architecture Footer */}
        <footer className="bg-brand-black text-white/40 border-t border-brand-gray py-6 text-center text-xs font-mono tracking-widest uppercase">
          © 2026 UBFSF Distributed Core. All Rights Reserved.
        </footer>
        
        <Analytics />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}