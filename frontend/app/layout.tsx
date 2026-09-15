// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/navbar/NavbarWrapper";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Space Booking - Coworking Space",
  description: "Platform reservasi coworking space yang mudah, cepat, dan terpercaya. Booking personal desk, meeting room, dan private office.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <LoadingScreen>
          <NavbarWrapper />
          {children}
        </LoadingScreen>
      </body>
    </html>
  );
}