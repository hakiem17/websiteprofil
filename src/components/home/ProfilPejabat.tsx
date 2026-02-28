"use client";

import { useEffect, useState } from "react";
import { supabaseSppd } from "@/lib/supabase-sppd";
import { Pegawai } from "@/types/pegawai";
import { User, UserCircle2 } from "lucide-react";

export function ProfilPejabat() {
    const [pejabat, setPejabat] = useState<Pegawai[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPejabat() {
            try {
                // Fetching all pegawai for now. 
                // In a real scenario, we might want to filter by specific 'jabatan' or 'eselon'
                // e.g. .not('jabatan_dinas', 'is', null)
                const { data, error } = await supabaseSppd
                    .from("pegawai")
                    .select("*")
                    .not("jabatan_dinas", "is", null) // Filter those with a position
                    .order("created_at", { ascending: true }) // Adjust ordering as needed
                    .limit(8); // Limit to top 8 for the landing page

                if (error) throw error;
                setPejabat(data || []);
            } catch (err) {
                console.error("Error fetching pejabat:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchPejabat();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-slate-50 dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Profil Pejabat</h2>
                        <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-[280px] animate-pulse">
                                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-4"></div>
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-2"></div>
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (pejabat.length === 0) return null;

    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Profil Pejabat</h2>
                    <div className="w-24 h-1 bg-blue-600 rounded-full"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-400 text-center max-w-2xl">
                        Mengenal lebih dekat para pejabat di lingkungan dinas kami
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pejabat.map((p) => (
                        <div
                            key={p.id}
                            className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-blue-100 dark:hover:border-blue-900 transition-all duration-300 flex flex-col items-center text-center"
                        >
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    {p.nama_pegawai.charAt(0)}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-4 border-white dark:border-slate-800">
                                    <User className="h-3 w-3" />
                                </div>
                            </div>

                            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                                {p.nama_pegawai}
                            </h3>

                            <div className="w-full h-px bg-slate-100 dark:bg-slate-700 my-3"></div>

                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                                {p.jabatan_dinas || "-"}
                            </p>

                            <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full">
                                NIP. {p.nip || "-"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
