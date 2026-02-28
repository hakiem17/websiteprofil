"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Check, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Menu {
    id: string;
    title: string;
    href: string;
    parent_id: string | null;
    order: number;
    is_active: boolean;
    children?: Menu[];
}

export default function MenuPage() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);

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

            // Build tree structure
            const menuMap = new Map<string, Menu>();
            const rootMenus: Menu[] = [];

            // First pass: create map of all items and add children array
            data.forEach((item) => {
                menuMap.set(item.id, { ...item, children: [] });
            });

            // Second pass: associate children with parents
            data.forEach((item) => {
                const menu = menuMap.get(item.id)!;
                if (item.parent_id && menuMap.has(item.parent_id)) {
                    menuMap.get(item.parent_id)!.children!.push(menu);
                } else {
                    rootMenus.push(menu);
                }
            });

            setMenus(rootMenus);
        } catch (error) {
            console.error("Error fetching menus:", error);
            alert("Gagal memuat data menu.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus menu ini? Sub-menu juga akan terhapus.")) return;

        try {
            const { error } = await supabase.from("navigation_menus").delete().eq("id", id);
            if (error) throw error;
            fetchMenus();
        } catch (error) {
            console.error("Error deleting menu:", error);
            alert("Gagal menghapus menu.");
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("navigation_menus")
                .update({ is_active: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            fetchMenus();
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Gagal update status.");
        }
    };

    if (loading) return <div>Loading...</div>;

    const MenuRow = ({ menu, level = 0 }: { menu: Menu; level?: number }) => (
        <>
            <tr className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="py-3 px-4">
                    <div style={{ paddingLeft: `${level * 20}px` }} className="flex items-center gap-2">
                        {level > 0 && <span className="text-slate-300">└─</span>}
                        <span className="font-medium">{menu.title}</span>
                    </div>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{menu.href}</td>
                <td className="py-3 px-4 text-center">{menu.order}</td>
                <td className="py-3 px-4 text-center">
                    <button
                        onClick={() => toggleStatus(menu.id, menu.is_active)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${menu.is_active
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                    >
                        {menu.is_active ? "Aktif" : "Non-Aktif"}
                    </button>
                </td>
                <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link
                            href={`/admin/menus/edit/${menu.id}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                        </Link>
                        <button
                            onClick={() => handleDelete(menu.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </td>
            </tr>
            {menu.children?.map((child) => (
                <MenuRow key={child.id} menu={child} level={level + 1} />
            ))}
        </>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Menu</h1>
                    <p className="text-muted-foreground">Atur navigasi website profile.</p>
                </div>
                <Link
                    href="/admin/menus/add"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Menu
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-sm">Label Menu</th>
                                <th className="py-3 px-4 font-semibold text-sm">URL</th>
                                <th className="py-3 px-4 font-semibold text-sm text-center">Urutan</th>
                                <th className="py-3 px-4 font-semibold text-sm text-center">Status</th>
                                <th className="py-3 px-4 font-semibold text-sm text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {menus.map((menu) => (
                                <MenuRow key={menu.id} menu={menu} />
                            ))}
                            {menus.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                                        Belum ada data menu.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
