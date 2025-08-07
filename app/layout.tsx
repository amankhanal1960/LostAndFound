"use client";
import { Geist } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <SessionProvider>
          <Header />
          <main className="pt-16">
            <SnackbarProvider maxSnack={5} autoHideDuration={3000}>
              {children}
            </SnackbarProvider>
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
