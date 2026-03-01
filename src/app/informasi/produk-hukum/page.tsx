import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Scale, Download, Search } from "lucide-react";
import { getInformasiPage } from "@/lib/informasi-service";

export const metadata: Metadata = {
    title: "Produk Hukum",
    description: "Produk hukum dan peraturan Pemerintah Daerah.",
};

export default async function ProdukHukumPage() {
    const page = await getInformasiPage("produk-hukum");
    const produkHukum = [
        { jenis: "Peraturan Daerah", nomor: "No. 3 Tahun 2024", judul: "Penyelenggaraan Komunikasi dan Informatika", tahun: "2024" },
        { jenis: "Peraturan Gubernur", nomor: "No. 15 Tahun 2023", judul: "Tata Kelola Teknologi Informasi dan Komunikasi", tahun: "2023" },
        { jenis: "Keputusan Gubernur", nomor: "No. 45/KEP/2023", judul: "Penetapan PPID Pelaksana", tahun: "2023" },
        { jenis: "Peraturan Gubernur", nomor: "No. 8 Tahun 2022", judul: "Kebijakan Keamanan Informasi", tahun: "2022" },
        { jenis: "Peraturan Daerah", nomor: "No. 7 Tahun 2022", judul: "Penyelenggaraan Statistik Sektoral", tahun: "2022" },
        { jenis: "Instruksi Gubernur", nomor: "No. 1 Tahun 2022", judul: "Percepatan Transformasi Digital", tahun: "2022" },
    ];

    return (
        <>
            <PageHero
                title="Produk Hukum"
                subtitle="Peraturan dan kebijakan terkait komunikasi dan informatika"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Produk Hukum" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
                                <Scale className="h-5 w-5" />
                            </div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Daftar Produk Hukum</h2>
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {produkHukum.map((item, index) => (
                                <div key={index} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 mb-2">{item.jenis}</span>
                                            <h3 className="font-bold text-slate-800 dark:text-white">{item.judul}</h3>
                                            <p className="text-sm text-slate-500 mt-1">{item.nomor} • Tahun {item.tahun}</p>
                                        </div>
                                        <button className="inline-flex items-center gap-1.5 text-sm text-cyan-600 hover:text-cyan-700 font-medium flex-shrink-0">
                                            <Download className="h-4 w-4" />
                                            Unduh
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
