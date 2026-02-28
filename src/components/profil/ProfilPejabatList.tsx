"use client";

import { useEffect, useState } from "react";
import { supabaseSppd } from "@/lib/supabase-sppd";
import { Pegawai } from "@/types/pegawai";
import { User, Search, UserCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProfilPejabatList() {
    const [pejabat, setPejabat] = useState<Pegawai[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [bidangFilter, setBidangFilter] = useState("all");

    useEffect(() => {
        async function fetchPejabat() {
            setLoading(true);
            try {
                // Fetch ALL employees with a position
                // We do filtering client-side to be safe against schema mismatches or migration issues
                let query = supabaseSppd
                    .from("pegawai")
                    .select("*")
                    .not("jabatan_dinas", "is", null)
                    .order("nama_pegawai", { ascending: true });

                if (searchQuery) {
                    query = query.ilike("nama_pegawai", `%${searchQuery}%`);
                }

                if (bidangFilter !== "all") {
                    query = query.eq("bidang", bidangFilter);
                }

                const { data, error } = await query;

                if (error) throw error;

                // Client-side Filter & Sort
                const filteredData = (data || []).filter((p) => {
                    // 1. If 'is_pejabat' column exists and is true, show them
                    // using (p as any) to avoid TS error if types aren't perfectly synced yet
                    if ((p as any).is_pejabat === true) return true;

                    // 2. Fallback: Check structural/leadership keywords in the title
                    const j = p.jabatan_dinas?.toLowerCase() || "";
                    const keywords = [
                        "kepala",
                        "sekretaris",
                        "kabid",
                        "camat",
                        "lurah",
                        "asisten",
                        "staf ahli",
                        "direktur"
                    ];
                    return keywords.some(k => j.includes(k));
                });

                const sortedData = filteredData.sort((a, b) => {
                    const getRank = (jabatan: string) => {
                        const j = jabatan?.toLowerCase() || "";
                        if (j.includes("kepala dinas")) return 1;
                        if (j.includes("sekretaris dinas")) return 2;
                        if (j.includes("kepala bidang")) return 3;
                        if (j.includes("kepala sub bagian") || j.includes("kasubag") || j.includes("kepala seksi") || j.includes("kasi")) return 4;
                        return 5;
                    };

                    const rankA = getRank(a.jabatan_dinas);
                    const rankB = getRank(b.jabatan_dinas);

                    if (rankA !== rankB) return rankA - rankB;
                    return a.nama_pegawai.localeCompare(b.nama_pegawai);
                });

                setPejabat(sortedData);
            } catch (err) {
                console.error("Error fetching pejabat:", err);
                setPejabat([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPejabat();
    }, [searchQuery, bidangFilter]);

    return (
        <div className="space-y-8">
            {/* Search and Filter */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama pejabat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <Select value={bidangFilter} onValueChange={setBidangFilter}>
                            <SelectTrigger className="w-full bg-white dark:bg-slate-800 h-10">
                                <SelectValue placeholder="Semua Bidang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Bidang</SelectItem>
                                <SelectItem value="Sekretariat">Sekretariat</SelectItem>
                                <SelectItem value="Bidang Informasi dan Komunikasi Publik">Bidang IKP</SelectItem>
                                <SelectItem value="Bidang Penyelenggaraan E-Government">Bidang E-Gov</SelectItem>
                                <SelectItem value="Bidang Statistik dan Persandian">Bidang Statistik & Persandian</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-[280px] animate-pulse">
                            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
                        </div>
                    ))}
                </div>
            ) : pejabat.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserCircle2 className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Tidak ada data ditemukan</h3>
                    <p className="text-slate-500 dark:text-slate-400">Coba sesuaikan pencarian atau filter Anda</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pejabat.map((p) => (
                        <div
                            key={p.id}
                            className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <User className="h-24 w-24 text-blue-600 dark:text-blue-400" />
                            </div>

                            <div className="relative mb-4 z-10">
                                <div className="w-28 h-28 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-3xl font-bold border-4 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                    {p.nama_pegawai.charAt(0)}
                                </div>
                                <div className="absolute bottom-0 right-2 bg-blue-600 text-white p-2 rounded-full border-4 border-white dark:border-slate-800 shadow-sm">
                                    <User className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="z-10 w-full">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">
                                    {p.nama_pegawai}
                                </h3>

                                <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium mb-4">
                                    {p.jabatan_dinas || "Jabatan tidak tersedia"}
                                </span>

                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">NIP</span>
                                        <span className="font-medium">{p.nip || "-"}</span>
                                    </div>
                                    {p.pangkat_golongan && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Golongan</span>
                                            <span className="font-medium">{p.pangkat_golongan}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
