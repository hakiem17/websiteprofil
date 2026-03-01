"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface MenuFormProps {
    initialData?: any;
    initialParentId?: string;
    isEdit?: boolean;
}

export default function MenuForm({ initialData, initialParentId, isEdit = false }: MenuFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [parents, setParents] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        href: "",
        parent_id: initialParentId || "",
        order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchParents();
        if (initialData) {
            setFormData({
                title: initialData.title,
                href: initialData.href,
                parent_id: initialData.parent_id || "",
                order: initialData.order,
                is_active: initialData.is_active,
            });
        }
    }, [initialData]);

    const fetchParents = async () => {
        // Fetch only top-level menus to be parents (level 0)
        // We avoid fetching the current menu itself as parent if editing
        let query = supabase
            .from("navigation_menus")
            .select("id, title")
            .is("parent_id", null)
            .order("order");

        if (isEdit && initialData?.id) {
            query = query.neq("id", initialData.id);
        }

        const { data } = await query;
        if (data) setParents(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading(isEdit ? "Menyimpan perubahan..." : "Menambahkan menu...");
        try {
            const payload = {
                ...formData,
                parent_id: formData.parent_id === "" ? null : formData.parent_id,
            };

            if (isEdit) {
                const { error } = await supabase
                    .from("navigation_menus")
                    .update(payload)
                    .eq("id", initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("navigation_menus")
                    .insert([payload]);
                if (error) throw error;
            }

            toast.success(isEdit ? "Menu berhasil diperbarui." : "Menu berhasil ditambahkan.", { id: toastId });
            router.push("/admin/menus");
            router.refresh();
        } catch (error: any) {
            console.error("Error saving menu:", error);
            toast.error("Gagal menyimpan menu: " + error.message, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {isEdit ? "Edit Menu" : "Tambah Menu Baru"}
                </h2>
                <Link
                    href="/admin/menus"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Label Menu <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white"
                        placeholder="Contoh: Profil"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        URL / Link <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.href}
                        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white"
                        placeholder="Contoh: /profil/visi-misi atau https://..."
                    />
                    <p className="text-xs text-muted-foreground">Gunakan # jika hanya sebagai parent menu.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Parent Menu (Opsional)
                        </label>
                        <select
                            value={formData.parent_id}
                            onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white"
                        >
                            <option value="">-- Menu Utama (Top Level) --</option>
                            {parents.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Urutan
                        </label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                        Aktifkan Menu Ini
                    </label>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 w-full md:w-auto bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {loading ? "Menyimpan..." : "Simpan Menu"}
                    </button>
                </div>
            </form>
        </div>
    );
}
