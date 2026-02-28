"use client";

import { useEffect, useState } from "react";
import { Play, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

type VideoItem = {
    id: string;
    title: string;
    date: string;
    youtubeId: string;
    publishedAt: string;
};

export function VideoTerbaru() {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVideos() {
            try {
                const res = await fetch("/api/youtube", { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch videos");
                const data = await res.json();
                setVideos(data);
            } catch (error) {
                console.error("Error fetching YouTube videos:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchVideos();
    }, []);

    // Get featured video (latest) and sidebar videos (rest)
    const featuredVideo = videos[0];
    const sidebarVideos = videos.slice(1, 6);

    // Helper to format date
    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: id });
        } catch (e) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-linear-to-b from-blue-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500">Memuat video terbaru...</p>
                </div>
            </section>
        );
    }

    if (!featuredVideo) {
        return null; // Or return empty state
    }

    return (
        <section className="py-20 bg-linear-to-b from-blue-50 to-cyan-50 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 mb-4">
                        <Play className="w-3.5 h-3.5 text-cyan-500" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Multimedia</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
                        Video Terbaru
                    </h2>
                    <div className="flex items-center justify-center gap-1.5 mb-4">
                        <div className="h-0.5 w-8 bg-cyan-500 rounded-full"></div>
                        <div className="h-1.5 w-1.5 bg-cyan-500 rounded-full"></div>
                        <div className="h-0.5 w-8 bg-cyan-500 rounded-full"></div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Tonton video informatif dan edukatif dari Pemerintah Daerah.
                    </p>
                </div>

                {/* Video Content - Two Column */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Featured Video - Left Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-lg">
                            {/* Video Embed Area */}
                            <div className="relative aspect-video bg-slate-900 group cursor-pointer">
                                <img
                                    src={`https://img.youtube.com/vi/${featuredVideo.youtubeId}/maxresdefault.jpg`}
                                    alt={featuredVideo.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = "none";
                                    }}
                                />
                                {/* Play overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-500/90 hover:bg-cyan-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xl">
                                        <Play className="w-7 h-7 md:w-9 md:h-9 text-white fill-white ml-1" />
                                    </div>
                                </div>
                                {/* Title overlay */}
                                <div className="absolute top-4 left-4 right-4">
                                    <span className="inline-block text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg line-clamp-2">
                                        {featuredVideo.title}
                                    </span>
                                </div>
                                <a
                                    href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
                                    className="absolute inset-0 z-10"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Play ${featuredVideo.title}`}
                                ></a>
                            </div>
                            {/* Featured Video Info */}
                            <div className="p-5">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
                                    {featuredVideo.title}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(featuredVideo.publishedAt)}</span>
                                    </div>
                                    <a
                                        href={`https://www.youtube.com/watch?v=${featuredVideo.youtubeId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Tonton di YouTube
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-lg h-full flex flex-col">
                            {/* Sidebar Header */}
                            <div className="bg-cyan-500 px-5 py-3 flex items-center gap-2">
                                <Play className="w-4 h-4 text-white fill-white" />
                                <span className="text-white font-bold text-sm">Video Lainnya</span>
                            </div>

                            {/* Sidebar Video List */}
                            <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-700/50">
                                {sidebarVideos.map((video) => (
                                    <a
                                        key={video.id}
                                        href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = "none";
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-7 h-7 rounded-full bg-black/50 flex items-center justify-center group-hover:bg-cyan-500/80 transition-colors">
                                                    <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* Video Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                                {video.title}
                                            </h4>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(video.publishedAt)}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>

                            {/* Sidebar Footer */}
                            <div className="p-4 border-t border-slate-100 dark:border-slate-700/50">
                                <Link
                                    href="https://www.youtube.com/@mediacenterhst"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
                                >
                                    Lihat Semua Video
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
