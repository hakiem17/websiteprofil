"use client";

import { useState, useEffect, useCallback } from "react";
import {
    X, Type, Minus, Plus, Eye, EyeOff, MousePointer,
    RotateCcw, Accessibility, Highlighter, Link2, BookOpen,
    ALargeSmall, Baseline, Bold, Contrast, SunMedium, SunDim,
    Palette, Droplets, MonitorOff,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

type A11yState = {
    fontSize: number;          // percentage 100-200
    highlightTitles: boolean;
    highlightLinks: boolean;
    dyslexiaFont: boolean;
    letterSpacing: boolean;
    lineHeight: boolean;
    fontWeight: boolean;
    contrastMode: "none" | "dark" | "light" | "high";
    saturation: "normal" | "high" | "low";
    monochrome: boolean;
    hideImages: boolean;
    readingGuide: boolean;
    stopAnimations: boolean;
    largeCursor: boolean;
};

const defaultState: A11yState = {
    fontSize: 100,
    highlightTitles: false,
    highlightLinks: false,
    dyslexiaFont: false,
    letterSpacing: false,
    lineHeight: false,
    fontWeight: false,
    contrastMode: "none",
    saturation: "normal",
    monochrome: false,
    hideImages: false,
    readingGuide: false,
    stopAnimations: false,
    largeCursor: false,
};

function OptionCard({
    icon: Icon,
    label,
    active,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center",
                active
                    ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
            )}
        >
            <Icon className="w-5 h-5" />
            <span className="text-[11px] font-medium leading-tight">{label}</span>
        </button>
    );
}

