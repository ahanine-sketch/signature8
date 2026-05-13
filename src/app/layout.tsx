import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Signature 8 | Architecture d'Intérieur Paris",
  description: "Agence d'architecture d'intérieur haut de gamme à Paris. Design éditorial, luxe confidentiel et espaces sur-mesure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased font-body font-normal text-on-surface bg-background selection:bg-primary/20 selection:text-primary overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-body" suppressHydrationWarning>
         <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
         </AuthProvider>
      </body>
    </html>
  );
}
