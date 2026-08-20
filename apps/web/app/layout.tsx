import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { ReactNode } from "react";

import "./globals.css";

import { ThemeProvider } from "./_components/theme-provider";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "DB SDK",
    template: "%s · DB SDK",
  },
  description:
    "A unified TypeScript SDK for connecting to databases whose schema you do not control at compile time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <ThemeProvider>
          <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
