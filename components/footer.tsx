"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // If not authenticated, render nothing
  if (status !== "authenticated" || !session) {
    return null;
  }

  const essentialLinks = [
    { label: "Contact Us", href: "/not-found" },
    { label: "Privacy Policy", href: "/not-found" },
    { label: "Terms of Service", href: "/not-found" },
    { label: "Developer Info", href: "/not-found" },
  ];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#101880]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* horizontal rule */}
        <div className="w-full h-px bg-gray-700 mb-12" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left side */}
          <div className="w-full md:w-auto text-center md:text-left mb-6 md:mb-0">
            <p className="text-sm sm:text-base font-normal text-gray-300">
              © {currentYear} Lost &amp; Found System. All rights reserved.
            </p>
          </div>

          {/* Right side: responsive link list */}
          <div
            className="
              w-full md:w-auto
              flex flex-col space-y-3 items-center
              md:flex-row md:space-y-0 md:space-x-6 md:items-center
              mt-4 md:mt-0
            "
          >
            {essentialLinks.map((link) => (
              <Button
                key={link.label}
                variant="link"
                className="
                  h-auto p-0 text-sm sm:text-base
                  text-gray-300 hover:text-white
                  font-normal
                "
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
