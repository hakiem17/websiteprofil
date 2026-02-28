import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Globe, FileText, Shield, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
    title: "Layanan Informasi Publik",
    description: "Layanan informasi publik dan PPID Pemerintah Daerah.",
};

export default function LayananInformasiPublikPage() {
    const layanan = [
        {
            judul: "Permohonan Informasi Publik",
            deskripsi: "Ajukan permohonan informasi publik secara online melalui sistem e-PPID",
            icon: FileText,
            link: "#",
        },
        {
            judul: "Pengajuan Keberatan",
            deskripsi: "Ajukan keberatan atas tanggapan permohonan informasi publik",
            icon: Shield,
            link: "#",
        },
        {
            judul: "Portal PPID",
            deskripsi: "Akses portal Pejabat Pengelola Informasi dan Dokumentasi",
            icon: Globe,
            link: "#",
        },
    ];

    return (
        <>
            <PageHero
                title="Layanan Informasi Publik"
                subtitle="Pejabat Pengelola Informasi dan Dokumentasi (PPID)"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Layanan Informasi Publik" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Tentang PPID</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Pejabat Pengelola Informasi dan Dokumentasi (PPID) adalah pejabat yang bertanggung jawab di bidang penyimpanan, pendokumentasian, penyediaan, dan/atau pelayanan informasi di badan publik sesuai dengan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {layanan.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <a key={index} href={item.link} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:border-cyan-200 dark:hover:border-cyan-800 transition-all group">
                                    <div className="h-12 w-12 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center mb-4 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900 transition-colors">
                                        <Icon className="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-white mb-2">{item.judul}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.deskripsi}</p>
                                    <span className="inline-flex items-center gap-1 text-sm text-cyan-600 font-medium mt-4">
                                        Akses Layanan <ExternalLink className="h-3.5 w-3.5" />
                                    </span>
                                </a>
                            );
                        })}
                    </div>

                </div>
            </div>
        </>
    );
}
