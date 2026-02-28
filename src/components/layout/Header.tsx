"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, ChevronDown, Search, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

// Define types for Menu
interface MenuItem {
    id: string;
    title: string;
    href: string;
    children?: MenuItem[];
}

export function Header() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [menus, setMenus] = useState<MenuItem[]>([]);

    const [siteSettings, setSiteSettings] = useState<{ site_name: string; logo_url: string | null; description: string | null }>({
        site_name: "Pemerintah Daerah",
        logo_url: null,
        description: null
    });

    // Check if we are on an admin route
    // We do NOT return early here to ensure hooks are always called (React Rule of Hooks)
    const isAdmin = pathname?.startsWith("/admin");

    // Reset scroll state when route changes
    useEffect(() => {
        if (isAdmin) return;
        setScrolled(window.scrollY > 10);
    }, [pathname, isAdmin]);

    useEffect(() => {
        // Don't run effects on admin pages
        if (isAdmin) return;

        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        // Check current scroll position immediately on mount
        handleScroll();
        window.addEventListener("scroll", handleScroll);

        const fetchData = async () => {
            // Fetch Menus
            const fetchMenusPromise = supabase
                .from("navigation_menus")
                .select("id, title, href, parent_id, order")
                .eq("is_active", true)
                .order("order", { ascending: true });

            // Fetch Site Settings
            const fetchSettingsPromise = supabase
                .from("site_settings")
                .select("site_name, logo_url, description")
                .single();

            const [menusResult, settingsResult] = await Promise.all([fetchMenusPromise, fetchSettingsPromise]);

            // Handle Menus
            if (menusResult.data) {
                const data = menusResult.data;
                // Transform flat data to tree
                const menuMap = new Map<string, MenuItem>();
                const rootMenus: MenuItem[] = [];

                data.forEach((item) => {
                    menuMap.set(item.id, {
                        id: item.id,
                        title: item.title,
                        href: item.href,
                        children: []
                    });
                });

                data.forEach((item) => {
                    const menu = menuMap.get(item.id)!;
                    if (item.parent_id && menuMap.has(item.parent_id)) {
                        menuMap.get(item.parent_id)!.children!.push(menu);
                    } else {
                        rootMenus.push(menu);
                    }
                });
                setMenus(rootMenus);
            }

            // Handle Settings
            if (settingsResult.data) {
                setSiteSettings({
                    site_name: settingsResult.data.site_name || "Pemerintah Daerah",
                    logo_url: settingsResult.data.logo_url,
                    description: settingsResult.data.description
                });
            }
        };

        fetchData();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [isAdmin]);

    // If on admin route, render nothing (but after hooks have run)
    if (isAdmin) {
        return null;
    }

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-shadow duration-300",
                "bg-white dark:bg-slate-950",
                scrolled && "shadow-md"
            )}
        >
            {/* Top Bar */}
            <div className="bg-primary text-primary-foreground text-xs py-2 hidden md:block">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-4">
                        <span>
                            {new Date().toLocaleDateString("id-ID", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    {/* Right side actions removed to avoid duplication */}
                </div>
            </div>

            {/* Main Navbar */}
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {siteSettings.logo_url ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                                <Image
                                    src={siteSettings.logo_url}
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:bg-primary/90 transition-colors">
                                {siteSettings.site_name.substring(0, 1)}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-bold text-lg leading-tight text-slate-900 dark:text-white">
                                {siteSettings.site_name}
                            </span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {siteSettings.description || "Website Resmi"}
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center">
                        {menus.map((section) => (
                            <div
                                key={section.title}
                                className="relative group"
                                onMouseEnter={() => setActiveDropdown(section.title)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <div className="flex items-center gap-1 text-sm font-medium py-2 cursor-pointer transition-colors text-slate-700 dark:text-slate-200 hover:text-primary">
                                    {section.children && section.children.length > 0 ? (
                                        <>
                                            {section.title}
                                            <ChevronDown
                                                className={cn(
                                                    "h-4 w-4 transition-transform duration-200",
                                                    activeDropdown === section.title && "rotate-180"
                                                )}
                                            />
                                        </>
                                    ) : (
                                        <Link href={section.href}>{section.title}</Link>
                                    )}
                                </div>

                                {/* Dropdown */}
                                {activeDropdown === section.title && section.children && section.children.length > 0 && (
                                    <div className="absolute top-full left-0 w-56 pt-2 transition-all duration-200 transform origin-top-left animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 p-2 overflow-hidden">
                                            {section.children.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="block px-4 py-2.5 text-sm text-foreground/80 dark:text-foreground/80 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    {subItem.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                            <Globe className="h-4 w-4" />
                            <span className="text-xs font-medium">ID</span>
                        </div>

                        {/* Force ThemeToggle to be visible here only on desktop, handled by CSS above */}
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>

                        <button className="p-2 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                            <Search className="h-5 w-5" />
                        </button>

                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md bg-primary text-white hover:bg-primary/90"
                        >
                            <Lock className="h-4 w-4" />
                            LOGIN ADMIN
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6 text-foreground" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 h-[calc(100vh-80px)] overflow-y-auto absolute w-full left-0 top-full">
                    <div className="container mx-auto px-4 py-4 space-y-6">
                        {menus.map((section) => (
                            <div key={section.title} className="space-y-2">
                                <div className="font-bold text-lg text-primary">
                                    {section.children && section.children.length > 0 ? (
                                        section.title
                                    ) : (
                                        <Link href={section.href} onClick={() => setIsOpen(false)}>
                                            {section.title}
                                        </Link>
                                    )}
                                </div>
                                {section.children && section.children.length > 0 && (
                                    <div className="grid gap-2 pl-4 border-l-2 border-gray-100 dark:border-slate-700">
                                        {section.children.map((subItem) => (
                                            <Link
                                                key={subItem.title}
                                                href={subItem.href}
                                                className="block text-sm text-foreground/80 dark:text-foreground/80 py-1 hover:text-primary transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {subItem.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="pt-6 border-t border-gray-100 dark:border-slate-700 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Mode Gelap</span>
                                <ThemeToggle />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Bahasa</span>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                                    <Globe className="h-4 w-4" />
                                    <span className="text-sm">Indonesia</span>
                                </div>
                            </div>
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <Lock className="h-4 w-4" />
                                LOGIN ADMIN
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
