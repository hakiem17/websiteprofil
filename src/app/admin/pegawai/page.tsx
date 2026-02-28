"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabaseSppd } from "@/lib/supabase-sppd";
import { Pegawai } from "@/types/pegawai";
import { Plus, Search, Edit, Trash2, UserCheck, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "sonner";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PegawaiPage() {
    const [pegawai, setPegawai] = useState<Pegawai[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter State
    const [jenisPegawaiFilter, setJenisPegawaiFilter] = useState("all");
    const [bidangFilter, setBidangFilter] = useState("all");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);

    const fetchPegawai = async () => {
        setLoading(true);
        try {
            // Base query builder to reuse logic
            const buildQuery = (query: any) => {
                if (searchQuery) {
                    query = query.or(`nama_pegawai.ilike.%${searchQuery}%,nip.ilike.%${searchQuery}%`);
                }
                if (jenisPegawaiFilter !== "all") {
                    query = query.eq("jenis_pegawai", jenisPegawaiFilter);
                }
                if (bidangFilter !== "all") {
                    query = query.eq("bidang", bidangFilter);
                }
                return query;
            };

            // First get total count
            let countQuery = supabaseSppd
                .from("pegawai")
                .select("*", { count: "exact", head: true });

            countQuery = buildQuery(countQuery);

            const { count, error: countError } = await countQuery;
            if (countError) throw countError;
            setTotalItems(count || 0);

            // Then get data
            let query = supabaseSppd
                .from("pegawai")
                .select("*")
                .order("nama_pegawai", { ascending: true }); // Changed to alphabetical order for better list view

            query = buildQuery(query);

            // Apply pagination
            const from = (currentPage - 1) * pageSize;
            const to = from + pageSize - 1;
            query = query.range(from, to);

            const { data, error } = await query;

            if (error) throw error;
            setPegawai(data || []);
        } catch (error) {
            console.error("Error fetching pegawai:", error);
            toast.error("Gagal memuat data pegawai");
        } finally {
            setLoading(false);
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, jenisPegawaiFilter, bidangFilter, pageSize]);

    useEffect(() => {
        fetchPegawai();
    }, [currentPage, pageSize, searchQuery, jenisPegawaiFilter, bidangFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data pegawai ini?")) return;

        try {
            const { error } = await supabaseSppd.from("pegawai").delete().eq("id", id);
            if (error) throw error;
            toast.success("Data pegawai berhasil dihapus");
            fetchPegawai();
        } catch (error) {
            console.error("Error deleting pegawai:", error);
            toast.error("Gagal menghapus data pegawai");
        }
    };

    const totalPages = Math.ceil(totalItems / pageSize);

    const clearFilters = () => {
        setSearchQuery("");
        setJenisPegawaiFilter("all");
        setBidangFilter("all");
    };

    const hasActiveFilters = searchQuery !== "" || jenisPegawaiFilter !== "all" || bidangFilter !== "all";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Data Pegawai</h1>
                    <p className="text-slate-500 dark:text-slate-400">Kelola data pegawai di lingkungan dinas</p>
                </div>
                <Link
                    href="/admin/pegawai/add"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Pegawai
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau NIP..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Select value={jenisPegawaiFilter} onValueChange={setJenisPegawaiFilter}>
                                <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-slate-800">
                                    <SelectValue placeholder="Jenis Pegawai" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Jenis</SelectItem>
                                    <SelectItem value="PNS">PNS</SelectItem>
                                    <SelectItem value="PPPK">PPPK</SelectItem>
                                    <SelectItem value="PPPK - Paruh Waktu">PPPK - Paruh Waktu</SelectItem>
                                    <SelectItem value="Outsourcing">Outsourcing</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={bidangFilter} onValueChange={setBidangFilter}>
                                <SelectTrigger className="w-full sm:w-[220px] bg-white dark:bg-slate-800">
                                    <SelectValue placeholder="Bidang" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Bidang</SelectItem>
                                    <SelectItem value="Sekretariat">Sekretariat</SelectItem>
                                    <SelectItem value="Bidang Informasi dan Komunikasi Publik">Bidang IKP</SelectItem>
                                    <SelectItem value="Bidang Penyelenggaraan E-Government">Bidang E-Gov</SelectItem>
                                    <SelectItem value="Bidang Statistik dan Persandian">Bidang Statistik & Persandian</SelectItem>
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-3 py-2 text-sm text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                                    title="Hapus Filter"
                                >
                                    <X className="h-4 w-4" />
                                    <span className="hidden sm:inline">Reset</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-3 font-medium">Nama / NIP</th>
                                <th className="px-6 py-3 font-medium">Jabatan</th>
                                <th className="px-6 py-3 font-medium">Pangkat / Golongan</th>
                                <th className="px-6 py-3 font-medium">Status & Jenis</th>
                                <th className="px-6 py-3 font-medium text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : pegawai.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                <UserCheck className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <p className="font-medium">Tidak ada data pegawai ditemukan</p>
                                            <p className="text-xs text-slate-400">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pegawai.map((item) => (
                                    <tr key={item.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold shrink-0 uppercase">
                                                    {item.nama_pegawai.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 dark:text-white">{item.nama_pegawai}</div>
                                                    <div className="text-slate-500 text-xs mt-0.5">{item.nip ? `NIP. ${item.nip}` : '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-700 dark:text-slate-300">
                                                {item.jabatan_dinas}
                                            </div>
                                            {item.bidang && (
                                                <div className="text-slate-500 text-xs mt-0.5">{item.bidang}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            {item.pangkat_golongan || "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded text-xs font-medium 
                                                    ${item.jenis_pegawai === 'PNS' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                        item.jenis_pegawai === 'PPPK' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                            'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                    {item.jenis_pegawai}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {item.jenis_kelamin === "L" ? "Laki-laki" : item.jenis_kelamin === "P" ? "Perempuan" : "-"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/pegawai/edit/${item.id}`}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                />
            </div>
        </div>
    );
}
