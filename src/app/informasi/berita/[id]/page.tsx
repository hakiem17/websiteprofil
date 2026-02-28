"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowLeft, Calendar, Tag, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { use } from "react";

type Post = {
    id: string;
    title: string;
    slug: string;
    content: string;
    thumbnail_url: string | null;
    category: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
};

type RelatedPost = {
    id: string;
    title: string;
    thumbnail_url: string | null;
    published_at: string | null;
    category: string | null;
};

export default function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<Post | null>(null);
    const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .eq("is_published", true)
                .single();

            if (!error && data) {
                setPost(data as Post);

                // Fetch related posts (same category, exclude current)
                const { data: related } = await supabase
                    .from("posts")
                    .select("id, title, thumbnail_url, published_at, category")
                    .eq("is_published", true)
                    .neq("id", id)
                    .order("published_at", { ascending: false })
                    .limit(3);

                if (related) {
                    setRelatedPosts(related as RelatedPost[]);
                }
            }
            setLoading(false);
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <main>
                <PageHero
                    title="Memuat..."
                    subtitle=""
                    breadcrumbs={[
                        { label: "Beranda", href: "/" },
                        { label: "Berita", href: "/informasi/berita" },
                    ]}
                />
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!post) {
        return (
            <main>
                <PageHero
                    title="Berita Tidak Ditemukan"
                    subtitle="Artikel yang Anda cari tidak tersedia atau telah dihapus."
                    breadcrumbs={[
                        { label: "Beranda", href: "/" },
                        { label: "Berita", href: "/informasi/berita" },
                        { label: "Tidak Ditemukan" },
                    ]}
                />
                <div className="container mx-auto px-4 py-16 text-center">
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        Berita yang Anda cari mungkin sudah dihapus atau belum dipublikasikan.
                    </p>
                    <Link
                        href="/informasi/berita"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar Berita
                    </Link>
                </div>
            </main>
        );
    }

    const publishedDate = post.published_at
        ? format(new Date(post.published_at), "EEEE, dd MMMM yyyy", { locale: idLocale })
        : format(new Date(post.created_at), "EEEE, dd MMMM yyyy", { locale: idLocale });

    const readingTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1000));

    return (
        <main>
            <PageHero
                title={post.title}
                subtitle={publishedDate}
                breadcrumbs={[
                    { label: "Beranda", href: "/" },
                    { label: "Informasi", href: "/informasi" },
                    { label: "Berita", href: "/informasi/berita" },
                    { label: post.title },
                ]}
            />

            <article className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Meta Info Bar */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="h-4 w-4" />
                                {publishedDate}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {readingTime} menit baca
                            </span>
                            {post.category && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 rounded-full font-medium">
                                    <Tag className="h-3.5 w-3.5" />
                                    {post.category}
                                </span>
                            )}
                        </div>

                        {/* Thumbnail */}
                        {post.thumbnail_url && (
                            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
                                <Image
                                    src={post.thumbnail_url}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div
                            className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-12 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Share & Back */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
                            <Link
                                href="/informasi/berita"
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Daftar Berita
                            </Link>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: post.title,
                                            url: window.location.href,
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert("Link berhasil disalin!");
                                    }
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors"
                            >
                                <Share2 className="h-4 w-4" />
                                Bagikan Artikel
                            </button>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-12 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                            Berita Lainnya
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/informasi/berita/${related.id}`}
                                    className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-all group shadow-sm hover:shadow-md"
                                >
                                    <div className="h-40 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                                        {related.thumbnail_url ? (
                                            <Image
                                                src={related.thumbnail_url}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                <Tag className="h-10 w-10" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        {related.category && (
                                            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-1 block">
                                                {related.category}
                                            </span>
                                        )}
                                        <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                            {related.title}
                                        </h3>
                                        {related.published_at && (
                                            <span className="text-xs text-slate-400 mt-2 block">
                                                {format(new Date(related.published_at), "dd MMM yyyy", { locale: idLocale })}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
