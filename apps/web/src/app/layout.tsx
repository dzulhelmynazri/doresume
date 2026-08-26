import { cn } from "@doresume/ui/lib/utils";
import type { Metadata } from "next";

import "../index.css";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description: "doresume",
  title: "doresume",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html
    lang="en"
    suppressHydrationWarning
    className={cn("font-sans", inter.variable)}
  >
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <Providers>
        <div className="grid h-svh grid-rows-[auto_1fr]">{children}</div>
      </Providers>
    </body>
  </html>
);

export default RootLayout;
