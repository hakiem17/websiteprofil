"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Modal } from "@/components/admin/ui/Modal";
import { FileText, Edit, Trash2, Download, Search } from "lucide-react";

// Types
type Document = {
    id: string;
    title: string;
    category: string;
    fiscal_year: number;
    file_url: string;
    created_at: string;
};

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        category: "Renstra",
        fiscal_year: new Date().getFullYear(),
        file_url: "",
    });

    // Fetch Documents
    const fetchDocuments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("documents")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setDocuments(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Handle Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingDoc;

        // In a real app, we would handle file upload here first to get the URL
        // For now, we'll assume file_url is manually entered or just a placeholder if not handled yet.

        const payload = {
            title: formData.title,
            category: formData.category,
            fiscal_year: formData.fiscal_year,
            file_url: formData.file_url || "#", // Placeholder if empty
        };

        let error;
        if (isEditing) {
            const { error: updateError } = await supabase
                .from("documents")
                .update(payload)
                .eq("id", editingDoc.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("documents")
                .insert([payload]);
            error = insertError;
        }

        if (!error) {
            setIsModalOpen(false);
            setEditingDoc(null);
            resetForm();
            fetchDocuments();
        } else {
            alert("Error saving document: " + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        const { error } = await supabase.from("documents").delete().eq("id", id);
        if (!error) {
            fetchDocuments();
        } else {
            alert("Error deleting document: " + error.message);
        }
    };

    const openAddModal = () => {
        setEditingDoc(null);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (doc: Document) => {
        setEditingDoc(doc);
        setFormData({
            title: doc.title,
            category: doc.category,
            fiscal_year: doc.fiscal_year,
            file_url: doc.file_url,
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            title: "",
            category: "Renstra",
            fiscal_year: new Date().getFullYear(),
            file_url: "",
        });
    };

    return (
        <div>
            <PageHeader
                title="Manajemen Dokumen"
                description="Kelola dokumen publik seperti Renstra, Renja, dan DPA."
                onAdd={openAddModal}
            />

            {/* List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : documents.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                        <FileText className="h-12 w-12 mb-4 opacity-20" />
                        <p>Belum ada dokumen.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-medium text-slate-500">Judul Dokumen</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Kategori</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Tahun</th>
                                <th className="px-6 py-4 font-medium text-slate-500 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                        <div className="h-8 w-8 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        {doc.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 capitalize">
                                            {doc.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{doc.fiscal_year}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(doc)}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal Form */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingDoc ? "Edit Dokumen" : "Tambah Dokumen Baru"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Judul Dokumen</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            placeholder="Contoh: Renstra Dinas 2024"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kategori</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            >
                                <option value="Renstra">Renstra</option>
                                <option value="Renja">Renja</option>
                                <option value="DPA">DPA</option>
                                <option value="Langkjip">LKJIP</option>
                                <option value="LHKPN">LHKPN</option>
                                <option value="Other">Lainnya</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tahun Anggaran</label>
                            <input
                                type="number"
                                required
                                value={formData.fiscal_year}
                                onChange={(e) => setFormData({ ...formData, fiscal_year: parseInt(e.target.value) })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            />
                        </div>
                    </div>

                    {/* File Input Placeholder */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">File URL</label>
                        <input
                            type="text"
                            value={formData.file_url}
                            onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            placeholder="https://..."
                        />
                        <p className="text-xs text-muted-foreground">
                            * Fitur upload file akan diimplementasikan nanti. Masukkan URL manual untuk sekarang.
                        </p>
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
                            {editingDoc ? "Simpan Perubahan" : "Simpan Dokumen"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
