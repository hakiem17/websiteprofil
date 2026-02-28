"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    useVisitorTracking();
    const isAdmin = pathname?.startsWith("/admin");
    const isAuth = pathname?.startsWith("/login");
    const shouldHideLayout = isAdmin || isAuth;

    return (
        <>
            {/* Only show Public Header if NOT on Admin or Auth routes */}
            {!shouldHideLayout && <Header />}

            {/* Conditional padding: pt-32 only for public pages to account for fixed header */}
            <main
                className={cn(
                    "grow bg-background text-foreground transition-colors duration-300",
                    !shouldHideLayout ? "pt-32 pb-8" : "h-screen overflow-auto"
                )}
            >
                {children}
            </main>

            {/* Only show Public Footer if NOT on Admin or Auth routes */}
            {!shouldHideLayout && <Footer />}
        </>
    );
}
