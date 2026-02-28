"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Calendar, Loader2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type PhotoItem = {
    id: string;
    title: string;
    media_url: string;
    created_at: string;
    type: "Photo" | "Video";
};

export function GaleriFoto() {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const { data, error } = await supabase
                    .from("galleries")
                    .select("*")
                    .eq("type", "Photo") // Only fetch photos for the gallery section for now
                    .order("created_at", { ascending: false })
                    .limit(4);

                if (!error && data) {
                    setPhotos(data as PhotoItem[]);
                }
            } catch (error) {
                console.error("Error fetching photos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, []);

    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "dd MMM yyyy", { locale: id });
    };

    if (loading) {
        return (
            <section className="py-20 bg-linear-to-b from-sky-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </div>
            </section>
        );
    }

    if (photos.length === 0) {
        return null; // Don't show section if no photos
    }

    return (
        <section className="py-20 bg-linear-to-b from-sky-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4 shadow-sm dark:shadow-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        Multimedia
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">Galeri Foto</h2>
                    <div className="flex items-center justify-center gap-1 mb-4">
                        <div className="w-8 h-0.5 bg-cyan-500 rounded-full" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <div className="w-12 h-0.5 bg-cyan-500 rounded-full" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Dokumentasi terbaru kegiatan Pemerintah Daerah.
                    </p>
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Large featured photo - Check if exists */}
                    {photos[0] && (
                        <div className="md:col-span-7 md:row-span-2">
                            <div className="relative h-full min-h-[400px] md:min-h-[500px] rounded-2xl overflow-hidden bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/50 group cursor-pointer shadow-sm dark:shadow-none">
                                <img
                                    src={photos[0].media_url}
                                    alt={photos[0].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                {/* Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                    <span className="inline-flex items-center gap-1.5 bg-cyan-500/20 text-cyan-300 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium mb-3 border border-cyan-500/20">
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(photos[0].created_at)}
                                    </span>
                                    <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight group-hover:text-cyan-400 transition-colors">
                                        {photos[0].title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Top-right */}
                    {photos[1] && (
                        <div className="md:col-span-5">
                            <div className="relative h-[240px] rounded-2xl overflow-hidden bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/50 group cursor-pointer shadow-sm dark:shadow-none">
                                <img
                                    src={photos[1].media_url}
                                    alt={photos[1].title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="text-cyan-400 text-xs font-bold mb-1 block">{formatDate(photos[1].created_at)}</span>
                                    <h3 className="text-white font-bold text-lg leading-snug line-clamp-2">{photos[1].title}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom-right: 2 smaller */}
                    {photos.length > 2 && (
                        <div className="md:col-span-5 grid grid-cols-2 gap-4">
                            {photos.slice(2, 4).map((p) => (
                                <div
                                    key={p.id}
                                    className="relative h-[240px] rounded-2xl overflow-hidden bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/50 group cursor-pointer shadow-sm dark:shadow-none"
                                >
                                    <img
                                        src={p.media_url}
                                        alt={p.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <span className="text-cyan-400 text-[10px] font-bold mb-0.5 block">{formatDate(p.created_at)}</span>
                                        <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">{p.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <Link
                        href="#"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white font-bold hover:bg-white dark:hover:bg-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all shadow-sm dark:shadow-none"
                    >
                        Lihat Semua Foto <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
