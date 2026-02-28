import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { BarChart3, TrendingUp, Users, Globe } from "lucide-react";

export const metadata: Metadata = {
    title: "Data Statistik",
    description: "Data statistik dan informasi publik Pemerintah Daerah.",
};

export default function DataStatistikPage() {
    const statistik = [
        { icon: Globe, label: "Website & Aplikasi Terkelola", value: "48", suffix: "Situs" },
        { icon: Users, label: "Jumlah ASN Diskominfo", value: "127", suffix: "Pegawai" },
        { icon: BarChart3, label: "Data Statistik Sektoral", value: "350+", suffix: "Dataset" },
        { icon: TrendingUp, label: "Layanan Digital Aktif", value: "24", suffix: "Layanan" },
    ];

    return (
        <>
            <PageHero
                title="Data Statistik"
                subtitle="Data dan informasi statistik sektoral"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Data Statistik" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statistik.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                                    <div className="h-12 w-12 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center mx-auto mb-3">
                                        <Icon className="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{item.value}</p>
                                    <p className="text-xs text-cyan-600 font-semibold">{item.suffix}</p>
                                    <p className="text-sm text-slate-500 mt-1">{item.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Statistik Sektoral</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                            Data statistik sektoral merupakan data yang dikumpulkan, diolah, dan dipublikasikan oleh perangkat daerah berdasarkan kebutuhan masing-masing sektor pembangunan. Data ini digunakan sebagai dasar perencanaan, monitoring, dan evaluasi pembangunan daerah.
                        </p>
                        <a href="https://satudata.jogjaprov.go.id" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                            Akses Satu Data DIY
                        </a>
                    </div>

                </div>
            </div>
        </>
    );
}
