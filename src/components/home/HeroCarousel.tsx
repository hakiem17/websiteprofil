"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import Image from "next/image";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type Post = Database["public"]["Tables"]["posts"]["Row"];

type SlideItem = {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    tag: string;
    image: string;
    color: string;
};

// Gradient presets for slides
const GRADIENTS = [
    "from-blue-600 to-cyan-500",
    "from-emerald-600 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-purple-600 to-pink-500",
    "from-indigo-600 to-blue-500"
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [slides, setSlides] = useState<SlideItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select("*")
                    .eq("is_published", true)
                    .order("created_at", { ascending: false })
                    .limit(5);

                if (error) throw error;

                if (data && data.length > 0) {
                    const mappedSlides = (data as Post[]).map((post, index) => ({
                        id: post.id,
                        title: post.title,
                        excerpt: post.content
                            ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 120) + "..."
                            : "Tidak ada ringkasan.",
                        date: post.published_at
                            ? format(new Date(post.published_at), "dd MMM yyyy", { locale: idLocale })
                            : format(new Date(post.created_at), "dd MMM yyyy", { locale: idLocale }),
                        tag: "Berita Utama",
                        image: post.thumbnail_url || "",
                        color: GRADIENTS[index % GRADIENTS.length]
                    }));
                    setSlides(mappedSlides);
                } else {
                    // Fallback if no data (optional: or just empty)
                    setSlides([]);
                }
            } catch (error) {
                console.error("Error fetching carousel slides:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    const next = useCallback(() => {
        if (slides.length === 0) return;
        setCurrent((c) => (c + 1) % slides.length);
    }, [slides.length]);

    const prev = useCallback(() => {
        if (slides.length === 0) return;
        setCurrent((c) => (c - 1 + slides.length) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (isPaused || slides.length === 0) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [isPaused, next, slides.length]);

    if (loading) {
        return (
            <section className="relative min-h-[520px] md:min-h-[600px] bg-slate-100 dark:bg-slate-900 animate-pulse">
                <div className="container mx-auto px-4 pt-20">
                    <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                </div>
            </section>
        );
    }

    if (slides.length === 0) {
        // Show fallback or nothing. Showing simple placeholder.
        return (
            <section className="relative min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center text-slate-500">
                    <p>Belum ada berita utama ditampilkan.</p>
                </div>
            </section>
        );
    }

    const slide = slides[current];

    return (
        <section
            className="relative min-h-[520px] md:min-h-[600px] bg-linear-to-b from-sky-100 via-cyan-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background glow */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-300/20 dark:bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 pt-12 md:pt-20 pb-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    {/* Left: Image area */}
                    <div className="md:col-span-7 relative">
                        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 shadow-xl dark:shadow-2xl dark:shadow-black/30 border border-slate-200 dark:border-slate-700/50">
                            {/* Gradient placeholder */}
                            <div className={`absolute inset-0 bg-linear-to-br ${slide.color} opacity-20`} />
                            {slide.image ? (
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className={`w-24 h-24 mx-auto rounded-2xl bg-linear-to-br ${slide.color} flex items-center justify-center shadow-lg`}>
                                            <span className="text-white text-4xl font-black">{current + 1}</span>
                                        </div>
                                        <p className="text-slate-400 dark:text-slate-400 text-sm">Featured Image</p>
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            <div className="absolute top-4 left-4">
                                <span className="bg-cyan-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                    {slide.tag}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm text-slate-700 dark:text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                    <Calendar className="h-3 w-3" />
                                    {slide.date}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="md:col-span-5 space-y-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-2">
                                {slide.title}
                            </h2>
                            <div className="w-16 h-1 bg-cyan-500 rounded-full mb-6" />
                            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                                {slide.excerpt}
                            </p>
                        </div>
                        <a href={`/informasi/berita/${slide.id}`} className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white font-bold px-6 py-3 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-cyan-500/20">
                            Baca Selengkapnya
                            <ChevronRight className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-6 mt-10">
                    <button
                        onClick={prev}
                        className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white hover:border-cyan-500 transition-all flex items-center justify-center"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === current
                                    ? "w-8 bg-cyan-500"
                                    : "w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white hover:border-cyan-500 transition-all flex items-center justify-center"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
