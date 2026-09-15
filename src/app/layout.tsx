import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from "next-themes";
import { Cormorant_Garamond, League_Spartan, Inter } from "next/font/google";
import './globals.css';

// Brand typography (UBFSF Brand Memorandum §9)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});
const spartan = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-spartan',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${spartan.variable} ${inter.variable} antialiased selection:bg-ubfsf-gold selection:text-black`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}