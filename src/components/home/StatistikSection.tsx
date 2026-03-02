"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Newspaper, Briefcase, Image as ImageIcon, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { supabaseSppd } from "@/lib/supabase-sppd";

type StatItem = {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    description: string;
    gradient: string;
    glowColor: string;
};

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;

                    const duration = 2000;
                    const fps = 60;
                    const totalFrames = (duration / 1000) * fps;
                    let frame = 0;

                    const tick = () => {
                        frame++;
                        // Ease-out cubic
                        const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
                        setCount(Math.round(progress * target));
                        if (frame < totalFrames) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref}>
            {count.toLocaleString("id-ID")}
            {suffix}
        </span>
    );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ stat, index }: { stat: StatItem; index: number }) {
    return (
        <div
            className="relative group overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-500 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Glow background on hover */}
            <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-linear-to-br ${stat.gradient}`}
            />

            {/* Top row: icon + trend */}
            <div className="flex items-start justify-between mb-5">
                <div
                    className={`w-14 h-14 rounded-2xl bg-linear-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                    {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent border border-slate-200 dark:border-slate-700`}>
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Aktif</span>
                </div>
            </div>

            {/* Counter */}
            <div className={`text-4xl md:text-5xl font-black mb-1 bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent tabular-nums`}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </div>

            {/* Label */}
            <p className="text-base font-bold text-slate-800 dark:text-white mb-1">{stat.label}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{stat.description}</p>

            {/* Bottom accent bar */}
            <div
                className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-linear-to-r ${stat.gradient} transition-all duration-500 rounded-b-2xl`}
            />
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function StatistikSection() {
    const [stats, setStats] = useState<StatItem[]>([
        {
            icon: <Briefcase className="h-7 w-7" />,
            value: 0,
            suffix: "+",
            label: "Layanan Publik",
            description: "Layanan online & offline tersedia",
            gradient: "from-cyan-500 to-blue-600",
            glowColor: "cyan",
        },
        {
            icon: <Newspaper className="h-7 w-7" />,
            value: 0,
            suffix: "+",
            label: "Berita Terbit",
            description: "Informasi terkini seputar Dinas",
            gradient: "from-emerald-500 to-teal-600",
            glowColor: "emerald",
        },
        {
            icon: <ImageIcon className="h-7 w-7" />,
            value: 0,
            suffix: "+",
            label: "Foto Kegiatan",
            description: "Dokumentasi berbagai kegiatan",
            gradient: "from-violet-500 to-purple-600",
            glowColor: "violet",
        },
        {
            icon: <Users className="h-7 w-7" />,
            value: 0,
            suffix: "+",
            label: "Pegawai",
            description: "SDM profesional melayani masyarakat",
            gradient: "from-amber-500 to-orange-600",
            glowColor: "amber",
        },
    ]);

    useEffect(() => {
        const fetchCounts = async () => {
            const [layanan, berita, galeri, pegawai] = await Promise.all([
                supabase.from("services").select("id", { count: "exact", head: true }),
                supabase.from("posts").select("id", { count: "exact", head: true }),
                supabase.from("galleries").select("id", { count: "exact", head: true }).eq("type", "Photo"),
                supabaseSppd.from("pegawai").select("id", { count: "exact", head: true }),
            ]);

            setStats((prev) => [
                { ...prev[0], value: layanan.count ?? prev[0].value },
                { ...prev[1], value: berita.count ?? prev[1].value },
                { ...prev[2], value: galeri.count ?? prev[2].value },
                { ...prev[3], value: pegawai.count ?? prev[3].value },
            ]);
        };

        fetchCounts();
    }, []);

    return (
        <section className="relative py-20 overflow-hidden bg-linear-to-b from-slate-50 to-sky-50/60 dark:from-slate-900 dark:to-slate-950">

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 left-1/4 w-[600px] h-[600px] bg-cyan-200/25 dark:bg-cyan-500/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-200/20 dark:bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-amber-200/15 dark:bg-amber-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Section header */}
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 text-sm font-semibold mb-5 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        Statistik Dinas
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
                        Angka yang{" "}
                        <span className="bg-linear-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                            Berbicara
                        </span>
                    </h2>
                    <div className="flex items-center justify-center gap-1 mb-4">
                        <div className="w-8 h-0.5 bg-cyan-500 rounded-full" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <div className="w-12 h-0.5 bg-cyan-500 rounded-full" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">
                        Data real-time pencapaian Dinas Komunikasi, Informatika, Statistik, dan Persandian.
                    </p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, i) => (
                        <StatCard key={i} stat={stat} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
