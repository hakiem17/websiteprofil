"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, ToggleLeft, ToggleRight, ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MenuItem {
    id: string;
    title: string;
    href: string;
    parent_id: string | null;
    order: number;
    is_active: boolean;
    children?: MenuItem[];
}

export default function MenuPage() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("navigation_menus")
                .select("*")
                .order("order", { ascending: true });

            if (error) throw error;

            const menuMap = new Map<string, MenuItem>();
            const rootMenus: MenuItem[] = [];

            data.forEach((item) => {
                menuMap.set(item.id, { ...item, children: [] });
            });

            data.forEach((item) => {
                const menu = menuMap.get(item.id)!;
                if (item.parent_id && menuMap.has(item.parent_id)) {
                    menuMap.get(item.parent_id)!.children!.push(menu);
                } else {
                    rootMenus.push(menu);
                }
            });

            setMenus(rootMenus);
            // Auto-expand all parent menus
            const parentIds = new Set(rootMenus.map(m => m.id));
            setExpandedParents(parentIds);
        } catch (error) {
            console.error("Error fetching menus:", error);
            toast.error("Gagal memuat data menu.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Hapus menu "${title}"? Sub-menu di dalamnya juga akan terhapus.`)) return;

        const toastId = toast.loading("Menghapus menu...");
        try {
            const { error } = await supabase.from("navigation_menus").delete().eq("id", id);
            if (error) throw error;
            toast.success("Menu berhasil dihapus.", { id: toastId });
            fetchMenus();
        } catch (error) {
            console.error("Error deleting menu:", error);
            toast.error("Gagal menghapus menu.", { id: toastId });
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean, title: string) => {
        try {
            const { error } = await supabase
                .from("navigation_menus")
                .update({ is_active: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            toast.success(`Menu "${title}" ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}.`);
            fetchMenus();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Gagal mengubah status menu.");
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedParents(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 space-y-3">
                    {[1, 2, 3, 4].map(i => (
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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Menu Navbar</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Atur navigasi utama website. Perubahan akan langsung terlihat di halaman publik.
                    </p>
                </div>
                <Link
                    href="/admin/menus/add"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm w-fit"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Menu Utama
                </Link>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                <Menu className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-0.5">Struktur Menu Navbar</p>
                    <p className="text-blue-600/80 dark:text-blue-400/80">Menu <strong>utama</strong> muncul di navbar. Menu di dalamnya muncul sebagai <strong>dropdown</strong>. Gunakan tombol <strong>+</strong> untuk menambah sub-menu di bawah menu utama.</p>
                </div>
            </div>

            {/* Menu List */}
            <div className="space-y-3">
                {menus.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-16 text-center">
                        <Menu className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-muted-foreground font-medium">Belum ada menu.</p>
                        <Link href="/admin/menus/add" className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium">
                            <Plus className="h-4 w-4" /> Tambah menu pertama
                        </Link>
                    </div>
                ) : (
                    menus.map((menu) => {
                        const isExpanded = expandedParents.has(menu.id);
                        const hasChildren = (menu.children?.length ?? 0) > 0;

                        return (
                            <div
                                key={menu.id}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
                            >
                                {/* Parent Menu Row */}
                                <div className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-700",
                                    !menu.is_active && "opacity-60"
                                )}>
                                    {/* Expand toggle */}
                                    <button
                                        onClick={() => toggleExpand(menu.id)}
                                        className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
                                        title={isExpanded ? "Sembunyikan sub-menu" : "Tampilkan sub-menu"}
                                    >
                                        {isExpanded
                                            ? <ChevronDown className="h-4 w-4" />
                                            : <ChevronRight className="h-4 w-4" />
                                        }
                                    </button>

                                    {/* Title & URL */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{menu.title}</span>
                                            {hasChildren && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400">
                                                    {menu.children!.length} sub-menu
                                                </span>
                                            )}
                                            {!menu.is_active && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                                    Non-Aktif
                                                </span>
                                            )}
                                        </div>
                                        <a
                                            href={menu.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5 w-fit"
                                        >
                                            {menu.href}
                                            {menu.href !== "#" && <ExternalLink className="h-3 w-3" />}
                                        </a>
                                    </div>

                                    {/* Urutan */}
                                    <span className="text-xs text-slate-400 hidden sm:block">#{menu.order}</span>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        {/* Add sub-menu */}
                                        <Link
                                            href={`/admin/menus/add?parent_id=${menu.id}`}
                                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                                            title="Tambah sub-menu"
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                            Sub-menu
                                        </Link>
                                        {/* Toggle aktif */}
                                        <button
                                            onClick={() => toggleStatus(menu.id, menu.is_active, menu.title)}
                                            className={cn(
                                                "p-1.5 rounded-lg transition-colors",
                                                menu.is_active
                                                    ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                    : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                            )}
                                            title={menu.is_active ? "Nonaktifkan" : "Aktifkan"}
                                        >
                                            {menu.is_active
                                                ? <ToggleRight className="h-5 w-5" />
                                                : <ToggleLeft className="h-5 w-5" />
                                            }
                                        </button>
                                        {/* Edit */}
                                        <Link
                                            href={`/admin/menus/edit/${menu.id}`}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Edit menu"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(menu.id, menu.title)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Hapus menu"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Sub-menu rows */}
                                {isExpanded && hasChildren && (
                                    <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                        {menu.children!.map((child) => (
                                            <div
                                                key={child.id}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 pl-10 bg-slate-50/50 dark:bg-slate-900/30",
                                                    !child.is_active && "opacity-60"
                                                )}
                                            >
                                                <span className="text-slate-300 dark:text-slate-600 text-xs font-mono shrink-0">└─</span>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{child.title}</span>
                                                        {!child.is_active && (
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                                                Non-Aktif
                                                            </span>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={child.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-0.5 w-fit"
                                                    >
                                                        {child.href}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>

                                                <span className="text-xs text-slate-400 hidden sm:block">#{child.order}</span>

                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => toggleStatus(child.id, child.is_active, child.title)}
                                                        className={cn(
                                                            "p-1.5 rounded-lg transition-colors",
                                                            child.is_active
                                                                ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                                                        )}
                                                        title={child.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                    >
                                                        {child.is_active
                                                            ? <ToggleRight className="h-5 w-5" />
                                                            : <ToggleLeft className="h-5 w-5" />
                                                        }
                                                    </button>
                                                    <Link
                                                        href={`/admin/menus/edit/${child.id}`}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(child.id, child.title)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Empty sub-menu hint */}
                                {isExpanded && !hasChildren && (
                                    <div className="px-10 py-3 text-xs text-muted-foreground bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-2">
                                        <span>Belum ada sub-menu.</span>
                                        <Link
                                            href={`/admin/menus/add?parent_id=${menu.id}`}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            + Tambah sekarang
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
