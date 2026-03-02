"use client";

import { useState, useEffect } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon, Video, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = {
    id: string;
    title: string;
    media_url: string;
    type: "Photo" | "Video";
    created_at: string;
};

export default function GaleriPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"Semua" | "Photo" | "Video">("Semua");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchGallery = async () => {
            const { data, error } = await supabase
                .from("galleries")
                .select("*")
                .order("created_at", { ascending: false });
            if (!error && data) {
                setItems(data as GalleryItem[]);
            }
            setLoading(false);
        };
        fetchGallery();
    }, []);

    const filtered = filter === "Semua" ? items : items.filter((i) => i.type === filter);

    const photoItems = filtered.filter((i) => i.type === "Photo");

    const openLightbox = (item: GalleryItem) => {
        const idx = photoItems.findIndex((p) => p.id === item.id);
        if (idx !== -1) setLightboxIndex(idx);
    };

    const closeLightbox = () => setLightboxIndex(null);

    const prevPhoto = () => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex - 1 + photoItems.length) % photoItems.length);
    };

    const nextPhoto = () => {
        if (lightboxIndex === null) return;
        setLightboxIndex((lightboxIndex + 1) % photoItems.length);
    };

    // Format tanggal
    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    // Extract YouTube embed URL
    const getYoutubeEmbed = (url: string) => {
        const match = url.match(
            /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        );
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };

    return (
        <>
            <PageHero
                title="Galeri"
                subtitle="Dokumentasi kegiatan dan momen di Dinas Komunikasi dan Informatika"
                breadcrumbs={[
                    { label: "Menu Lainnya" },
                    { label: "Galeri" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {(["Semua", "Photo", "Video"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === tab
                                        ? "bg-cyan-600 text-white shadow-md"
                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {tab === "Photo" ? "Foto" : tab === "Video" ? "Video" : "Semua"}
                            </button>
                        ))}
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse"
                                />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                            <Camera className="h-16 w-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">Belum ada item galeri.</p>
                        </div>
                    )}

                    {/* Gallery Grid */}
                    {!loading && filtered.length > 0 && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {filtered.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => item.type === "Photo" ? openLightbox(item) : undefined}
                                >
                                    {item.type === "Photo" ? (
                                        <div className="aspect-square bg-slate-100 dark:bg-slate-900">
                                            <img
                                                src={item.media_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square bg-slate-900 flex items-center justify-center">
                                            <Video className="h-12 w-12 text-white/40" />
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-white/20 text-white mb-1.5">
                                            {item.type === "Photo" ? (
                                                <ImageIcon className="h-3 w-3" />
                                            ) : (
                                                <Video className="h-3 w-3" />
                                            )}
                                            {item.type === "Photo" ? "Foto" : "Video"}
                                        </span>
                                        <h3 className="text-white font-bold text-sm line-clamp-2">{item.title}</h3>
                                        <p className="text-white/70 text-xs mt-0.5">{formatDate(item.created_at)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Video Section (if filter is Semua or Video) */}
                    {!loading && filter !== "Photo" && filtered.filter((i) => i.type === "Video").length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Video className="h-5 w-5 text-cyan-600" />
                                Video Kegiatan
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered
                                    .filter((i) => i.type === "Video")
                                    .map((item) => (
                                        <div key={item.id} className="space-y-2">
                                            <div className="aspect-video rounded-xl overflow-hidden shadow">
                                                <iframe
                                                    src={getYoutubeEmbed(item.media_url)}
                                                    title={item.title}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 line-clamp-2">
                                                {item.title}
                                            </p>
                                            <p className="text-xs text-slate-400">{formatDate(item.created_at)}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && photoItems[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    {/* Close */}
                    <button
                        className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                        onClick={closeLightbox}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Prev */}
                    {photoItems.length > 1 && (
                        <button
                            className="absolute left-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={photoItems[lightboxIndex].media_url}
                            alt={photoItems[lightboxIndex].title}
                            className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
                        />
                        <p className="text-white font-semibold text-center text-sm">
                            {photoItems[lightboxIndex].title}
                        </p>
                        <p className="text-white/50 text-xs">
                            {lightboxIndex + 1} / {photoItems.length}
                        </p>
                    </div>

                    {/* Next */}
                    {photoItems.length > 1 && (
                        <button
                            className="absolute right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
