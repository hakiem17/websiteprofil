"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            router.push("/admin");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full">
            {/* Left Side - Deep Blue Branding */}
            <div className="hidden lg:flex w-1/2 bg-[#0f172a] relative flex-col justify-between p-12 text-white overflow-hidden">
                {/* Background Pattern/Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-900/20 to-slate-900/50 pointer-events-none" />
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />

                {/* Top Brand */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
                        <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-medium tracking-wide">Admin System Website Profil</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Kelola Informasi <br />
                        <span className="text-blue-400">Lebih Mudah</span> & <br />
                        Terintegrasi.
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                        Platform manajemen konten terpusat untuk Website Profil Pemerintah Daerah.
                        Publikasikan berita, layanan, dan informasi publik secara efisien.
                    </p>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-blue-500 rounded-full" />
                        <span className="text-sm text-slate-400 font-medium">Pemerintah Daerah</span>
                    </div>
                    <p className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} Diskominfo. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-slate-950 flex flex-col justify-center p-8 md:p-12 lg:p-24 relative">
                <Link
                    href="/"
                    className="absolute top-8 left-8 text-slate-500 hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                </Link>

                <div className="max-w-md w-full mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Selamat Datang</h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Silakan masuk menggunakan akun yang terdaftar
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                                Email / Username
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                    placeholder="admin@example.com"
                                />
                                <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                    Lupa password?
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1e293b] text-white py-3.5 rounded-xl font-semibold hover:bg-[#0f172a] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Masuk ke Dashboard"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400">
                            Belum punya akun? <span className="text-slate-600 dark:text-slate-300">Hubungi Administrator Diskominfo.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
