"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { PageHero } from "@/components/layout/PageHero";
import { CalendarDays, MapPin, Clock, User, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type AgendaItem = {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    organizer: string | null;
    start_date: string;
    end_date: string | null;
    is_published: boolean;
};

const ITEMS_PER_PAGE = 6;

export default function AgendaPimpinanPage() {
    const [allAgenda, setAllAgenda] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"semua" | "mendatang" | "selesai">("semua");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchAgenda = async () => {
            const { data, error } = await supabase
                .from("agenda")
                .select("*")
                .eq("is_published", true)
                .order("start_date", { ascending: false });

            if (!error && data) {
                setAllAgenda(data as AgendaItem[]);
            }
            setLoading(false);
        };
        fetchAgenda();
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const filtered = useMemo(() => {
        let items = allAgenda;

        // Filter by status
        if (filterStatus === "mendatang") {
            items = items.filter((a) => a.start_date.split("T")[0] >= today);
        } else if (filterStatus === "selesai") {
            items = items.filter((a) => a.start_date.split("T")[0] < today);
        }

        // Search
        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.location?.toLowerCase().includes(q) ||
                    a.organizer?.toLowerCase().includes(q)
            );
        }

        return items;
    }, [allAgenda, filterStatus, search, today]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Reset page when filter/search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, search]);

    // Group paginated items by date
    const grouped = paginated.reduce<Record<string, AgendaItem[]>>((acc, item) => {
        const dateKey = format(new Date(item.start_date), "yyyy-MM-dd");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(item);
        return acc;
    }, {});

    const formatTime = (dateStr: string) => {
        try { return format(new Date(dateStr), "HH:mm"); } catch { return ""; }
    };

    const formatFullDate = (dateStr: string) => {
        try { return format(new Date(dateStr), "EEEE, dd MMMM yyyy", { locale: idLocale }); } catch { return dateStr; }
    };

    const isPast = (dateStr: string) => dateStr.split("T")[0] < today;

    const filters: { label: string; value: typeof filterStatus }[] = [
        { label: "Semua", value: "semua" },
        { label: "Mendatang", value: "mendatang" },
        { label: "Selesai", value: "selesai" },
    ];

    return (
        <>
            <PageHero
                title="Agenda Pimpinan"
                subtitle="Jadwal kegiatan dan agenda pimpinan dinas"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Agenda Pimpinan" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <div className="flex gap-2">
                            {filters.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilterStatus(f.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === f.value
                                            ? "bg-cyan-600 text-white shadow-md"
                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari agenda..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Results Count */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Menampilkan {filtered.length} agenda
                        {filterStatus !== "semua" && ` (${filters.find(f => f.value === filterStatus)?.label})`}
                    </p>

                    {/* Content */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 animate-pulse">
                                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <CalendarDays className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                {search ? "Tidak ditemukan" : "Belum ada agenda"}
                            </h3>
                            <p className="text-sm text-slate-400 dark:text-slate-500">
                                {search
                                    ? `Tidak ada agenda yang cocok dengan "${search}".`
                                    : "Jadwal kegiatan akan ditampilkan di sini ketika tersedia."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {Object.entries(grouped).map(([dateKey, items]) => (
                                <div key={dateKey}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <CalendarDays className="h-5 w-5 text-cyan-500" />
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                            {formatFullDate(items[0].start_date)}
                                        </h2>
                                        {isPast(items[0].start_date) && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                                                Selesai
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-3 ml-2 border-l-2 border-cyan-200 dark:border-cyan-800 pl-6">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow ${isPast(item.start_date)
                                                        ? "border-slate-200 dark:border-slate-800 opacity-75"
                                                        : "border-cyan-100 dark:border-cyan-900"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2">
                                                        {item.title}
                                                    </h3>
                                                    {!isPast(item.start_date) && (
                                                        <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold">
                                                            Mendatang
                                                        </span>
                                                    )}
                                                </div>
                                                {item.description && (
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{item.description}</p>
                                                )}
                                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="h-4 w-4" />
                                                        {formatTime(item.start_date)}
                                                        {item.end_date && ` – ${formatTime(item.end_date)}`}
                                                    </span>
                                                    {item.location && (
                                                        <span className="flex items-center gap-1.5">
                                                            <MapPin className="h-4 w-4" />
                                                            {item.location}
                                                        </span>
                                                    )}
                                                    {item.organizer && (
                                                        <span className="flex items-center gap-1.5">
                                                            <User className="h-4 w-4" />
                                                            {item.organizer}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-10">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`min-w-[40px] h-10 rounded-lg text-sm font-semibold transition-all ${currentPage === page
                                            ? "bg-cyan-600 text-white shadow-md"
                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-700"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
