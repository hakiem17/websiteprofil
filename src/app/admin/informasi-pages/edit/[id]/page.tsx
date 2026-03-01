"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Save, Loader2, Link2, ExternalLink, Menu } from "lucide-react";
import Link from "next/link";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { toast } from "sonner";

interface ConnectedMenu {
    id: string;
    title: string;
    href: string;
    is_active: boolean;
}

export default function EditInformasiPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [connectedMenus, setConnectedMenus] = useState<ConnectedMenu[]>([]);
    const [notInMenu, setNotInMenu] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
    });

    useEffect(() => {
        if (id) fetchPage(id);
    }, [id]);

    // Redirect when page is not linked to any Informasi sub-menu
    useEffect(() => {
        if (notInMenu) {
            toast.error("Halaman ini tidak tersambung ke menu. Editor dinonaktifkan.");
            router.replace("/admin/informasi-pages");
        }
    }, [notInMenu]);

    const fetchPage = async (pageId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("informasi_pages")
                .select("*")
                .eq("id", pageId)
                .single();

            // Page doesn't exist in the database
            if (error || !data) {
                toast.error("Halaman tidak ditemukan.");
                router.replace("/admin/informasi-pages");
                return;
            }

            setFormData({
                title: data.title,
                slug: data.slug,
                content: data.content || "",
            });

            // Find the Informasi parent menu
            const { data: parentData } = await supabase
                .from("navigation_menus")
                .select("id")
                .is("parent_id", null)
                .ilike("title", "informasi")
                .single();

            // Check if this page's slug exists as a sub-menu under Informasi
            const { data: menuData } = await supabase
                .from("navigation_menus")
                .select("id, title, href, is_active")
                .eq("href", `/informasi/${data.slug}`)
                .eq("parent_id", parentData?.id ?? "none");

            const menus = menuData || [];
            setConnectedMenus(menus);

            // If no sub-menu under Informasi links here → block editor
            if (menus.length === 0) {
                setNotInMenu(true);
            }
        } catch (error) {
            console.error("Error fetching page:", error);
            toast.error("Gagal memuat data halaman.");
            router.replace("/admin/informasi-pages");
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

    // Block: page not linked to any menu → editor disabled
    if (notInMenu) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Link href="/admin/informasi-pages" className="hover:text-primary transition-colors">
                        Halaman Informasi
                    </Link>
                    <span>/</span>
                    <span className="text-slate-600 dark:text-slate-400">Edit</span>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-800 shadow-sm overflow-hidden">
                    <div className="bg-red-50 dark:bg-red-900/20 px-6 py-5 border-b border-red-100 dark:border-red-800 flex items-start gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg shrink-0">
                            <Menu className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h2 className="font-bold text-red-700 dark:text-red-400">Editor Tidak Tersedia</h2>
                            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                                Halaman <code className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-xs font-mono">/informasi/{formData.slug}</code> tidak terhubung ke menu manapun di navbar.
                            </p>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Karena halaman ini tidak muncul di navigasi publik, editor kontennya dinonaktifkan secara otomatis.
                            Untuk mengaktifkan kembali:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
                            <li>Buka <Link href="/admin/menus" className="text-primary hover:underline font-medium">Manajemen Menu</Link></li>
                            <li>Tambah sub-menu baru di bawah <strong>Informasi</strong> dengan URL <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">/informasi/{formData.slug}</code></li>
                            <li>Kembali ke halaman ini setelah menu ditambahkan</li>
                        </ol>
                        <div className="pt-2 flex gap-3">
                            <Link
                                href="/admin/informasi-pages"
                                className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary rounded-lg text-sm font-medium transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
                            </Link>
                            <Link
                                href="/admin/menus"
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 rounded-lg text-sm font-medium transition-colors"
                            >
                                Buka Manajemen Menu
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Link href="/admin/informasi-pages" className="hover:text-primary transition-colors">
                            Halaman Informasi
                        </Link>
                        <span>/</span>
                        <span className="text-slate-600 dark:text-slate-400">Edit</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Halaman Informasi</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Mengedit:{" "}
                        <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs">
                            /informasi/{formData.slug}
                        </code>
                    </p>
                </div>
                <Link
                    href="/admin/informasi-pages"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors shrink-0"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar
                </Link>
            </div>

            {/* Main grid: form + sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Editor — left 2/3 */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30">
                            <h2 className="font-semibold text-slate-800 dark:text-white text-sm">Konten Halaman</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Judul Halaman <span className="text-red-500">*</span>
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
                                    Isi Konten
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
                                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Lihat halaman publik
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

                {/* Sidebar — right 1/3 */}
                <div className="space-y-4">
                    {/* Connected Menus Panel */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/30 flex items-center gap-2.5">
                            <Link2 className="h-4 w-4 text-slate-500 dark:text-slate-400 shrink-0" />
                            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">Menu Terkait</h3>
                        </div>
                        <div className="p-4">
                            {connectedMenus.length > 0 ? (
                                <div className="space-y-2">
                                    {connectedMenus.map((menu) => (
                                        <div
                                            key={menu.id}
                                            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                                    {menu.title}
                                                </p>
                                                <span
                                                    className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${menu.is_active
                                                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                        : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                                        }`}
                                                >
                                                    {menu.is_active ? "Aktif" : "Non-Aktif"}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/admin/menus/edit/${menu.id}`}
                                                className="shrink-0 p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit menu ini"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Link>
                                        </div>
                                    ))}
                                    <p className="text-xs text-muted-foreground pt-1">
                                        Klik ikon untuk mengedit menu di{" "}
                                        <Link href="/admin/menus" className="text-primary hover:underline">
                                            Manajemen Menu
                                        </Link>
                                        .
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Menu className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada menu yang mengarah ke halaman ini.
                                    </p>
                                    <Link
                                        href="/admin/menus"
                                        className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                                    >
                                        + Tambah menu di sini
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-semibold mb-1">Catatan</p>
                        <ul className="space-y-1 text-blue-600/80 dark:text-blue-400/80 text-xs list-disc list-inside">
                            <li>Slug URL tidak dapat diubah melalui editor ini.</li>
                            <li>Perubahan konten langsung tampil di halaman publik.</li>
                            <li>Aktif/nonaktif halaman diatur melalui menu terkait.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
