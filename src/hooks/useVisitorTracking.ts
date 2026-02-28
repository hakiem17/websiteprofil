"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useVisitorTracking() {
    const pathname = usePathname();

    useEffect(() => {
        // Don't track admin or API routes
        if (pathname?.startsWith("/admin") || pathname?.startsWith("/api") || pathname?.startsWith("/login")) {
            return;
        }

        // Use a session key to avoid double-counting on the same page in the same session
        const sessionKey = `visited_${pathname}`;
        if (typeof window !== "undefined" && sessionStorage.getItem(sessionKey)) {
            return;
        }

        const track = async () => {
            try {
                await fetch("/api/visitor-stats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ page_path: pathname }),
                });
                if (typeof window !== "undefined") {
                    sessionStorage.setItem(sessionKey, "1");
                }
            } catch {
                // silently fail
            }
        };

        track();
    }, [pathname]);
}
