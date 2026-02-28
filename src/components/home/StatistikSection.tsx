"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Newspaper, Briefcase, Building } from "lucide-react";

type StatItem = {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
    color: string;
};

const stats: StatItem[] = [
    {
        icon: <Briefcase className="h-7 w-7" />,
        value: 48,
        suffix: "+",
        label: "Layanan Publik",
        color: "from-cyan-500 to-blue-500",
    },
    {
        icon: <Newspaper className="h-7 w-7" />,
        value: 520,
        suffix: "+",
        label: "Berita Terbit",
        color: "from-emerald-500 to-teal-500",
    },
    {
        icon: <Building className="h-7 w-7" />,
        value: 24,
        suffix: "",
        label: "Program Aktif",
        color: "from-amber-500 to-orange-500",
    },
    {
        icon: <Users className="h-7 w-7" />,
        value: 1200,
        suffix: "+",
        label: "Pegawai",
        color: "from-purple-500 to-pink-500",
    },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        const duration = 1500;
        const steps = 40;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [started, target]);

    return (
        <div ref={ref} className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            {count.toLocaleString("id-ID")}{suffix}
        </div>
    );
}

export function StatistikSection() {
    return (
        <section className="py-20 bg-linear-to-b from-sky-50 to-cyan-50 dark:from-slate-900 dark:to-slate-950 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-cyan-200/30 dark:bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 md:p-8 text-center hover:border-cyan-400 dark:hover:border-cyan-500/30 transition-all group shadow-sm dark:shadow-none hover:shadow-md"
                        >
                            <div className={`w-14 h-14 mx-auto mb-5 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                                {stat.icon}
                            </div>
                            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
