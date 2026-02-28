"use client";

import { Bell, Search, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function AdminHeader({ toggleSidebar }: { toggleSidebar?: () => void }) {
    const { setTheme, theme } = useTheme();

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                    <Menu className="h-5 w-5" />
                </button>

            </div>

            <div className="flex items-center gap-3 md:gap-4">
                {/* Search Bar */}
                <div className="hidden md:flex items-center relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari menu atau data..."
                        className="pl-9 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </button>

                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Administrator</p>
                        <p className="text-xs text-slate-500 mt-1">Super Admin</p>
                    </div>
                    <div className="h-9 w-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
}
