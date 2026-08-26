import { cn } from "@doresume/ui/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";

import Header from "@/components/header";
import Providers from "@/components/providers";

import "../index.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description: "Build a resume that gets you hired.",
  title: "doresume",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={cn("font-sans", inter.variable)}
  >
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Providers>
        <div className="grid min-h-svh grid-rows-[auto_1fr]">
          <Header />
          {children}
        </div>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
