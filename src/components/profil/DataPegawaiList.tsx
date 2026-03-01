"use client";

import { useEffect, useState } from "react";
import { supabaseSppd } from "@/lib/supabase-sppd";
import { Search, Users, UserCircle2, Briefcase, Building2, BarChart3 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PegawaiRow {
    id: string;
    nama_pegawai: string;
    nip: string;
    jabatan_dinas: string;
    bidang: string;
    jenis_pegawai: string;
    pangkat_golongan: string;
    jenis_kelamin: string;
}

const JENIS_CONFIG = [
    { key: "PNS", label: "PNS", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", bar: "bg-blue-500" },
    { key: "PPPK", label: "PPPK", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", bar: "bg-amber-500" },
    { key: "PPPK - Paruh Waktu", label: "PPPK – Paruh Waktu", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", bar: "bg-orange-400" },
    { key: "Outsourcing", label: "Outsourcing", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", bar: "bg-slate-400" },
] as const;

const BIDANG_OPTIONS = [
    { value: "all", label: "Semua Bidang" },
    { value: "Sekretariat", label: "Sekretariat" },
    { value: "Bidang Informasi dan Komunikasi Publik", label: "Bidang IKP" },
    { value: "Bidang Penyelenggaraan E-Government", label: "Bidang E-Gov" },
    { value: "Bidang Statistik dan Persandian", label: "Bidang Statistik & Persandian" },
];

export function DataPegawaiList() {
    const [mounted, setMounted] = useState(false);
    const [pegawai, setPegawai] = useState<PegawaiRow[]>([]);
    const [filtered, setFiltered] = useState<PegawaiRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [bidangFilter, setBidangFilter] = useState("all");
    const [jenisFilter, setJenisFilter] = useState("all");

    useEffect(() => {
        setMounted(true);
        async function fetchPegawai() {
            setLoading(true);
            try {
                const { data, error } = await supabaseSppd
                    .from("pegawai")
                    .select("id, nama_pegawai, nip, jabatan_dinas, bidang, jenis_pegawai, pangkat_golongan, jenis_kelamin")
                    .order("nama_pegawai", { ascending: true });
                if (error) throw error;
                setPegawai((data as PegawaiRow[]) || []);
            } catch (err) {
                console.error("Error fetching pegawai:", err);
                setPegawai([]);
            } finally {
                setLoading(false);
            }
        }
        fetchPegawai();
    }, []);

    useEffect(() => {
        let data = [...pegawai];
        if (search) {
            const q = search.toLowerCase();
            data = data.filter(
                (p) =>
                    p.nama_pegawai?.toLowerCase().includes(q) ||
                    p.nip?.toLowerCase().includes(q) ||
                    p.jabatan_dinas?.toLowerCase().includes(q)
            );
        }
        if (bidangFilter !== "all") data = data.filter((p) => p.bidang === bidangFilter);
        if (jenisFilter !== "all") data = data.filter((p) => p.jenis_pegawai === jenisFilter);
        setFiltered(data);
    }, [pegawai, search, bidangFilter, jenisFilter]);

    // ── Computed summaries ──────────────────────────────────────────────────────
    const total = pegawai.length;

    const byJenis = JENIS_CONFIG.map((cfg) => ({
        ...cfg,
        count: pegawai.filter((p) => p.jenis_pegawai === cfg.key).length,
    }));

    const bidangKeys = Array.from(new Set(pegawai.map((p) => p.bidang || "Tidak Diketahui"))).sort();
    const byBidang = bidangKeys.map((bid) => {
        const group = pegawai.filter((p) => (p.bidang || "Tidak Diketahui") === bid);
        const detail = JENIS_CONFIG.map((cfg) => ({
            ...cfg,
            count: group.filter((p) => p.jenis_pegawai === cfg.key).length,
        })).filter((d) => d.count > 0);
        return { bidang: bid, total: group.length, detail };
    });


    if (!mounted) return null;

    return (
        <div className="space-y-8">


            {/* ── Stats Cards ─────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Pegawai", value: total, icon: Users, color: "bg-primary/10 text-primary" },
                    { label: "PNS", value: byJenis[0].count, icon: UserCircle2, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
                    { label: "PPPK", value: byJenis[1].count + byJenis[2].count, icon: Briefcase, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" },
                    { label: "Outsourcing", value: byJenis[3].count, icon: Building2, color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {loading ? "—" : stat.value}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Resume Section ───────────────────────────────────────────────── */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 space-y-4 animate-pulse">
                        {[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded" />)}
                    </div>
                    <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 space-y-4 animate-pulse">
                        {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded" />)}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* -- Per Jenis (2 cols) */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <BarChart3 className="h-4 w-4 text-primary" />
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Berdasarkan Jenis</h3>
                        </div>
                        <div className="space-y-4">
                            {byJenis.map((j) => (
                                <div key={j.key}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{j.label}</span>
                                        <span className="text-sm font-bold text-slate-900 dark:text-white">{j.count}</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${j.bar}`}
                                            style={{ width: total > 0 ? `${(j.count / total) * 100}%` : "0%" }}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-400 mt-0.5 text-right">
                                        {total > 0 ? `${((j.count / total) * 100).toFixed(1)}%` : "0%"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* -- Per Bidang (3 cols) */}
                    <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Building2 className="h-4 w-4 text-primary" />
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Berdasarkan Bidang</h3>
                        </div>
                        <div className="space-y-4">
                            {byBidang.map((b) => (
                                <div key={b.bidang} className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                    <div className="min-w-0 flex-1">
                                        <div className="font-semibold text-slate-800 dark:text-white text-sm">{b.bidang}</div>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {b.detail.map((d) => (
                                                <span key={d.key} className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${d.color}`}>
                                                    {d.label}: {d.count}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="shrink-0 text-right">
                                        <span className="text-xl font-bold text-slate-900 dark:text-white">{b.total}</span>
                                        <div className="text-xs text-slate-400 mt-0.5">pegawai</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── Search & Filter ──────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, NIP, atau jabatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                    </div>
                    <div className="flex gap-3">
                        <Select value={jenisFilter} onValueChange={setJenisFilter}>
                            <SelectTrigger className="w-[190px] bg-white dark:bg-slate-800">
                                <SelectValue placeholder="Jenis Pegawai" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Jenis</SelectItem>
                                {JENIS_CONFIG.map((j) => (
                                    <SelectItem key={j.key} value={j.key}>{j.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={bidangFilter} onValueChange={setBidangFilter}>
                            <SelectTrigger className="w-[200px] bg-white dark:bg-slate-800">
                                <SelectValue placeholder="Bidang" />
                            </SelectTrigger>
                            <SelectContent>
                                {BIDANG_OPTIONS.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {!loading && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                        Menampilkan <strong>{filtered.length}</strong> dari {pegawai.length} pegawai
                    </p>
                )}
            </div>

            {/* ── Data Table ───────────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3 font-semibold">#</th>
                                <th className="px-6 py-3 font-semibold">Nama / NIP</th>
                                <th className="px-6 py-3 font-semibold">Jabatan</th>
                                <th className="px-6 py-3 font-semibold">Bidang</th>
                                <th className="px-6 py-3 font-semibold">Pangkat / Gol</th>
                                <th className="px-6 py-3 font-semibold">Jenis</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                [...Array(8)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" /></td>
                                        {[...Array(5)].map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" style={{ width: `${60 + j * 8}%` }} />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <Users className="h-7 w-7 text-slate-400" />
                                            </div>
                                            <p className="font-medium text-slate-700 dark:text-slate-300">Tidak ada data ditemukan</p>
                                            <p className="text-xs text-slate-400">Coba sesuaikan kata kunci atau filter</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p, idx) => {
                                    const jenisStyle = JENIS_CONFIG.find((j) => j.key === p.jenis_pegawai);
                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-400 text-xs font-mono">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                        {p.nama_pegawai?.charAt(0) ?? "?"}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-white">{p.nama_pegawai}</div>
                                                        <div className="text-xs text-slate-400">{p.nip ? `NIP. ${p.nip}` : "—"}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{p.jabatan_dinas || "—"}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{p.bidang || "—"}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">{p.pangkat_golongan || "—"}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${jenisStyle?.color ?? "bg-slate-100 text-slate-600"}`}>
                                                    {jenisStyle?.label ?? p.jenis_pegawai ?? "—"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
