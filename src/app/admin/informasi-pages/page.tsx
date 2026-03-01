"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Edit, Eye, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";

interface InfoPage {
    id: string;
    slug: string;
    title: string;
    updated_at: string;
}

export default function InformasiPagesList() {
    const [pages, setPages] = useState<InfoPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("informasi_pages")
                .select("id, slug, title, updated_at")
                .order("title", { ascending: true });

            if (error) throw error;
            if (data) setPages(data);
        } catch (error) {
            console.error("Error fetching pages:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPages = pages.filter(page =>
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Editor Halaman Informasi</h1>
                    <p className="text-muted-foreground">Kelola konten statis halaman informasi publik.</p>
                </div>
            </div>

            {pages.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-16 text-center">
                    <FileText className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-muted-foreground font-medium">Belum ada data halaman.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Jalankan seed SQL di Supabase untuk mengisi data awal.
                    </p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cari halaman..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                                <tr>
                                    <th className="py-3 px-4 font-semibold text-sm">Judul Halaman</th>
                                    <th className="py-3 px-4 font-semibold text-sm">Slug / URL</th>
                                    <th className="py-3 px-4 font-semibold text-sm">Terakhir Update</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredPages.map((page) => (
                                    <tr key={page.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{page.title}</div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                                /informasi/{page.slug}
                                            </code>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-muted-foreground">
                                            {format(new Date(page.updated_at), "dd MMM yyyy HH:mm", { locale: idLocale })}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/informasi/${page.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Lihat Halaman"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/informasi-pages/edit/${page.id}`}
                                                    className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    Edit Konten
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPages.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                                            Tidak ada hasil untuk "<strong>{search}</strong>"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
