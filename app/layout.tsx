"use client";
import { Geist } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

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
          <SnackbarProvider maxSnack={5} autoHideDuration={3000}>
            {children}
          </SnackbarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
