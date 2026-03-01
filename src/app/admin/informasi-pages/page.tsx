"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Edit, Eye, Search, FileText, Info, ToggleLeft, ToggleRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuWithPage {
    // from navigation_menus
    menu_id: string;
    menu_title: string;
    menu_href: string;
    menu_is_active: boolean;
    menu_order: number;
    // from informasi_pages (nullable — may not exist)
    page_id: string | null;
    page_slug: string | null;
    page_updated_at: string | null;
}

export default function InformasiPagesList() {
    const [rows, setRows] = useState<MenuWithPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // 1. Get the parent "Informasi" menu id
            const { data: parentData } = await supabase
                .from("navigation_menus")
                .select("id")
                .is("parent_id", null)
                .ilike("title", "informasi")
                .single();

            if (!parentData) {
                setRows([]);
                return;
            }

            // 2. Get all sub-menus under Informasi, sorted by order
            const { data: menus, error: menuErr } = await supabase
                .from("navigation_menus")
                .select("id, title, href, is_active, order")
                .eq("parent_id", parentData.id)
                .order("order", { ascending: true });

            if (menuErr) throw menuErr;
            if (!menus || menus.length === 0) {
                setRows([]);
                return;
            }

            // 3. Get all informasi_pages to cross-reference
            const { data: pages } = await supabase
                .from("informasi_pages")
                .select("id, slug, updated_at");

            const pageMap = new Map<string, { id: string; slug: string; updated_at: string }>();
            (pages || []).forEach((p) => pageMap.set(p.slug, p));

            // 4. Merge: for each menu, extract slug from href and find matching page
            const combined: MenuWithPage[] = menus.map((menu) => {
                // e.g. href = "/informasi/agenda-pimpinan" → slug = "agenda-pimpinan"
                const slug = menu.href.replace("/informasi/", "");
                const page = pageMap.get(slug) ?? null;

                return {
                    menu_id: menu.id,
                    menu_title: menu.title,
                    menu_href: menu.href,
                    menu_is_active: menu.is_active,
                    menu_order: menu.order,
                    page_id: page?.id ?? null,
                    page_slug: page?.slug ?? slug,
                    page_updated_at: page?.updated_at ?? null,
                };
            });

            setRows(combined);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRows = rows.filter(
        (r) =>
            r.menu_title.toLowerCase().includes(search.toLowerCase()) ||
            r.menu_href.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="h-16 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl animate-pulse" />
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Editor Halaman Informasi</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Menampilkan <strong>{rows.length}</strong> halaman sesuai sub-menu &ldquo;Informasi&rdquo; di navbar.
                    </p>
                </div>
                <Link
                    href="/admin/menus"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg hover:border-primary"
                >
                    <FileText className="h-4 w-4" />
                    Kelola Sub-menu Informasi
                </Link>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-0.5">Sinkron dengan Manajemen Menu</p>
                    <p className="text-blue-600/80 dark:text-blue-400/80">
                        Daftar ini otomatis mengikuti jumlah sub-menu di bawah <strong>Informasi</strong> pada navbar.
                        Tambah atau hapus menu melalui{" "}
                        <Link href="/admin/menus" className="underline hover:text-blue-800 dark:hover:text-blue-200 font-semibold">
                            Manajemen Menu
                        </Link>{" "}
                        — editor di sini akan menyesuaikan secara otomatis.
                    </p>
                </div>
            </div>

            {rows.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-16 text-center">
                    <FileText className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-muted-foreground font-medium">Belum ada sub-menu di bawah &ldquo;Informasi&rdquo;.</p>
                    <Link href="/admin/menus" className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                        + Tambah sub-menu di Manajemen Menu
                    </Link>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    {/* Search */}
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
                                    <th className="py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300 w-8">#</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300">Nama Menu</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300">URL</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300">Status Menu</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-slate-700 dark:text-slate-300">Terakhir Update</th>
                                    <th className="py-3 px-4 font-semibold text-sm text-right text-slate-700 dark:text-slate-300">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {filteredRows.map((row, idx) => (
                                    <tr
                                        key={row.menu_id}
                                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!row.menu_is_active ? "opacity-60" : ""
                                            }`}
                                    >
                                        {/* Order */}
                                        <td className="py-3 px-4 text-xs text-slate-400 font-mono">
                                            {idx + 1}
                                        </td>

                                        {/* Menu Title */}
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {row.menu_title}
                                            </div>
                                        </td>

                                        {/* URL */}
                                        <td className="py-3 px-4">
                                            <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                                                {row.menu_href}
                                            </code>
                                        </td>

                                        {/* Status Menu */}
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${row.menu_is_active
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                                    }`}
                                            >
                                                {row.menu_is_active
                                                    ? <><ToggleRight className="h-3 w-3" /> Aktif</>
                                                    : <><ToggleLeft className="h-3 w-3" /> Non-Aktif</>
                                                }
                                            </span>
                                        </td>

                                        {/* Last Updated */}
                                        <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                                            {row.page_updated_at
                                                ? format(new Date(row.page_updated_at), "dd MMM yyyy HH:mm", { locale: idLocale })
                                                : <span className="text-xs italic text-slate-400">Belum ada halaman</span>
                                            }
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Preview — only if href is a real page (not /informasi/berita) */}
                                                <Link
                                                    href={row.menu_href}
                                                    target="_blank"
                                                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                    title="Lihat Halaman Publik"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>

                                                {row.page_id ? (
                                                    <Link
                                                        href={`/admin/informasi-pages/edit/${row.page_id}`}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        Edit Konten
                                                    </Link>
                                                ) : (
                                                    <span className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-lg text-sm font-medium cursor-default">
                                                        <FileText className="h-3.5 w-3.5" />
                                                        Halaman Dinamis
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                                            Tidak ada hasil untuk &ldquo;<strong>{search}</strong>&rdquo;
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
