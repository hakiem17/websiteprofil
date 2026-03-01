import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ShoppingCart, ExternalLink, FileText } from "lucide-react";
import { getInformasiPage } from "@/lib/informasi-service";

export const metadata: Metadata = {
    title: "Pengadaan",
    description: "Informasi pengadaan barang dan jasa Pemerintah Daerah.",
};

export default async function PengadaanPage() {
    const page = await getInformasiPage("pengadaan");
    const pengadaan = [
        { judul: "Pengadaan Perangkat Jaringan 2026", status: "Proses", deadline: "28 Februari 2026", nilai: "Rp 450.000.000" },
        { judul: "Pengadaan Server dan Storage 2026", status: "Perencanaan", deadline: "15 Maret 2026", nilai: "Rp 1.200.000.000" },
        { judul: "Jasa Konsultan IT 2025", status: "Selesai", deadline: "30 November 2025", nilai: "Rp 320.000.000" },
        { judul: "Pengadaan Lisensi Software 2025", status: "Selesai", deadline: "30 September 2025", nilai: "Rp 180.000.000" },
    ];

    const statusColors: Record<string, string> = {
        "Proses": "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
        "Perencanaan": "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
        "Selesai": "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400",
    };

    return (
        <>
            <PageHero
                title="Pengadaan Barang / Jasa"
                subtitle="Informasi pengadaan barang dan jasa pemerintah"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Pengadaan Barang / Jasa" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    {page?.content && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                            <article className="prose prose-slate dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: page.content }} />
                            </article>
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Informasi pengadaan barang dan jasa di lingkungan Dinas Komunikasi dan Informatika. Untuk informasi lengkap, silakan akses portal LPSE.
                        </p>
                        <a href="https://lpse.jogjaprov.go.id" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mt-3">
                            Akses LPSE <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <ShoppingCart className="h-5 w-5 text-cyan-600" />
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Daftar Pengadaan</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">No</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Paket Pengadaan</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nilai</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Batas Waktu</th>
                                        <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {pengadaan.map((item, index) => (
                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                                            <td className="px-6 py-4 font-medium text-slate-800 dark:text-white">{item.judul}</td>
                                            <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">{item.nilai}</td>
                                            <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{item.deadline}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[item.status] || ""}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
