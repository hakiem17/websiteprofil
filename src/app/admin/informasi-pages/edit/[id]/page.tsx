"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { toast } from "sonner";

export default function EditInformasiPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
    });

    useEffect(() => {
        if (id) fetchPage(id);
    }, [id]);

    const fetchPage = async (pageId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("informasi_pages")
                .select("*")
                .eq("id", pageId)
                .single();

            if (error) throw error;
            if (data) {
                setFormData({
                    title: data.title,
                    slug: data.slug,
                    content: data.content || "",
                });
            }
        } catch (error) {
            console.error("Error fetching page:", error);
            toast.error("Gagal memuat data halaman.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const { error } = await supabase
                .from("informasi_pages")
                .update({
                    title: formData.title,
                    content: formData.content,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id);

            if (error) throw error;

            toast.success("Perubahan berhasil disimpan");
            router.push("/admin/informasi-pages");
            router.refresh();
        } catch (error) {
            console.error("Error saving page:", error);
            toast.error("Gagal menyimpan perubahan.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Halaman Informasi</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Mengedit: <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">/informasi/{formData.slug}</code>
                    </p>
                </div>
                <Link
                    href="/admin/informasi-pages"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Judul Halaman
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Slug (URL) — tidak dapat diubah
                            </label>
                            <input
                                type="text"
                                disabled
                                value={formData.slug}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Konten Halaman
                        </label>
                        <RichTextEditor
                            value={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <Link
                            href={`/informasi/${formData.slug}`}
                            target="_blank"
                            className="text-sm text-primary hover:underline"
                        >
                            Lihat halaman publik →
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
