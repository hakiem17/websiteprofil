"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, Carddescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, Save } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface SiteSettings {
    site_name: string;
    logo_url: string | null;
    description: string;
}

export default function SiteSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<SiteSettings>({
        site_name: "",
        logo_url: null,
        description: ""
    });
    const [uploading, setUploading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            }
        };

        checkAuth();
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("site_settings")
                .select("site_name, logo_url, description")
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setSettings({
                    site_name: data.site_name || "",
                    logo_url: data.logo_url,
                    description: data.description || ""
                });
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
            toast.error("Gagal memuat pengaturan website");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split(".").pop();
            const fileName = `logo-${Date.now()}.${fileExt}`;
            const filePath = `site-identity/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("images").getPublicUrl(filePath);
            setSettings(prev => ({ ...prev, logo_url: data.publicUrl }));
            toast.success("Logo berhasil diupload");
        } catch (error) {
            console.error("Error uploading logo:", error);
            toast.error("Gagal mengupload logo");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Upsert mechanism: check if row exists first or just update
            // Since we enforce singleton in DB logic/migration (usually), we can try update first.
            // But to be safe with RLS, we check if we need to insert or update.
            // Actually, for a single row table, we can just do an upsert if we had an ID.
            // Since we don't track ID in state, let's just do a check.

            const { data: existing } = await supabase.from("site_settings").select("id").single();

            let error;
            if (existing) {
                const { error: updateError } = await supabase
                    .from("site_settings")
                    .update({
                        site_name: settings.site_name,
                        logo_url: settings.logo_url,
                        description: settings.description,
                        updated_at: new Date().toISOString()
                    })
                    .eq("id", existing.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from("site_settings")
                    .insert([{
                        site_name: settings.site_name,
                        logo_url: settings.logo_url,
                        description: settings.description
                    }]);
                error = insertError;
            }

            if (error) throw error;
            toast.success("Pengaturan berhasil disimpan");
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Gagal menyimpan pengaturan");
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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Identitas Website</h1>
                <p className="text-muted-foreground">
                    Atur nama website, logo, dan deskripsi singkat instansi.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profil Instansi</CardTitle>
                    <Carddescription>
                        Informasi ini akan ditampilkan di Header, Footer, dan Metadata website.
                    </Carddescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="site_name">Nama Pemerintahan / Instansi</Label>
                            <Input
                                id="site_name"
                                value={settings.site_name}
                                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                placeholder="Contoh: Pemerintah Kabupaten ..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi Singkat</Label>
                            <Input
                                id="description"
                                value={settings.description}
                                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                placeholder="Website Resmi Pemerintah Daerah ..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Logo Website</Label>
                            <div className="flex items-center gap-6">
                                <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center dark:border-slate-700 dark:bg-slate-900">
                                    {settings.logo_url ? (
                                        <Image
                                            src={settings.logo_url}
                                            alt="Logo Preview"
                                            fill
                                            className="object-contain p-2"
                                        />
                                    ) : (
                                        <Upload className="h-8 w-8 text-slate-400" />
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUploadLogo}
                                        disabled={uploading}
                                        className="max-w-xs"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Format: PNG, JPG, SVG. Maks 2MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={saving || uploading}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