export function AccessibilityPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState<A11yState>(defaultState);
    const { setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [guideY, setGuideY] = useState(300);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        // Load saved state
        try {
            const saved = localStorage.getItem("a11y-settings");
            if (saved) {
                const parsed = JSON.parse(saved);
                setState({ ...defaultState, ...parsed });
            }
        } catch { }
    }, []);

    // Persist state
    useEffect(() => {
        if (!mounted) return;
        localStorage.setItem("a11y-settings", JSON.stringify(state));
    }, [state, mounted]);

    // Apply all effects
    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;

        // Font size
        root.style.fontSize = state.fontSize === 100 ? "" : `${state.fontSize}%`;

        // Highlight titles
        root.classList.toggle("a11y-highlight-titles", state.highlightTitles);

        // Highlight links
        root.classList.toggle("a11y-highlight-links", state.highlightLinks);

        // Dyslexia font - dynamically load font
        root.classList.toggle("a11y-dyslexia-font", state.dyslexiaFont);
        if (state.dyslexiaFont) {
            let link = document.getElementById("a11y-dyslexia-font-link") as HTMLLinkElement | null;
            if (!link) {
                link = document.createElement("link");
                link.id = "a11y-dyslexia-font-link";
                link.rel = "stylesheet";
                link.href = "https://fonts.cdnfonts.com/css/opendyslexic";
                document.head.appendChild(link);
            }
        }

        // Letter spacing
        root.classList.toggle("a11y-letter-spacing", state.letterSpacing);

        // Line height
        root.classList.toggle("a11y-line-height", state.lineHeight);

        // Font weight
        root.classList.toggle("a11y-font-weight", state.fontWeight);

        // Contrast modes
        root.classList.remove("a11y-contrast-high");
        if (state.contrastMode === "dark") {
            setTheme("dark");
        } else if (state.contrastMode === "light") {
            setTheme("light");
        } else if (state.contrastMode === "high") {
            root.classList.add("a11y-contrast-high");
        }

        // Saturation
        root.classList.remove("a11y-saturate-high", "a11y-saturate-low");
        if (state.saturation === "high") root.classList.add("a11y-saturate-high");
        if (state.saturation === "low") root.classList.add("a11y-saturate-low");

        // Monochrome
        root.classList.toggle("a11y-monochrome", state.monochrome);

        // Hide images
        root.classList.toggle("a11y-hide-images", state.hideImages);

        // Stop animations
        root.classList.toggle("a11y-stop-animations", state.stopAnimations);

        // Large cursor
        root.classList.toggle("a11y-large-cursor", state.largeCursor);

    }, [state, mounted, setTheme]);

    // Reading guide mouse tracker
    useEffect(() => {
        if (!state.readingGuide) return;
        const handler = (e: MouseEvent) => setGuideY(e.clientY);
        window.addEventListener("mousemove", handler);
        return () => window.removeEventListener("mousemove", handler);
    }, [state.readingGuide]);

    const toggle = useCallback((key: keyof A11yState) => {
        setState((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const reset = useCallback(() => {
        setState(defaultState);
        document.documentElement.style.fontSize = "";
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Reading Guide overlay */}
            {state.readingGuide && (
                <div
                    className="fixed left-0 w-full h-1 bg-cyan-500/60 pointer-events-none z-[9999]"
                    style={{ top: guideY - 2 }}
                />
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-linear-to-b from-cyan-600 to-teal-700 text-white p-3 rounded-l-xl shadow-lg hover:shadow-xl hover:from-cyan-500 hover:to-teal-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    aria-label="Buka Menu Aksesibilitas"
                    title="Menu Aksesibilitas"
                >
                    <Accessibility className="h-6 w-6" />
                </button>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Panel */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full w-full sm:w-[380px] bg-slate-50 dark:bg-slate-900 shadow-2xl z-[70] transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="bg-linear-to-r from-cyan-700 to-teal-700 px-5 py-4 flex items-center justify-between flex-shrink-0">
                    <h3 className="font-bold text-lg text-white">Menu Aksesibilitas</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">

                    {/* Section: Penyesuaian Konten */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                            Penyesuaian Konten
                        </h4>

                        {/* Font Size */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-3">
                            <div className="flex items-center gap-2 mb-3">
                                <ALargeSmall className="w-4 h-4 text-cyan-600" />
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Sesuaikan Ukuran Font</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setState((s) => ({ ...s, fontSize: Math.max(80, s.fontSize - 10) }))}
                                    className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-2xl font-bold text-slate-800 dark:text-white">
                                    {state.fontSize}%
                                </span>
                                <button
                                    onClick={() => setState((s) => ({ ...s, fontSize: Math.min(200, s.fontSize + 10) }))}
                                    className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content Options Grid */}
                        <div className="grid grid-cols-3 gap-2">
                            <OptionCard icon={Type} label="Sorot Judul" active={state.highlightTitles} onClick={() => toggle("highlightTitles")} />
                            <OptionCard icon={Link2} label="Sorot Tautan" active={state.highlightLinks} onClick={() => toggle("highlightLinks")} />
                            <OptionCard icon={BookOpen} label="Font Disleksia" active={state.dyslexiaFont} onClick={() => toggle("dyslexiaFont")} />
                            <OptionCard icon={Baseline} label="Jarak Huruf" active={state.letterSpacing} onClick={() => toggle("letterSpacing")} />
                            <OptionCard icon={Highlighter} label="Tinggi Baris" active={state.lineHeight} onClick={() => toggle("lineHeight")} />
                            <OptionCard icon={Bold} label="Ketebalan Font" active={state.fontWeight} onClick={() => toggle("fontWeight")} />
                        </div>
                    </div>

                    {/* Section: Penyesuaian Warna */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                            Penyesuaian Warna
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                            <OptionCard
                                icon={Contrast}
                                label="Kontras Gelap"
                                active={state.contrastMode === "dark"}
                                onClick={() => setState((s) => ({ ...s, contrastMode: s.contrastMode === "dark" ? "none" : "dark" }))}
                            />
                            <OptionCard
                                icon={SunMedium}
                                label="Kontras Terang"
                                active={state.contrastMode === "light"}
                                onClick={() => setState((s) => ({ ...s, contrastMode: s.contrastMode === "light" ? "none" : "light" }))}
                            />
                            <OptionCard
                                icon={SunDim}
                                label="Kontras Tinggi"
                                active={state.contrastMode === "high"}
                                onClick={() => setState((s) => ({ ...s, contrastMode: s.contrastMode === "high" ? "none" : "high" }))}
                            />
                            <OptionCard
                                icon={Palette}
                                label="Saturasi Tinggi"
                                active={state.saturation === "high"}
                                onClick={() => setState((s) => ({ ...s, saturation: s.saturation === "high" ? "normal" : "high" }))}
                            />
                            <OptionCard
                                icon={Droplets}
                                label="Saturasi Rendah"
                                active={state.saturation === "low"}
                                onClick={() => setState((s) => ({ ...s, saturation: s.saturation === "low" ? "normal" : "low" }))}
                            />
                            <OptionCard
                                icon={MonitorOff}
                                label="Monokrom"
                                active={state.monochrome}
                                onClick={() => toggle("monochrome")}
                            />
                        </div>
                    </div>

                    {/* Section: Alat */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                            Alat
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                            <OptionCard icon={EyeOff} label="Sembunyikan Gambar" active={state.hideImages} onClick={() => toggle("hideImages")} />
                            <OptionCard icon={Eye} label="Panduan Membaca" active={state.readingGuide} onClick={() => toggle("readingGuide")} />
                            <OptionCard icon={MonitorOff} label="Hentikan Animasi" active={state.stopAnimations} onClick={() => toggle("stopAnimations")} />
                            <OptionCard icon={MousePointer} label="Kursor Besar" active={state.largeCursor} onClick={() => toggle("largeCursor")} />
                        </div>
                    </div>
                </div>

                {/* Reset Button - fixed at bottom */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <button
                        onClick={reset}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 text-white font-semibold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Atur Ulang Pengaturan
                    </button>
                </div>
            </div>
        </>
    );
}
