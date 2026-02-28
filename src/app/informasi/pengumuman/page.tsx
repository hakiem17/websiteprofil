"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { PageHero } from "@/components/layout/PageHero";
import { Megaphone, Search, ChevronLeft, ChevronRight, Clock, FileText, AlertTriangle, AlertCircle, Info, Download } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Announcement = {
    id: string;
    title: string;
    content: string | null;
    priority: "Biasa" | "Penting" | "Urgent";
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    attachment_url: string | null;
    created_at: string;
};

const ITEMS_PER_PAGE = 6;

const PRIORITY_CONFIG = {
    Biasa: {
        bg: "bg-blue-100 dark:bg-blue-500/10",
        text: "text-blue-700 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
        icon: Info,
    },
    Penting: {
        bg: "bg-amber-100 dark:bg-amber-500/10",
        text: "text-amber-700 dark:text-amber-400",
        border: "border-amber-200 dark:border-amber-800",
        icon: AlertCircle,
    },
    Urgent: {
        bg: "bg-red-100 dark:bg-red-500/10",
        text: "text-red-700 dark:text-red-400",
        border: "border-red-200 dark:border-red-800",
        icon: AlertTriangle,
    },
};

export default function PengumumanPage() {
    const [allItems, setAllItems] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterPriority, setFilterPriority] = useState<"semua" | "Biasa" | "Penting" | "Urgent">("semua");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchItems = async () => {
            const { data, error } = await supabase
                .from("announcements")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (!error && data) {
                setAllItems(data as Announcement[]);
            }
            setLoading(false);
        };
        fetchItems();
    }, []);

    const filtered = useMemo(() => {
        let items = allItems;

        if (filterPriority !== "semua") {
            items = items.filter((a) => a.priority === filterPriority);
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            items = items.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.content?.toLowerCase().includes(q)
            );
        }

        return items;
    }, [allItems, filterPriority, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterPriority, search]);

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMMM yyyy", { locale: idLocale });
        } catch {
            return dateStr;
        }
    };

    const filters: { label: string; value: typeof filterPriority }[] = [
        { label: "Semua", value: "semua" },
        { label: "Biasa", value: "Biasa" },
        { label: "Penting", value: "Penting" },
        { label: "Urgent", value: "Urgent" },
    ];

    return (
        <>
            <PageHero
                title="Pengumuman"
                subtitle="Informasi pengumuman resmi dari Dinas Komunikasi dan Informatika"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Pengumuman" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">

                    {/* Filter & Search */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <div className="flex gap-2 flex-wrap">
                            {filters.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilterPriority(f.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterPriority === f.value
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
                                placeholder="Cari pengumuman..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Count */}
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Menampilkan {filtered.length} pengumuman
                        {filterPriority !== "semua" && ` (${filterPriority})`}
                    </p>

                    {/* Content */}
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-6 animate-pulse">
                                    <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-2" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <Megaphone className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                                {search ? "Tidak ditemukan" : "Belum ada pengumuman"}
                            </h3>
                            <p className="text-sm text-slate-400 dark:text-slate-500">
                                {search
                                    ? `Tidak ada pengumuman yang cocok dengan "${search}".`
                                    : "Pengumuman akan ditampilkan di sini ketika tersedia."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paginated.map((item) => {
                                const config = PRIORITY_CONFIG[item.priority];
                                const PIcon = config.icon;
                                return (
                                    <div
                                        key={item.id}
                                        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-6 hover:shadow-md transition-all ${item.priority === "Urgent"
                                                ? "border-red-200 dark:border-red-900 ring-1 ring-red-100 dark:ring-red-900/30"
                                                : item.priority === "Penting"
                                                    ? "border-amber-200 dark:border-amber-900"
                                                    : "border-slate-100 dark:border-slate-800"
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Priority Icon */}
                                            <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${config.bg}`}>
                                                <PIcon className={`h-5 w-5 ${config.text}`} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Header */}
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                                                        {item.title}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${config.bg} ${config.text}`}>
                                                        {item.priority}
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                {item.content && (
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 whitespace-pre-line">
                                                        {item.content}
                                                    </p>
                                                )}

                                                {/* Meta & Attachment */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                                    <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                                        <Clock className="h-4 w-4" />
                                                        {formatDate(item.created_at)}
                                                    </span>
                                                    {item.end_date && (
                                                        <span className="text-slate-400 dark:text-slate-500">
                                                            Berakhir: {formatDate(item.end_date)}
                                                        </span>
                                                    )}
                                                    {item.attachment_url && (
                                                        <a
                                                            href={item.attachment_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-sm font-medium hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Unduh PDF
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
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
