"use client";

import { SnackbarProvider } from "notistack";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderFooter = [
    "/",
    "/auth/login",
    "/auth/register",
    "/not-found",
  ].includes(pathname);

  return (
    <SessionProvider>
      {!hideHeaderFooter && <Header />}
      <main className={hideHeaderFooter ? "" : "pt-16"}>
        <SnackbarProvider maxSnack={5} autoHideDuration={3000}>
          {children}
        </SnackbarProvider>
      </main>
      {!hideHeaderFooter && <Footer />}
    </SessionProvider>
  );
}
