"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Modal } from "@/components/admin/ui/Modal";
import { Briefcase, Edit, Trash2, MapPin, Globe, Upload, Loader2, Image as ImageIcon } from "lucide-react";

type Service = {
    id: string;
    name: string;
    description: string;
    type: "Online" | "Offline";
    link_url?: string;
    location?: string;
    icon_url?: string | null;
    created_at: string;
};

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "Online" as "Online" | "Offline",
        link_url: "",
        location: "",
        icon_url: "" as string | null,
    });

    const fetchServices = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("services")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setServices(data as Service[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchServices();
    }, []);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split(".").pop();
            const fileName = `service-icon-${Date.now()}.${fileExt}`;
            const filePath = `services/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("images").getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, icon_url: data.publicUrl }));
        } catch (error: any) {
            alert("Error uploading icon: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEditing = !!editingService;

        // Validate: if Online required link, if Offline required location
        if (formData.type === "Online" && !formData.link_url) return alert("Link URL wajib diisi untuk layanan Online");
        if (formData.type === "Offline" && !formData.location) return alert("Lokasi wajib diisi untuk layanan Offline");

        const payload = {
            name: formData.name,
            description: formData.description,
            type: formData.type,
            link_url: formData.type === "Online" ? formData.link_url : null,
            location: formData.type === "Offline" ? formData.location : null,
            icon_url: formData.icon_url
        };

        let error;
        if (isEditing) {
            const { error: updateError } = await supabase
                .from("services")
                .update(payload)
                .eq("id", editingService.id);
            error = updateError;
        } else {
            const { error: insertError } = await supabase
                .from("services")
                .insert([payload]);
            error = insertError;
        }

        if (!error) {
            setIsModalOpen(false);
            setEditingService(null);
            resetForm();
            fetchServices();
        } else {
            alert("Error saving service: " + error.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Hapus layanan ini?")) return;
        const { error } = await supabase.from("services").delete().eq("id", id);
        if (!error) fetchServices();
        else alert("Gagal menghapus: " + error.message);
    };

    const openAddModal = () => {
        setEditingService(null);
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (svc: Service) => {
        setEditingService(svc);
        setFormData({
            name: svc.name,
            description: svc.description || "",
            type: svc.type,
            link_url: svc.link_url || "",
            location: svc.location || "",
            icon_url: svc.icon_url || null,
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            type: "Online",
            link_url: "",
            location: "",
            icon_url: null,
        });
    };

    return (
        <div>
            <PageHeader
                title="Manajemen Layanan"
                description="Kelola daftar layanan publik online dan offline."
                onAdd={openAddModal}
            />

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : services.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                        <Briefcase className="h-12 w-12 mb-4 opacity-20" />
                        <p>Belum ada layanan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {services.map((svc) => (
                            <div key={svc.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 relative group bg-slate-50 dark:bg-slate-900/50 flex flex-col h-full">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button onClick={() => openEditModal(svc)} className="p-1.5 bg-white dark:bg-slate-800 rounded-md shadow text-slate-500 hover:text-blue-600">
                                        <Edit className="h-3.5 w-3.5" />
                                    </button>
                                    <button onClick={() => handleDelete(svc.id)} className="p-1.5 bg-white dark:bg-slate-800 rounded-md shadow text-slate-500 hover:text-red-600">
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                                        {svc.icon_url ? (
                                            <img src={svc.icon_url} alt={svc.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Briefcase className="h-6 w-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${svc.type === "Online"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-amber-100 text-amber-700"
                                                }`}>
                                                {svc.type === "Online" ? <Globe className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                                                {svc.type}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{svc.name}</h3>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{svc.description}</p>

                                <div className="text-xs text-slate-500 truncate font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded mt-auto">
                                    {svc.type === "Online" ? svc.link_url : svc.location}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingService ? "Edit Layanan" : "Tambah Layanan"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <label className="relative cursor-pointer group">
                                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex items-center justify-center overflow-hidden hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                                    {formData.icon_url ? (
                                        <img src={formData.icon_url} alt="Icon preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center p-2">
                                            {uploading ? (
                                                <Loader2 className="h-8 w-8 mx-auto text-slate-400 animate-spin" />
                                            ) : (
                                                <Upload className="h-8 w-8 mx-auto text-slate-400 mb-1" />
                                            )}
                                            <span className="text-[10px] text-slate-500 block">Upload Icon</span>
                                        </div>
                                    )}
                                    {/* Hover overlay for change */}
                                    {formData.icon_url && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit className="h-6 w-6 text-white" />
                                        </div>
                                    )}
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nama Layanan</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                                placeholder="Contoh: Perizinan Online"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Deskripsi Singkat</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent h-24"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tipe Layanan</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 p-3 rounded-lg cursor-pointer w-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={formData.type === "Online"}
                                    onChange={() => setFormData({ ...formData, type: "Online" })}
                                    className="text-primary"
                                />
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-blue-500" />
                                    <span>Online</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 p-3 rounded-lg cursor-pointer w-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <input
                                    type="radio"
                                    name="type"
                                    checked={formData.type === "Offline"}
                                    onChange={() => setFormData({ ...formData, type: "Offline" })}
                                    className="text-primary"
                                />
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-amber-500" />
                                    <span>Offline</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {formData.type === "Online" ? (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link URL</label>
                            <input
                                type="url"
                                required
                                value={formData.link_url}
                                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                                placeholder="https://..."
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Lokasi / Alamat</label>
                            <input
                                type="text"
                                required
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent"
                                placeholder="Nama Gedung, Jalan, dll"
                            />
                        </div>
                    )}

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
