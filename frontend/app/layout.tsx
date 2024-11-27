"use client";

import { usePathname } from 'next/navigation';
import localFont from "next/font/local";
import "./globals.css";
import { EventProvider } from "@/components/EventContext";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/layout/footer";
import { UserProvider } from "@/contexts/UserProvider";

import { inter } from '@/app/fonts/fonts';
import { k2d } from '@/app/fonts/fonts';
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isProfileCalendarRoute = pathname === '/profile/calendar';

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <title>Eventify</title>
        <meta name='description' content="Eventify est une plateforme de gestion d'événements." />
        <link rel="icon" href="/images/logo_eventify.ico" />
      </head>
      <body
        className={`${inter.className} antialiased min-h-dvh`}
      >
        <UserProvider>
          <Navbar />
          <EventProvider>
            <main className="flex-grow min-h-screen">{children}</main>
            <Toaster />
          </EventProvider>
          {!isProfileCalendarRoute && <Footer />}
        </UserProvider>
      </body>
    </html>
  );
}