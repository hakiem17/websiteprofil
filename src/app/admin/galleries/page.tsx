"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Modal } from "@/components/admin/ui/Modal";
import { Image as ImageIcon, Trash2, Video, Upload, Loader2 } from "lucide-react";

type GalleryItem = {
    id: string;
    title: string;
    media_url: string;
    type: "Photo" | "Video";
    created_at: string;
};

export default function GalleriesPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Upload state
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        media_url: "",
        type: "Photo" as "Photo" | "Video",
    });

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("galleries")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setItems(data as GalleryItem[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split(".").pop();
            const fileName = `gallery-${Date.now()}.${fileExt}`;
            const filePath = `gallery/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("images").getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, media_url: data.publicUrl }));
        } catch (error: any) {
            alert("Error uploading image: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.from("galleries").insert([formData]);
        if (!error) {
            setIsModalOpen(false);
            setFormData({ title: "", media_url: "", type: "Photo" });
            fetchItems();
        } else {
            alert("Error: " + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus item galeri ini?")) return;
        const { error } = await supabase.from("galleries").delete().eq("id", id);
        if (!error) fetchItems();
    };

    return (
        <div>
            <PageHeader
                title="Galeri Multimedia"
                description="Kelola foto dan video kegiatan."
                onAdd={() => setIsModalOpen(true)}
            />

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 min-h-[400px]">
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
                        <ImageIcon className="h-12 w-12 mb-4 opacity-20" />
                        <p>Belum ada item galeri.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="group relative aspect-square bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm">
                                <img
                                    src={item.type === "Photo" ? item.media_url : "https://via.placeholder.com/400x400?text=Video"}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <p className="text-white text-sm font-medium truncate mb-2">{item.title}</p>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg self-end transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                    {item.type === "Photo" ? <ImageIcon className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                                    {item.type}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tambah Item Galeri"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Judul</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipe</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={formData.type === "Photo"} onChange={() => setFormData({ ...formData, type: "Photo" })} />
                                <span>Foto</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" checked={formData.type === "Video"} onChange={() => setFormData({ ...formData, type: "Video" })} />
                                <span>Video</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            {formData.type === "Photo" ? "Foto" : "URL Video"}
                        </label>

                        {formData.type === "Photo" ? (
                            <div className="space-y-3">
                                {formData.media_url ? (
                                    <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                                        <img
                                            src={formData.media_url}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, media_url: "" }))}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-sm hover:bg-red-600 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600 dark:hover:bg-slate-800 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {uploading ? (
                                                    <Loader2 className="h-8 w-8 mb-2 text-slate-500 animate-spin" />
                                                ) : (
                                                    <Upload className="h-8 w-8 mb-2 text-slate-500" />
                                                )}
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    {uploading ? "Mengupload..." : "Klik untuk upload foto"}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <input
                                type="text"
                                required
                                value={formData.media_url}
                                onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                                placeholder="https://youtube.com/..."
                            />
                        )}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                        <button
                            type="submit"
                            disabled={uploading || !formData.media_url}
                            className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? "Mengupload..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
