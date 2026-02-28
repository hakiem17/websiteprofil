"use client";

import { useState, useEffect } from "react";
import { Mail, Map, Phone, MapPin, Globe, ExternalLink, Eye, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { supabase } from "@/lib/supabase";
import Image from "next/image";

export function Footer() {
    const pathname = usePathname();
    const [stats, setStats] = useState({ today: 0, total: 0 });
    const [siteSettings, setSiteSettings] = useState<{ site_name: string; logo_url: string | null; description: string | null }>({
        site_name: "Pemerintah Daerah",
        logo_url: null,
        description: "Portal Resmi Pelayanan Publik"
    });
    const isAdmin = pathname?.startsWith("/admin");

    useEffect(() => {
        if (isAdmin) return;

        // Fetch Visitor Stats
        fetch("/api/visitor-stats")
            .then(r => r.json())
            .then(d => setStats({ today: d.today || 0, total: d.total || 0 }))
            .catch(() => { });

        // Fetch Site Settings
        const fetchSettings = async () => {
            const { data } = await supabase
                .from("site_settings")
                .select("site_name, logo_url, description")
                .single();

            if (data) {
                setSiteSettings({
                    site_name: data.site_name || "Pemerintah Daerah",
                    logo_url: data.logo_url,
                    description: data.description || "Portal Resmi Pelayanan Publik"
                });
            }
        };

        fetchSettings();
    }, [isAdmin]);

    // Hide Footer on Admin routes
    if (isAdmin) {
        return null;
    }

    return (
        <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800">
            {/* Top Banner */}
            <div className="container mx-auto px-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 md:p-10 -mt-14 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-4">
                        {siteSettings.logo_url ? (
                            <div className="relative w-16 h-16 shrink-0">
                                <Image
                                    src={siteSettings.logo_url}
                                    alt="Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shrink-0">
                                {siteSettings.site_name.substring(0, 1)}
                            </div>
                        )}
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-1">
                                {siteSettings.site_name}
                            </h3>
                            <p className="text-cyan-600 dark:text-cyan-400 font-medium">{siteSettings.description}</p>
                            <div className="w-12 h-0.5 bg-cyan-500 rounded-full mt-3" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 rounded-xl transition-all"
                        >
                            <Mail className="h-4 w-4" /> Hubungi Kami
                        </Link>
                        <Link
                            href="#"
                            className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold px-6 py-3 rounded-xl transition-all border border-slate-300 dark:border-slate-600"
                        >
                            <Map className="h-4 w-4" /> Peta Situs
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Column 1: Profil */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center text-white">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{siteSettings.site_name}</h4>
                                <p className="text-xs text-slate-400 dark:text-slate-500">{siteSettings.description}</p>
                            </div>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 mb-6">
                            Mewujudkan pelayanan publik yang transparan, akuntabel, dan inovatif menuju masyarakat sejahtera.
                        </p>
                        <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
                                <span>Jl. Perintis Kemerdekaan, Batali Raya, Benawa Tengah, Barabai - Kalimantan Selatan, Indonesia</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-cyan-500 shrink-0" />
                                <span>(0517)-12345678</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-cyan-500 shrink-0" />
                                <span>diskominfo@hstkab.go.id</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Informasi */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                <ExternalLink className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Informasi</h4>
                        </div>
                        <ul className="space-y-3 text-sm">
                            {[
                                { label: "Berita Terbaru", href: "/informasi/berita" },
                                { label: "Visi & Misi", href: "/profil/visi-misi" },
                                { label: "Struktur Organisasi", href: "/profil/struktur" },
                                { label: "Layanan Publik", href: "/layanan" },
                                { label: "Dokumen Publik", href: "/dokumen" },
                                { label: "Agenda Kegiatan", href: "/informasi/agenda-pimpinan" },
                            ].map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-cyan-400 dark:bg-cyan-500/50" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Media Sosial */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                <Globe className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">Media Sosial</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: "Facebook", href: "#", lightColor: "bg-blue-50 border-blue-200 text-blue-600", darkColor: "dark:bg-blue-600/10 dark:border-blue-600/20 dark:text-blue-400" },
                                { name: "Twitter", href: "#", lightColor: "bg-sky-50 border-sky-200 text-sky-600", darkColor: "dark:bg-sky-500/10 dark:border-sky-500/20 dark:text-sky-400" },
                                { name: "Instagram", href: "https://www.instagram.com/kominfo_hst/", lightColor: "bg-pink-50 border-pink-200 text-pink-600", darkColor: "dark:bg-pink-500/10 dark:border-pink-500/20 dark:text-pink-400" },
                                { name: "YouTube", href: "https://www.youtube.com/@mediacenterhst", lightColor: "bg-red-50 border-red-200 text-red-600", darkColor: "dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400" },
                            ].map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium hover:opacity-80 transition-opacity ${social.lightColor} ${social.darkColor}`}
                                >
                                    <Globe className="h-4 w-4" />
                                    {social.name}
                                </a>
                            ))}
                        </div>

                        {/* Embed Map */}
                        <div className="mt-6">
                            <iframe
                                title="Peta Lokasi"
                                className="w-full h-32 rounded-xl border border-slate-200 dark:border-slate-700/50 grayscale hover:grayscale-0 transition-all duration-500"
                                src="https://maps.google.com/maps?q=Barabai,%20Hulu%20Sungai%20Tengah&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar with Visitor Stats */}
            <div className="border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        &copy; {new Date().getFullYear()} Pemerintah Daerah. Hak Cipta Dilindungi Undang-undang.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Eye className="h-3.5 w-3.5 text-cyan-500" />
                            Hari ini: <strong className="text-slate-600 dark:text-slate-300">{stats.today.toLocaleString("id-ID")}</strong>
                        </span>
                        <span className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                        <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-cyan-500" />
                            Total: <strong className="text-slate-600 dark:text-slate-300">{stats.total.toLocaleString("id-ID")}</strong>
                        </span>
                        <span className="w-px h-3 bg-slate-300 dark:bg-slate-700" />
                        <Link href="/login" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Admin Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
