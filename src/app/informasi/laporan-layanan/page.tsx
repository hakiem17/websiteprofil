import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { FileBarChart, Download } from "lucide-react";

export const metadata: Metadata = {
    title: "Laporan Layanan",
    description: "Laporan kinerja dan layanan Pemerintah Daerah.",
};

export default function LaporanLayananPage() {
    const laporan = [
        { tahun: "2025", judul: "Laporan Layanan Informasi Publik Semester I 2025", jumlahPermohonan: 42 },
        { tahun: "2024", judul: "Laporan Layanan Informasi Publik Tahun 2024", jumlahPermohonan: 128 },
        { tahun: "2023", judul: "Laporan Layanan Informasi Publik Tahun 2023", jumlahPermohonan: 95 },
        { tahun: "2022", judul: "Laporan Layanan Informasi Publik Tahun 2022", jumlahPermohonan: 87 },
    ];

    return (
        <>
            <PageHero
                title="Laporan Layanan Informasi Publik"
                subtitle="Rekapitulasi pelayanan informasi publik"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Laporan Layanan Informasi Publik" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-6">
                    {laporan.map((item, index) => (
                        <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                    <FileBarChart className="h-7 w-7 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800 dark:text-white">{item.judul}</h3>
                                    <p className="text-sm text-slate-500 mt-1">Total permohonan: <span className="font-semibold text-cyan-600">{item.jumlahPermohonan}</span> permohonan</p>
                                    <button className="inline-flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 font-medium mt-3">
                                        <Download className="h-4 w-4" />
                                        Unduh Laporan
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
