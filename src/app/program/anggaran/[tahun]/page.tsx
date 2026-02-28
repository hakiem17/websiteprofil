import { PageHero } from "@/components/layout/PageHero";
import { FileText, Download, Calendar } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ tahun: string }>;
}

// Sample program data per year
const programData: Record<string, { program: string; kegiatan: string; subKegiatan: string; pagu: string; sumber: string }[]> = {
    "2022": [
        { program: "Program Penunjang Urusan Pemerintahan Daerah", kegiatan: "Administrasi Keuangan Perangkat Daerah", subKegiatan: "Penyediaan Gaji dan Tunjangan ASN", pagu: "8.500.000.000", sumber: "APBD" },
        { program: "Program Informasi dan Komunikasi Publik", kegiatan: "Pengelolaan Informasi dan Komunikasi Publik", subKegiatan: "Pengelolaan Konten dan Perencanaan Media", pagu: "850.000.000", sumber: "APBD" },
        { program: "Program Aplikasi Informatika", kegiatan: "Pengelolaan e-Government", subKegiatan: "Pengembangan Aplikasi dan Proses Bisnis Pemerintahan", pagu: "1.200.000.000", sumber: "APBD" },
    ],
    "2023": [
        { program: "Program Penunjang Urusan Pemerintahan Daerah", kegiatan: "Administrasi Keuangan Perangkat Daerah", subKegiatan: "Penyediaan Gaji dan Tunjangan ASN", pagu: "9.100.000.000", sumber: "APBD" },
        { program: "Program Informasi dan Komunikasi Publik", kegiatan: "Pengelolaan Informasi dan Komunikasi Publik", subKegiatan: "Monitoring Opini dan Aspirasi Publik", pagu: "450.000.000", sumber: "APBD" },
        { program: "Program Aplikasi Informatika", kegiatan: "Pengelolaan Nama Domain & Keamanan Informasi", subKegiatan: "Pengelolaan Keamanan Informasi", pagu: "650.000.000", sumber: "APBD" },
        { program: "Program Penyelenggaraan Statistik Sektoral", kegiatan: "Penyelenggaraan Statistik Sektoral", subKegiatan: "Koordinasi dan Sinkronisasi Pengumpulan Data Statistik", pagu: "320.000.000", sumber: "APBD" },
    ],
    "2024": [
        { program: "Program Penunjang Urusan Pemerintahan Daerah", kegiatan: "Administrasi Keuangan Perangkat Daerah", subKegiatan: "Penyediaan Gaji dan Tunjangan ASN", pagu: "9.800.000.000", sumber: "APBD" },
        { program: "Program Informasi dan Komunikasi Publik", kegiatan: "Pengelolaan Informasi dan Komunikasi Publik", subKegiatan: "Pengelolaan Konten dan Perencanaan Media", pagu: "950.000.000", sumber: "APBD" },
        { program: "Program Aplikasi Informatika", kegiatan: "Pengelolaan e-Government", subKegiatan: "Pengembangan Aplikasi dan Proses Bisnis Pemerintahan", pagu: "1.500.000.000", sumber: "APBD" },
        { program: "Program Aplikasi Informatika", kegiatan: "Pengelolaan Infrastruktur TIK", subKegiatan: "Pengelolaan Pusat Data dan Jaringan", pagu: "2.100.000.000", sumber: "APBD" },
        { program: "Program Penyelenggaraan Persandian", kegiatan: "Penyelenggaraan Persandian untuk Pengamanan Informasi", subKegiatan: "Analisis Sinyal dan Keamanan Siber", pagu: "380.000.000", sumber: "APBD" },
    ],
    "2025": [
        { program: "Program Penunjang Urusan Pemerintahan Daerah", kegiatan: "Administrasi Keuangan Perangkat Daerah", subKegiatan: "Penyediaan Gaji dan Tunjangan ASN", pagu: "10.200.000.000", sumber: "APBD" },
        { program: "Program Informasi dan Komunikasi Publik", kegiatan: "Pengelolaan Informasi dan Komunikasi Publik", subKegiatan: "Pengelolaan Media Komunikasi Publik", pagu: "1.050.000.000", sumber: "APBD" },
        { program: "Program Aplikasi Informatika", kegiatan: "Pengelolaan e-Government", subKegiatan: "Layanan Manajemen Data Informasi e-Government", pagu: "1.800.000.000", sumber: "APBD" },
        { program: "Program Penyelenggaraan Statistik Sektoral", kegiatan: "Penyelenggaraan Statistik Sektoral", subKegiatan: "Koordinasi dan Sinkronisasi Pengumpulan Data Statistik", pagu: "400.000.000", sumber: "APBD" },
    ],
    "2026": [
        { program: "Program Penunjang Urusan Pemerintahan Daerah", kegiatan: "Administrasi Keuangan Perangkat Daerah", subKegiatan: "Penyediaan Gaji dan Tunjangan ASN", pagu: "10.850.000.000", sumber: "APBD" },
        { program: "Program Informasi dan Komunikasi Publik", kegiatan: "Pengelolaan Informasi dan Komunikasi Publik", subKegiatan: "Pengelolaan Konten dan Perencanaan Media", pagu: "1.150.000.000", sumber: "APBD" },
        { program: "Program Aplikasi Informatika", kegiatan: "Pengelolaan e-Government", subKegiatan: "Pengembangan Aplikasi dan Proses Bisnis Pemerintahan", pagu: "2.000.000.000", sumber: "APBD" },
        { program: "Program Aplikasi Informatika", kegiatan: "Pengelolaan Infrastruktur TIK", subKegiatan: "Pengelolaan Pusat Data dan Jaringan", pagu: "2.500.000.000", sumber: "APBD" },
        { program: "Program Penyelenggaraan Persandian", kegiatan: "penyelenggaraan Persandian untuk Pengamanan Informasi", subKegiatan: "Analisis Sinyal dan Keamanan Siber", pagu: "450.000.000", sumber: "APBD" },
    ],
};

const allYears = ["2022", "2023", "2024", "2025", "2026"];

export default async function AnggaranTahunPage({ params }: PageProps) {
    const { tahun } = await params;
    const data = programData[tahun] || [];

    return (
        <>
            <PageHero
                title={`Anggaran Program / Kegiatan ${tahun}`}
                subtitle={`Rincian program dan kegiatan Tahun Anggaran ${tahun}`}
                breadcrumbs={[
                    { label: "Program", href: "/program/anggaran/2026" },
                    { label: `Tahun Anggaran ${tahun}` },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Year Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {allYears.map((y) => (
                            <Link
                                key={y}
                                href={`/program/anggaran/${y}`}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${y === tahun
                                    ? "bg-cyan-600 text-white shadow-md"
                                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-700"
                                    }`}
                            >
                                TA {y}
                            </Link>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-cyan-600" />
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tahun Anggaran {tahun}</h2>
                            </div>
                            <span className="text-sm text-slate-400">{data.length} item</span>
                        </div>

                        {data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-10">No</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Program</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Kegiatan</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sub Kegiatan</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Pagu (Rp)</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sumber</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {data.map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                                                <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-medium">{item.program}</td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.kegiatan}</td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.subKegiatan}</td>
                                                <td className="px-4 py-3 text-right font-mono text-slate-700 dark:text-slate-200 whitespace-nowrap">{item.pagu}</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-400 text-xs font-semibold rounded">{item.sumber}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500">Data anggaran untuk tahun {tahun} belum tersedia.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}
