import { AppContext } from "@/components/context";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { Header } from "@/components/layout/header";
import { Bebas_Neue, Pathway_Extreme } from "next/font/google";

const bebas_neue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--display-family",
});

const pathway_extreme = Pathway_Extreme({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--text-family",
});

export const metadata: Metadata = {
  title: "Memorial Epitaph Generator - Placid SDK",
  description: "Generate memorial epitaphs for your loved ones",
};

export const viewport: Viewport = {
  initialScale: 1,
  viewportFit: "cover",
  width: "device-width",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "oklch(1 0 0)" },
    { media: "(prefers-color-scheme: dark)", color: "oklch(0.145 0 0)" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          bebas_neue.variable,
          pathway_extreme.variable,
          "antialiased font-text"
        )}
      >
        <AppContext>
          <Header />
          <main className="flex-1 flex flex-col justify-center">
            {children}
          </main>
          <footer className="p-4">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} FinalSpaces.com; All rights reserved.
            </p>
          </footer>
        </AppContext>
      </body>
    </html>
  );
}
