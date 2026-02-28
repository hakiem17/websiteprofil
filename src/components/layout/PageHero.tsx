"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface PageHeroProps {
    title: string;
    subtitle?: string;
    breadcrumbs: BreadcrumbItem[];
}

export function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
    return (
        <section className="relative -mt-32 pt-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-linear-to-br from-slate-800 via-slate-900 to-cyan-950">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent" />
            </div>

            {/* Content */}
            <div className="relative container mx-auto px-4 py-16 md:py-24">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg text-slate-300 max-w-2xl">{subtitle}</p>
                )}

                {/* Breadcrumbs */}
                <nav className="mt-6 flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                    >
                        <Home className="w-3.5 h-3.5" />
                        <span>Beranda</span>
                    </Link>
                    {breadcrumbs.map((item, index) => (
                        <span key={index} className="flex items-center gap-1.5">
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                            {item.href && !item.active ? (
                                <Link href={item.href} className="text-slate-400 hover:text-white transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={item.active ? "text-cyan-400 font-medium" : "text-slate-400"}>
                                    {item.label}
                                </span>
                            )}
                        </span>
                    ))}
                </nav>
            </div>
        </section>
    );
}
