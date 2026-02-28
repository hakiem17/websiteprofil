"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
    Loader2,
    Plus,
    Search,
    Trash2,
    Edit,
    FileText,
    Upload,
    X,
    Check,
    Filter,
    Download,
    Calendar,
    Eye
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type ProgramDocument = {
    id: string;
    title: string;
    description: string | null;
    category: string;
    year: string;
    file_url: string;
    download_count: number;
    published_at: string;
    created_at: string;
};

const CATEGORIES = [
    "Dokumen Perencanaan",
    "Dokumen Evaluasi",
    "Laporan Keuangan",
    "Agenda Penting",
    "Produk Hukum",
    "Informasi Kepegawaian",
    "Lainnya"
];

const YEARS = ["2022", "2023", "2024", "2025", "2026", "2027"];

export default function AdminProgramPage() {
    const [documents, setDocuments] = useState<ProgramDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: CATEGORIES[0],
        year: new Date().getFullYear().toString(),
        file_url: "",
    });

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("program_documents")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            if (data) setDocuments(data as ProgramDocument[]);
        } catch (error) {
            console.error("Error fetching documents:", error);
            // alert("Gagal mengambil data dokumen"); // Suppress initial error if table doesnt exist yet
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            // Validation
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert("Ukuran file terlalu besar (Maksimal 10MB)");
                return;
            }

            const fileExt = file.name.split(".").pop();
            const fileName = `doc-${Date.now()}.${fileExt}`;
            const filePath = `program/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("documents")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, file_url: data.publicUrl }));
        } catch (error: any) {
            alert("Gagal mengupload file: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUploading(true);

            if (!formData.file_url) {
                alert("Mohon upload file dokumen terlebih dahulu");
                return;
            }

            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                year: formData.year,
                file_url: formData.file_url,
                published_at: new Date().toISOString(),
            };

            if (editingId) {
                const { error } = await supabase
                    .from("program_documents")
                    .update(payload)
                    .eq("id", editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("program_documents")
                    .insert([payload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            resetForm();
            fetchDocuments();
        } catch (error: any) {
            alert("Gagal menyimpan dokumen: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string, fileUrl: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;

        try {
            // Delete file from storage if possible (optional, skipping complexity for now)
            // Delete record
            const { error } = await supabase
                .from("program_documents")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        } catch (error: any) {
            alert("Gagal menghapus dokumen: " + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            category: CATEGORIES[0],
            year: new Date().getFullYear().toString(),
            file_url: "",
        });
        setEditingId(null);
    };

    const openEditModal = (doc: ProgramDocument) => {
        setFormData({
            title: doc.title,
            description: doc.description || "",
            category: doc.category,
            year: doc.year,
            file_url: doc.file_url,
        });
        setEditingId(doc.id);
        setIsModalOpen(true);
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Manajemen Dokumen Program</h1>
                    <p className="text-muted-foreground">Kelola dokumen Renstra, Laporan Keuangan, dan lainnya.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Tambah Dokumen
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari judul dokumen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-1 focus:ring-primary outline-none"
                    >
                        <option value="All">Semua Kategori</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Documents List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Belum ada dokumen yang diupload.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-muted-foreground font-medium uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Dokumen</th>
                                    <th className="px-6 py-4">Kategori & Tahun</th>
                                    <th className="px-6 py-4 text-center">Unduhan</th>
                                    <th className="px-6 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredDocuments.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-foreground">{doc.title}</h3>
                                                    {doc.description && (
                                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{doc.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 w-fit">
                                                    {doc.category}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {doc.year}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                                                <Download className="h-3 w-3" />
                                                {doc.download_count}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <a
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Lihat File"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={() => openEditModal(doc)}
                                                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc.id, doc.file_url)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                {editingId ? "Edit Dokumen" : "Upload Dokumen Baru"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="documentForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Judul Dokumen</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Contoh: Laporan Keuangan 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Deskripsi (Opsional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none"
                                        placeholder="Keterangan singkat tentang dokumen ini..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Kategori</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Tahun</label>
                                        <select
                                            value={formData.year}
                                            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                                            className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        >
                                            {YEARS.map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">File Dokumen (PDF)</label>
                                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center">
                                        {formData.file_url ? (
                                            <div className="flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400">
                                                <Check className="h-5 w-5" />
                                                <span className="text-sm font-medium">File berhasil diupload</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, file_url: "" }))}
                                                    className="text-xs underline text-red-500 hover:text-red-600 ml-2"
                                                >
                                                    Ganti
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="block cursor-pointer">
                                                {uploading ? (
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                                        <span className="text-sm text-muted-foreground">Mengupload...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                                        <span className="text-sm font-medium block">Klik untuk upload file</span>
                                                        <span className="text-xs text-muted-foreground">PDF, Docx (Maks. 10MB)</span>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept=".pdf,.doc,.docx"
                                                            onChange={handleUpload}
                                                        />
                                                    </>
                                                )}
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                form="documentForm"
                                disabled={uploading}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {editingId ? "Simpan Perubahan" : "Upload Dokumen"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
