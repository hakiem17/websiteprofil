"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Modal } from "@/components/admin/ui/Modal";
import { Calendar, Edit, Trash2, MapPin, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

type Agenda = {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    organizer: string | null;
    start_date: string;
    end_date: string | null;
    is_published: boolean;
    created_at: string;
};

export default function AgendaPage() {
    const [items, setItems] = useState<Agenda[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Agenda | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        organizer: "",
        start_date: "",
        end_date: "",
        is_published: true,
    });

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("agenda")
            .select("*")
            .order("start_date", { ascending: false });

        if (!error && data) {
            setItems(data as Agenda[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingItem;

        const payload = {
            title: formData.title,
            description: formData.description || null,
            location: formData.location || null,
            organizer: formData.organizer || null,
            start_date: formData.start_date,
            end_date: formData.end_date || null,
            is_published: formData.is_published,
        };

        let error;
        if (isEditing) {
            const { error: updateError } = await supabase
                .from("agenda")
                .update(payload)
                .eq("id", editingItem.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("agenda")
                .insert([payload]);
            error = insertError;
        }

        if (!error) {
            toast.success(isEditing ? "Agenda berhasil diperbarui" : "Agenda berhasil ditambahkan");
            setIsModalOpen(false);
            setEditingItem(null);
            resetForm();
            fetchItems();
        } else {
            toast.error("Error: " + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus agenda ini?")) return;
        const { error } = await supabase.from("agenda").delete().eq("id", id);
        if (!error) {
            toast.success("Agenda berhasil dihapus");
            fetchItems();
        } else {
            toast.error("Gagal menghapus: " + error.message);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Agenda) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description || "",
            location: item.location || "",
            organizer: item.organizer || "",
            start_date: item.start_date ? item.start_date.slice(0, 16) : "",
            end_date: item.end_date ? item.end_date.slice(0, 16) : "",
            is_published: item.is_published,
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            location: "",
            organizer: "",
            start_date: "",
            end_date: "",
            is_published: true,
        });
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM yyyy, HH:mm", { locale: idLocale });
        } catch {
            return dateStr;
        }
    };

    return (
        <div>
            <PageHeader
                title="Agenda Kegiatan"
                description="Kelola jadwal kegiatan dan agenda pimpinan."
                onAdd={openAddModal}
            />

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                        <Calendar className="h-12 w-12 mb-4 opacity-20" />
                        <p>Belum ada agenda kegiatan.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {items.map((item) => (
                            <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                {/* Date badge */}
                                <div className="shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex flex-col items-center justify-center text-orange-600 dark:text-orange-400">
                                    <span className="text-2xl font-bold leading-none">
                                        {format(new Date(item.start_date), "dd")}
                                    </span>
                                    <span className="text-xs font-semibold uppercase">
                                        {format(new Date(item.start_date), "MMM", { locale: idLocale })}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                                        <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.is_published
                                                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                                            }`}>
                                            {item.is_published ? "Publik" : "Draft"}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            {formatDate(item.start_date)}
                                            {item.end_date && ` — ${formatDate(item.end_date)}`}
                                        </span>
                                        {item.location && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5" />
                                                {item.location}
                                            </span>
                                        )}
                                        {item.organizer && (
                                            <span className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5" />
                                                {item.organizer}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">{item.description}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(item)} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-blue-600 transition-colors">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-red-600 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit Agenda" : "Tambah Agenda"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Judul Kegiatan</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            placeholder="Contoh: Rapat Koordinasi Smart City"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Deskripsi (Opsional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent h-20"
                            placeholder="Deskripsi singkat kegiatan..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tanggal & Waktu Mulai</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tanggal & Waktu Selesai</label>
                            <input
                                type="datetime-local"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lokasi</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                                placeholder="Ruang Rapat Lt. 3"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Penanggung Jawab</label>
                            <input
                                type="text"
                                value={formData.organizer}
                                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                                placeholder="Kepala Dinas"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={formData.is_published}
                            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                            className="rounded"
                        />
                        <label htmlFor="is_published" className="text-sm font-medium">Tampilkan di halaman publik</label>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
