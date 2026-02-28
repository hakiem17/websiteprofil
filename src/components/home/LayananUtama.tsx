"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Globe, FileText, MapPin } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Service = Database["public"]["Tables"]["services"]["Row"];

type ServiceCard = {
    id: string;
    name: string;
    description: string;
    type: "Online" | "Offline";
    link_url?: string | null;
    location?: string | null;
    category?: string; // Optional for now
    categoryColorLight?: string; // Derived
    categoryColorDark?: string; // Derived
    icon?: React.ReactNode; // Derived
    icon_url?: string | null;
};

export function LayananUtama() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollPos, setScrollPos] = useState(0);
    const [services, setServices] = useState<ServiceCard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data, error } = await supabase
                    .from("services")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;

                if (data) {
                    const mappedServices = (data as Service[]).map((item) => ({
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        type: item.type,
                        link_url: item.link_url,
                        location: item.location,
                        icon_url: item.icon_url,
                        // Styling logic based on type
                        category: item.type === "Online" ? "Platform Digital" : "Layanan Fisik",
                        categoryColorLight: item.type === "Online"
                            ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200",
                        categoryColorDark: item.type === "Online"
                            ? "dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30"
                            : "dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
                        icon: item.type === "Online" ? <Globe className="h-10 w-10" /> : <MapPin className="h-10 w-10" />
                    }));
                    setServices(mappedServices);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = 320;
        const newPos = direction === "left" ? scrollPos - amount : scrollPos + amount;
        scrollRef.current.scrollTo({ left: newPos, behavior: "smooth" });
        setScrollPos(newPos);
    };

    return (
        <section className="py-20 bg-linear-to-b from-blue-50 to-sky-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4 shadow-sm dark:shadow-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        Layanan
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">Layanan Utama</h2>
                    <div className="flex items-center justify-center gap-1 mb-4">
                        <div className="w-8 h-0.5 bg-cyan-500 rounded-full" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <div className="w-12 h-0.5 bg-cyan-500 rounded-full" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Pilih layanan yang sesuai dengan kebutuhan Anda untuk solusi terbaik.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Pilih Layanan Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl p-8 h-full flex flex-col justify-between shadow-sm dark:shadow-none">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pilih Layanan</h3>
                                </div>
                                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/80 p-6 mb-6 border border-slate-200 dark:border-slate-700/30">
                                    <div className="flex items-center justify-center">
                                        <div className="relative w-40 h-40">
                                            {/* Illustrative icon composition */}
                                            <div className="absolute inset-0 bg-linear-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-2xl" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="space-y-3">
                                                    <div className="flex gap-2 justify-center">
                                                        <div className="w-8 h-8 rounded-lg bg-cyan-200 dark:bg-cyan-500/30 border border-cyan-300 dark:border-cyan-500/30" />
                                                        <div className="w-8 h-8 rounded-lg bg-blue-200 dark:bg-blue-500/30 border border-blue-300 dark:border-blue-500/30" />
                                                    </div>
                                                    <div className="flex gap-2 justify-center">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-200 dark:bg-emerald-500/30 border border-emerald-300 dark:border-emerald-500/30" />
                                                        <div className="w-8 h-8 rounded-lg bg-amber-200 dark:bg-amber-500/30 border border-amber-300 dark:border-amber-500/30" />
                                                    </div>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-2">Kategori Layanan</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href="/layanan"
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2"
                            >
                                Lihat Semua Layanan <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Right: Scrollable Service Cards */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                <FileText className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Layanan Unggulan</h3>
                            </div>
                            <Link href="/layanan" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium text-sm flex items-center gap-1">
                                Lihat Semua Layanan <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="flex gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="min-w-[270px] h-[300px] bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : services.length === 0 ? (
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 text-center text-slate-500">
                                Belum ada data layanan publik.
                            </div>
                        ) : (
                            <div
                                ref={scrollRef}
                                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                onScroll={(e) => setScrollPos((e.target as HTMLDivElement).scrollLeft)}
                            >
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="min-w-[270px] max-w-[270px] bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 snap-start hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-all group cursor-pointer shadow-sm dark:shadow-none hover:shadow-md h-full flex flex-col"
                                    >
                                        <div className="h-28 bg-slate-50 dark:bg-slate-900/80 rounded-xl flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700/30 group-hover:border-cyan-300 dark:group-hover:border-cyan-500/20 transition-colors shrink-0 overflow-hidden">
                                            {service.icon_url ? (
                                                <img src={service.icon_url} alt={service.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                                                    {service.icon}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{service.name}</h4>
                                        </div>
                                        <span className={`inline-block text-[10px] font-medium px-2.5 py-1 rounded-full w-fit mb-2 ${service.categoryColorLight} ${service.categoryColorDark}`}>
                                            {service.category}
                                        </span>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-grow">
                                            {service.description}
                                        </p>
                                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50 mt-auto">
                                            <Link
                                                href={service.type === "Online" && service.link_url ? service.link_url : "#"}
                                                target={service.type === "Online" ? "_blank" : undefined}
                                                className="text-slate-400 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 text-sm font-medium flex items-center gap-1 transition-colors"
                                            >
                                                {service.type === "Online" ? "Kunjungi" : "Lokasi"} <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Scroll controls */}
                        <div className="flex items-center gap-3 mt-4">
                            <button
                                onClick={() => scroll("left")}
                                className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white hover:border-cyan-500 transition-all flex items-center justify-center"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => scroll("right")}
                                className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white hover:border-cyan-500 transition-all flex items-center justify-center"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
