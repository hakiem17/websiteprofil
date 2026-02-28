import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Download, FileDown, FolderOpen } from "lucide-react";

export const metadata: Metadata = {
    title: "Unduhan",
    description: "Download dokumen dan formulir Pemerintah Daerah.",
};

export default function UnduhanPage() {
    const kategori = [
        {
            nama: "Formulir Layanan",
            files: [
                { nama: "Formulir Permohonan Informasi Publik", format: "PDF", ukuran: "125 KB" },
                { nama: "Formulir Pengajuan Keberatan", format: "PDF", ukuran: "98 KB" },
            ],
        },
        {
            nama: "Dokumen Perencanaan",
            files: [
                { nama: "Renstra 2022-2027", format: "PDF", ukuran: "2.4 MB" },
                { nama: "Renja 2026", format: "PDF", ukuran: "1.8 MB" },
                { nama: "IKU 2026", format: "PDF", ukuran: "560 KB" },
            ],
        },
        {
            nama: "Regulasi",
            files: [
                { nama: "Perda Kominfo DIY", format: "PDF", ukuran: "3.1 MB" },
                { nama: "Pergub Tata Kelola TIK", format: "PDF", ukuran: "1.2 MB" },
            ],
        },
    ];

    return (
        <>
            <PageHero
                title="Unduhan"
                subtitle="Dokumen dan formulir yang dapat diunduh"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Unduhan" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">
                    {kategori.map((kat, ki) => (
                        <div key={ki} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <FolderOpen className="h-5 w-5 text-cyan-600" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{kat.nama}</h2>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {kat.files.map((file, fi) => (
                                    <div key={fi} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <FileDown className="h-5 w-5 text-red-400 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium text-slate-800 dark:text-white text-sm">{file.nama}</p>
                                                <p className="text-xs text-slate-400">{file.format} • {file.ukuran}</p>
                                            </div>
                                        </div>
                                        <button className="inline-flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
