// app/layout.tsx
import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus - Workstation & Booking",
  description:
    "Platform reservasi coworking space yang mudah, cepat, dan terpercaya. Booking personal desk, meeting room, dan private office.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoadingScreen>
          <NavbarWrapper />
          {children}
        </LoadingScreen>
      </body>
    </html>
  );
}