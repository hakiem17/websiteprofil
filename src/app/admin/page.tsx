"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Briefcase,
    CheckCircle2,
    Clock,
    Newspaper,
    BookOpen,
    TrendingUp,
    Users,
    Eye,
    Calendar,
    MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type VisitorStats = {
    today: number;
    total: number;
    daily: { date: string; count: number }[];
};

type AgendaItem = {
    id: string;
    title: string;
    location: string | null;
    start_date: string;
};

export default function AdminDashboard() {
    const [postCount, setPostCount] = useState(0);
    const [serviceCount, setServiceCount] = useState(0);
    const [docCount, setDocCount] = useState(0);
    const [draftCount, setDraftCount] = useState(0);
    const [visitorStats, setVisitorStats] = useState<VisitorStats>({ today: 0, total: 0, daily: [] });
    const [agenda, setAgenda] = useState<AgendaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);

            // Fetch counts in parallel
            const [postsRes, draftsRes, servicesRes, docsRes, visitorRes, agendaRes] = await Promise.all([
                supabase.from("posts").select("id", { count: "exact", head: true }),
                supabase.from("posts").select("id", { count: "exact", head: true }).eq("is_published", false),
                supabase.from("services").select("id", { count: "exact", head: true }),
                supabase.from("documents").select("id", { count: "exact", head: true }),
                fetch("/api/visitor-stats").then(r => r.json()).catch(() => ({ today: 0, total: 0, daily: [] })),
                supabase.from("agenda").select("id, title, location, start_date")
                    .eq("is_published", true)
                    .gte("start_date", new Date().toISOString().split("T")[0])
                    .order("start_date", { ascending: true })
                    .limit(5),
            ]);

            setPostCount(postsRes.count || 0);
            setDraftCount(draftsRes.count || 0);
            setServiceCount(servicesRes.count || 0);
            setDocCount(docsRes.count || 0);
            setVisitorStats(visitorRes);
            setAgenda((agendaRes.data as AgendaItem[]) || []);
            setLoading(false);
        };

        fetchAll();
    }, []);

    const maxDaily = Math.max(...visitorStats.daily.map(d => d.count), 1);

    const formatShortDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "EEE", { locale: idLocale });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Ikhtisar data dari seluruh modul konten website profil.
                </p>
            </div>

            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Berita */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <Newspaper className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Konten</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground font-medium">Total Berita</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {loading ? "..." : postCount.toLocaleString("id-ID")}
                        </h3>
                    </div>
                    <div className="mt-3 text-xs font-medium text-blue-600 dark:text-blue-400">
                        {loading ? "—" : `${draftCount} draft menunggu rilis`}
                    </div>
                </div>

                {/* Card 2: Layanan */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Layanan</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground font-medium">Layanan Publik</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {loading ? "..." : serviceCount.toLocaleString("id-ID")}
                        </h3>
                    </div>
                    <div className="mt-3 text-xs font-medium text-purple-600 dark:text-purple-400">
                        Online & Offline
                    </div>
                </div>

                {/* Card 3: Dokumen */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 rounded-lg">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">Arsip</span>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground font-medium">Dokumen JDIH</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {loading ? "..." : docCount.toLocaleString("id-ID")}
                        </h3>
                    </div>
                    <div className="mt-3 text-xs font-medium text-pink-600 dark:text-pink-400">
                        Total arsip digital
                    </div>
                </div>

                {/* Card 4: Visitor Today */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                        <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 rounded-lg">
                            <Eye className="h-6 w-6" />
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">
                            <CheckCircle2 className="h-3 w-3" /> Live
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-muted-foreground font-medium">Pengunjung Hari Ini</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {loading ? "..." : visitorStats.today.toLocaleString("id-ID")}
                        </h3>
                    </div>
                    <div className="mt-3 text-xs font-medium text-cyan-600 dark:text-cyan-400">
                        {loading ? "—" : `Total: ${visitorStats.total.toLocaleString("id-ID")} pengunjung`}
                    </div>
                </div>
            </div>

            {/* Split View Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Visitor Chart - Bar chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-cyan-500" />
                            <h3 className="font-bold text-slate-800 dark:text-white">Statistik Pengunjung 7 Hari Terakhir</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>Total: <strong className="text-slate-700 dark:text-white">{visitorStats.daily.reduce((s, d) => s + d.count, 0).toLocaleString("id-ID")}</strong></span>
                        </div>
                    </div>

                    {/* Bar chart */}
                    <div className="h-52 flex items-end gap-3">
                        {visitorStats.daily.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {day.count > 0 ? day.count : ""}
                                </span>
                                <div className="w-full relative">
                                    <div
                                        className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg transition-all duration-500 min-h-[4px]"
                                        style={{ height: `${Math.max((day.count / maxDaily) * 160, 4)}px` }}
                                    />
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium uppercase">
                                    {formatShortDate(day.date)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Agenda List */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="h-5 w-5 text-orange-500" />
                        <h3 className="font-bold text-slate-800 dark:text-white">Agenda Terdekat</h3>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse h-14 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                            ))}
                        </div>
                    ) : agenda.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                            <p className="text-sm text-muted-foreground">Belum ada agenda mendatang</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {agenda.map((item, idx) => (
                                <div key={item.id} className={`relative pl-6 pb-4 border-l-2 ${idx === agenda.length - 1 ? "border-transparent" : "border-slate-100 dark:border-slate-800"
                                    }`}>
                                    <div className={`absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${idx === 0 ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
                                        }`} />
                                    <div className={idx === 0
                                        ? "bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg -mt-1"
                                        : ""
                                    }>
                                        <p className={`text-sm font-bold ${idx === 0
                                            ? "text-blue-700 dark:text-blue-300"
                                            : "text-slate-700 dark:text-slate-300"
                                            }`}>
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(item.start_date), "dd MMM yyyy • HH:mm", { locale: idLocale })}
                                        </p>
                                        {item.location && (
                                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                <MapPin className="h-3 w-3" /> {item.location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Visitor Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
                    <Users className="h-5 w-5 mb-2 opacity-80" />
                    <p className="text-sm font-medium opacity-90">Total Pengunjung</p>
                    <h3 className="text-3xl font-bold mt-1">{loading ? "..." : visitorStats.total.toLocaleString("id-ID")}</h3>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-xl shadow-lg text-white">
                    <Eye className="h-5 w-5 mb-2 opacity-80" />
                    <p className="text-sm font-medium opacity-90">Hari Ini</p>
                    <h3 className="text-3xl font-bold mt-1">{loading ? "..." : visitorStats.today.toLocaleString("id-ID")}</h3>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
                    <TrendingUp className="h-5 w-5 mb-2 opacity-80" />
                    <p className="text-sm font-medium opacity-90">Minggu Ini</p>
                    <h3 className="text-3xl font-bold mt-1">{loading ? "..." : visitorStats.daily.reduce((s, d) => s + d.count, 0).toLocaleString("id-ID")}</h3>
                </div>
            </div>
        </div>
    );
}
