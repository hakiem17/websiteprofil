import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ArrowRight, ClipboardList, UserCheck, Building, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Alur Kunjungan",
    description: "Prosedur dan alur kunjungan ke kantor Pemerintah Daerah.",
};

export default function AlurKunjunganPage() {
    const langkah = [
        { icon: ClipboardList, judul: "Registrasi Online", deskripsi: "Isi formulir pendaftaran kunjungan melalui website atau hubungi kontak kami untuk konfirmasi jadwal." },
        { icon: UserCheck, judul: "Konfirmasi Jadwal", deskripsi: "Tim kami akan mengkonfirmasi jadwal dan agenda kunjungan melalui email atau WhatsApp." },
        { icon: Building, judul: "Kunjungan", deskripsi: "Tamu datang sesuai jadwal yang telah disepakati. Silakan lapor ke bagian resepsionis saat tiba." },
        { icon: CheckCircle, judul: "Pelaksanaan Kegiatan", deskripsi: "Kegiatan kunjungan dilaksanakan sesuai agenda yang telah disetujui. Dokumentasi akan disiapkan." },
    ];

    return (
        <>
            <PageHero
                title="Alur Kunjungan Ke Diskominfo"
                subtitle="Prosedur dan tata cara kunjungan ke kantor dinas"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Alur Kunjungan" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Tata Cara Kunjungan</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Untuk mengunjungi Dinas Komunikasi dan Informatika, silakan ikuti alur berikut ini. Kunjungan dapat berupa studi banding, benchmarking, magang, atau kerja sama.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-0">
                        {langkah.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="relative">
                                    <div className="flex gap-6">
                                        {/* Line */}
                                        <div className="flex flex-col items-center">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-linear-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold text-xl mb-4 md:mb-0 md:mr-6">
                                                <Icon className="h-6 w-6 text-white" />
                                            </div>
                                            {index < langkah.length - 1 && (
                                                <div className="w-0.5 h-full bg-cyan-200 dark:bg-cyan-800 min-h-[40px]" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="pb-8">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950 px-2 py-0.5 rounded">LANGKAH {index + 1}</span>
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{item.judul}</h3>
                                            <p className="text-slate-600 dark:text-slate-300 mt-1">{item.deskripsi}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-950 rounded-2xl p-8 border border-cyan-100 dark:border-cyan-900 text-center">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">Hubungi Kami</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Untuk reservasi kunjungan, silakan hubungi kami melalui:</p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm">
                            <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 font-medium">📞 (0274) 555123</span>
                            <span className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg text-slate-700 dark:text-slate-200 font-medium">✉️ info@diskominfo.go.id</span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
