"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Upload, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const CATEGORIES = ["Berita", "Artikel", "Pengumuman", "Kegiatan", "Siaran Pers"];

export default function CreatePostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        thumbnail_url: "",
        category: "Berita",
        is_published: true,
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }));
    };

    const handleUploadThumbnail = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Ukuran file maksimal 2MB");
                return;
            }

            const fileExt = file.name.split(".").pop();
            const fileName = `post-${Date.now()}.${fileExt}`;
            const filePath = `posts/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("images").getPublicUrl(filePath);
            setFormData((prev) => ({ ...prev, thumbnail_url: data.publicUrl }));
            toast.success("Thumbnail berhasil diupload");
        } catch (error) {
            console.error("Error uploading thumbnail:", error);
            toast.error("Gagal mengupload thumbnail");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from("posts").insert([
            {
                title: formData.title,
                slug: formData.slug || generateSlug(formData.title),
                content: formData.content,
                thumbnail_url: formData.thumbnail_url || null,
                category: formData.category,
                is_published: formData.is_published,
                published_at: formData.is_published ? new Date().toISOString() : null,
            },
        ]);

        setLoading(false);

        if (error) {
            toast.error("Gagal menyimpan: " + error.message);
        } else {
            toast.success("Berita berhasil ditambahkan");
            router.push("/admin/posts");
        }
    };

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/posts"
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tulis Berita Baru</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Judul Berita</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleTitleChange}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-lg font-medium"
                            placeholder="Masukkan judul berita..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Slug (URL)</label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) =>
                                setFormData({ ...formData, slug: e.target.value })
                            }
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm text-muted-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Konten Berita</label>
                        <RichTextEditor
                            content={formData.content}
                            onChange={(html) =>
                                setFormData({ ...formData, content: html })
                            }
                            placeholder="Tulis isi berita di sini..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thumbnail Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Thumbnail Berita</label>
                            <div className="flex items-start gap-4">
                                <div className="relative h-28 w-40 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center dark:border-slate-700 dark:bg-slate-900 shrink-0">
                                    {formData.thumbnail_url ? (
                                        <Image
                                            src={formData.thumbnail_url}
                                            alt="Thumbnail Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-slate-400">
                                            <ImageIcon className="h-8 w-8 mb-1" />
                                            <span className="text-xs">No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-sm">
                                        <Upload className="h-4 w-4" />
                                        {uploading ? "Mengupload..." : "Pilih Gambar"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleUploadThumbnail}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        Format: PNG, JPG, WebP. Maks 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kategori</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Publish Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status Publikasi</label>
                        <div className="flex items-center gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={formData.is_published}
                                    onChange={() => setFormData({ ...formData, is_published: true })}
                                    className="w-4 h-4 text-primary"
                                />
                                <span>Terbit (Published)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!formData.is_published}
                                    onChange={() => setFormData({ ...formData, is_published: false })}
                                    className="w-4 h-4 text-primary"
                                />
                                <span>Draf</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <Link
                            href="/admin/posts"
                            className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            {loading ? "Menyimpan..." : "Simpan Berita"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
