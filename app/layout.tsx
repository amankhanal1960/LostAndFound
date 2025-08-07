"use client";
import { Geist } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // Pages where header/footer should be hidden
  const hideHeaderFooter = [
    "/",
    "/auth/login",
    "/auth/register",
    "/not-found",
  ].includes(pathname);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <SessionProvider>
          {!hideHeaderFooter && <Header />}
          <main className={hideHeaderFooter ? "" : "pt-16"}>
            <SnackbarProvider maxSnack={5} autoHideDuration={3000}>
              {children}
            </SnackbarProvider>
          </main>
          {!hideHeaderFooter && <Footer />}
        </SessionProvider>
      </body>
    </html>
  );
}
