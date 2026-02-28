"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Database } from "@/types/supabase";

type Post = Database["public"]["Tables"]["posts"]["Row"];

type NewsItem = {
    id: string; // Changed to string UUID
    title: string;
    excerpt: string;
    date: string;
    category: string;
    thumbnail_url?: string | null;
};

export function BeritaTerkini() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select("id, title, content, published_at, thumbnail_url, created_at, category")
                    .eq("is_published", true)
                    .order("published_at", { ascending: false })
                    .limit(3);

                if (error) throw error;

                if (data) {
                    const mappedNews = (data as any[]).map((item) => ({
                        id: item.id,
                        title: item.title,
                        // Create excerpt from content (strip HTML tags if any, limit length)
                        excerpt: item.content
                            ? item.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."
                            : "Tidak ada deskripsi.",
                        date: item.published_at
                            ? format(new Date(item.published_at), "dd MMM yyyy", { locale: idLocale })
                            : format(new Date(item.created_at), "dd MMM yyyy", { locale: idLocale }),
                        category: item.category || "Berita",
                        thumbnail_url: item.thumbnail_url
                    }));
                    setNewsItems(mappedNews);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <section className="py-20 bg-linear-to-b from-cyan-50 to-sky-50 dark:from-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4">
                {/* Section Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-4 shadow-sm dark:shadow-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        Informasi
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">Berita Terbaru</h2>
                    <div className="flex items-center justify-center gap-1 mb-4">
                        <div className="w-8 h-0.5 bg-cyan-500 rounded-full" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <div className="w-12 h-0.5 bg-cyan-500 rounded-full" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Berita dan informasi terbaru dari Pemerintah Daerah.
                    </p>
                </div>

                {/* News Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 h-[400px] animate-pulse">
                                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4" />
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4" />
                            </div>
                        ))
                    ) : newsItems.length === 0 ? (
                        <div className="col-span-3 text-center py-12 text-slate-500 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                            Belum ada berita yang dipublikasikan.
                        </div>
                    ) : (
                        newsItems.map((news) => (
                            <Link
                                href={`/informasi/berita/${news.id}`} // Assuming detailed page logic handles this ID
                                key={news.id}
                                className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-all group cursor-pointer shadow-sm dark:shadow-none hover:shadow-md block"
                            >
                                {/* Image placeholder or thumbnail */}
                                <div className="h-48 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                                    {news.thumbnail_url ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={news.thumbnail_url}
                                                alt={news.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700/50 flex items-center justify-center text-slate-400 dark:text-slate-500">
                                                <FileText className="h-8 w-8" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20 mb-3">
                                        {news.category}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                        {news.title}
                                    </h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                                        {news.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700/50">
                                        <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" />
                                            {news.date}
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold text-sm hover:gap-2 transition-all">
                                            Baca <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {/* CTA */}
                <div className="text-center mt-10">
                    <Link
                        href="/informasi/berita"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white font-bold hover:bg-white dark:hover:bg-slate-800 hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all shadow-sm dark:shadow-none"
                    >
                        Lihat Semua Informasi <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

