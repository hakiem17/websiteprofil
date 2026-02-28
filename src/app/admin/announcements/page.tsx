"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Modal } from "@/components/admin/ui/Modal";
import { Megaphone, Edit, Trash2, Clock, AlertTriangle, AlertCircle, Info, FileText, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";

type Announcement = {
    id: string;
    title: string;
    content: string | null;
    priority: "Biasa" | "Penting" | "Urgent";
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
    attachment_url: string | null;
    created_at: string;
};

const PRIORITY_STYLES = {
    Biasa: { bg: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400", icon: Info },
    Penting: { bg: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", icon: AlertCircle },
    Urgent: { bg: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400", icon: AlertTriangle },
};

export default function AnnouncementsPage() {
    const [items, setItems] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Announcement | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        priority: "Biasa" as "Biasa" | "Penting" | "Urgent",
        is_active: true,
        start_date: "",
        end_date: "",
        attachment_url: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setItems(data as Announcement[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const uploadFile = async (file: File): Promise<string | null> => {
        const ext = file.name.split(".").pop();
        const fileName = `pengumuman/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("documents")
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            toast.error("Gagal upload file: " + uploadError.message);
            return null;
        }

        const { data } = supabase.storage.from("documents").getPublicUrl(fileName);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        let attachmentUrl = formData.attachment_url || null;

        // Upload file if selected
        if (selectedFile) {
            const url = await uploadFile(selectedFile);
            if (url) {
                attachmentUrl = url;
            } else {
                setUploading(false);
                return;
            }
        }

        const payload = {
            title: formData.title,
            content: formData.content || null,
            priority: formData.priority,
            is_active: formData.is_active,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            attachment_url: attachmentUrl,
        };

        let error;
        if (editingItem) {
            const { error: updateError } = await supabase
                .from("announcements")
                .update(payload)
                .eq("id", editingItem.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("announcements")
                .insert([payload]);
            error = insertError;
        }

        if (!error) {
            toast.success(editingItem ? "Pengumuman berhasil diperbarui" : "Pengumuman berhasil ditambahkan");
            setIsModalOpen(false);
            setEditingItem(null);
            resetForm();
            fetchItems();
        } else {
            toast.error("Error: " + error.message);
        }
        setUploading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus pengumuman ini?")) return;
        const { error } = await supabase.from("announcements").delete().eq("id", id);
        if (!error) {
            toast.success("Pengumuman berhasil dihapus");
            fetchItems();
        } else {
            toast.error("Gagal menghapus: " + error.message);
        }
    };

    const toggleActive = async (item: Announcement) => {
        const { error } = await supabase
            .from("announcements")
            .update({ is_active: !item.is_active })
            .eq("id", item.id);
        if (!error) {
            toast.success(item.is_active ? "Pengumuman dinonaktifkan" : "Pengumuman diaktifkan");
            fetchItems();
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (item: Announcement) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            content: item.content || "",
            priority: item.priority,
            is_active: item.is_active,
            start_date: item.start_date ? item.start_date.slice(0, 16) : "",
            end_date: item.end_date ? item.end_date.slice(0, 16) : "",
            attachment_url: item.attachment_url || "",
        });
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            content: "",
            priority: "Biasa",
            is_active: true,
            start_date: "",
            end_date: "",
            attachment_url: "",
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 10MB");
                return;
            }
            setSelectedFile(file);
        }
    };

    const removeAttachment = () => {
        setSelectedFile(null);
        setFormData({ ...formData, attachment_url: "" });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM yyyy", { locale: idLocale });
        } catch {
            return dateStr;
        }
    };

    const getFileName = (url: string) => {
        try {
            return decodeURIComponent(url.split("/").pop() || "Lampiran");
        } catch {
            return "Lampiran";
        }
    };

    return (
        <div>
            <PageHeader
                title="Pengumuman"
                description="Kelola pengumuman penting untuk publik."
                onAdd={openAddModal}
            />

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                        <Megaphone className="h-12 w-12 mb-4 opacity-20" />
                        <p>Belum ada pengumuman.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {items.map((item) => {
                            const style = PRIORITY_STYLES[item.priority];
                            const PriorityIcon = style.icon;
                            return (
                                <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    {/* Priority icon */}
                                    <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${style.bg}`}>
                                        <PriorityIcon className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${style.bg}`}>
                                                {item.priority}
                                            </span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.is_active
                                                ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                                                : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                                                }`}>
                                                {item.is_active ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </div>
                                        {item.content && (
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mb-1">{item.content}</p>
                                        )}
                                        <div className="flex gap-3 text-xs text-slate-400 flex-wrap">
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                Dibuat: {formatDate(item.created_at)}
                                            </span>
                                            {item.end_date && (
                                                <span>Berakhir: {formatDate(item.end_date)}</span>
                                            )}
                                            {item.attachment_url && (
                                                <a
                                                    href={item.attachment_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:underline"
                                                >
                                                    <FileText className="h-3 w-3" />
                                                    PDF Lampiran
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => toggleActive(item)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${item.is_active
                                                ? "border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900/20"
                                                : "border-green-300 text-green-600 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900/20"
                                                }`}
                                        >
                                            {item.is_active ? "Nonaktifkan" : "Aktifkan"}
                                        </button>
                                        <button onClick={() => openEditModal(item)} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-blue-600 transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-red-600 transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? "Edit Pengumuman" : "Tambah Pengumuman"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Judul Pengumuman</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            placeholder="Contoh: Penutupan Layanan Sementara"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Isi Pengumuman</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent h-28"
                            placeholder="Detail pengumuman..."
                        />
                    </div>

                    {/* PDF Upload Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Lampiran PDF</label>
                        {(selectedFile || formData.attachment_url) ? (
                            <div className="flex items-center gap-3 p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
                                <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                                <span className="text-sm text-cyan-700 dark:text-cyan-300 truncate flex-1">
                                    {selectedFile ? selectedFile.name : getFileName(formData.attachment_url)}
                                </span>
                                <button
                                    type="button"
                                    onClick={removeAttachment}
                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 transition-all"
                            >
                                <Upload className="h-5 w-5 text-slate-400" />
                                <span className="text-sm text-slate-500">Klik untuk upload PDF (maks 10MB)</span>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Prioritas</label>
                        <div className="flex gap-3">
                            {(["Biasa", "Penting", "Urgent"] as const).map((p) => {
                                const s = PRIORITY_STYLES[p];
                                return (
                                    <label key={p} className={`flex items-center gap-2 border rounded-lg px-4 py-2.5 cursor-pointer transition-all ${formData.priority === p
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}>
                                        <input
                                            type="radio"
                                            name="priority"
                                            checked={formData.priority === p}
                                            onChange={() => setFormData({ ...formData, priority: p })}
                                            className="hidden"
                                        />
                                        <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${s.bg} px-2 py-0.5 rounded`}>
                                            {p}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Mulai Ditampilkan</label>
                            <input
                                type="datetime-local"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Berakhir</label>
                            <input
                                type="datetime-local"
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="rounded"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium">Aktifkan pengumuman</label>
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
                            disabled={uploading}
                            className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {uploading ? "Mengupload..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
