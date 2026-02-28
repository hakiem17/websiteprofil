"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Newspaper,
    Briefcase,
    Image as ImageIcon,
    LogOut,
    Settings,
    ChevronDown,
    Calendar,
    Megaphone,
    BookOpen,
    Users,
    Globe,
    LucideIcon,
    Edit,
    UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface NavGroup {
    title: string;
    items: NavItem[];
}

const navigationGroups: NavGroup[] = [
    {
        title: "MAIN MENU",
        items: [
            { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        ]
    },
    {
        title: "KONTEN WEBSITE",
        items: [
            { name: "Berita & Artikel", href: "/admin/posts", icon: Newspaper },
            { name: "Agenda Kegiatan", href: "/admin/agenda", icon: Calendar },
            { name: "Pengumuman", href: "/admin/announcements", icon: Megaphone },
            { name: "Editor Halaman Profil", href: "/admin/profile-pages", icon: Edit },
        ]
    },
    {
        title: "LAYANAN & MEDIA",
        items: [
            { name: "Layanan Publik", href: "/admin/services", icon: Briefcase },
            { name: "Galeri Foto", href: "/admin/galleries", icon: ImageIcon },
            { name: "Dokumen Program", href: "/admin/program", icon: FileText },
            { name: "JDIH / Dokumen", href: "/admin/documents", icon: BookOpen },
        ]
    },
    {
        title: "KEPEGAWAIAN",
        items: [
            { name: "Data Pegawai", href: "/admin/pegawai", icon: UserCheck },
        ]
    },
    {
        title: "PENGATURAN",
        items: [
            { name: "Manajemen Menu", href: "/admin/menus", icon: Settings },
            { name: "Identitas Website", href: "/admin/settings", icon: Globe },
            { name: "Pengguna", href: "/admin/users", icon: Users },
        ]
    }
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            await supabase.auth.getUser();
        };

        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            () => {
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] text-slate-300 transition-transform duration-300 ease-in-out border-r border-slate-800/50",
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:static"
        )}>
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="flex items-center gap-3 px-6 h-16 bg-[#0f172a] shadow-sm relative z-10">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                        W
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-white text-sm tracking-wide leading-none">WEB PROFIL</span>
                        <span className="text-[10px] text-blue-400 font-medium tracking-wider mt-0.5">ADMIN SYSTEM</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
                    {navigationGroups.map((group) => (
                        <div key={group.title}>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">
                                {group.title}
                            </h3>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => onClose?.()} // Close sidebar on mobile when link clicked
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative",
                                                isActive
                                                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "h-4 w-4 transition-colors",
                                                isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
                                            )} />
                                            {item.name}
                                            {isActive && (
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l-full bg-white/20"></div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="p-4 bg-[#0f172a]">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="h-4 w-4" />
                        Log Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
