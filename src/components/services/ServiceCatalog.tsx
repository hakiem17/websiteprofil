"use client";

import { useState, useEffect } from "react";
import { Link2, MapPin, Globe, Loader2, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Service = Database["public"]["Tables"]["services"]["Row"];

export function ServiceCatalog({ initialType }: { initialType?: "Online" | "Offline" }) {
    const [filterType, setFilterType] = useState<"All" | "Online" | "Offline">(initialType || "All");
    const [searchQuery, setSearchQuery] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("services")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (data) setServices(data as Service[]);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services.filter((service) => {
        const matchesType = filterType === "All" ? true : service.type === filterType;
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl ring-1 ring-slate-200 dark:ring-slate-800">
                    {["All", "Online", "Offline"].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as "All" | "Online" | "Offline")}
                            className={`px-4 md:px-6 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type
                                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                        >
                            {type === "All" ? "Semua" : type}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari layanan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
                </div>
            ) : filteredServices.length === 0 ? (
                <div className="min-h-[300px] flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                    <p className="text-lg font-medium">Layanan tidak ditemukan</p>
                    <p className="text-sm">Coba ubah filter atau kata kunci pencarian</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col"
                        >
                            <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${service.type === "Online"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                }`}>
                                {service.type}
                            </div>

                            <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center text-primary dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform ring-1 ring-slate-100 dark:ring-slate-700/50 overflow-hidden">
                                {service.icon_url ? (
                                    <img src={service.icon_url} alt={service.name} className="w-full h-full object-cover" />
                                ) : service.type === "Online" ? (
                                    <Globe className="h-7 w-7" />
                                ) : (
                                    <MapPin className="h-7 w-7" />
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">{service.name}</h3>
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-3 ml-0 flex-grow">
                                {service.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                {service.type === "Online" ? (
                                    <a
                                        href={service.link_url || '#'}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-sm font-bold text-primary hover:underline hover:underline-offset-4"
                                    >
                                        <Link2 className="h-4 w-4" />
                                        Akses Layanan
                                    </a>
                                ) : (
                                    <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                                        <span>{service.location || 'Lokasi tidak tersedia'}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
