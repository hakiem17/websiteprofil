import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Phone, Mail, MessageSquare, ExternalLink, MapPin } from "lucide-react";

export const metadata: Metadata = {
    title: "Saluran Pengaduan",
    description: "Saluran pengaduan masyarakat ke Pemerintah Daerah.",
};

export default function SaluranPengaduanPage() {
    const saluran = [
        { icon: Phone, judul: "Telepon", detail: "(0274) 555123", deskripsi: "Senin - Jumat, 08.00 - 16.00 WIB" },
        { icon: Mail, judul: "Email", detail: "pengaduan@diskominfo.go.id", deskripsi: "Respon maksimal 1x24 jam kerja" },
        { icon: MessageSquare, judul: "WhatsApp", detail: "0812-XXXX-XXXX", deskripsi: "Layanan chat pengaduan" },
        { icon: MapPin, judul: "Datang Langsung", detail: "Kantor Diskominfo", deskripsi: "Jl. Brigjen Katamso, Yogyakarta" },
    ];

    return (
        <>
            <PageHero
                title="Saluran Pengaduan"
                subtitle="Sampaikan pengaduan, aspirasi, atau masukan Anda"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Saluran Pengaduan" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Layanan Pengaduan</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Kami membuka saluran pengaduan untuk masyarakat yang ingin menyampaikan keluhan, saran, maupun masukan terkait pelayanan publik. Setiap pengaduan akan ditindaklanjuti sesuai prosedur yang berlaku.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {saluran.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-linear-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 mx-auto md:mx-0 md:mb-0 md:mr-6">                                        <Icon className="h-6 w-6 text-amber-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 dark:text-white">{item.judul}</h3>
                                            <p className="text-cyan-600 font-semibold mt-1">{item.detail}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.deskripsi}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-3">Layanan Pengaduan Online Nasional</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Sampaikan pengaduan Anda juga melalui portal LAPOR!</p>
                        <a href="https://www.lapor.go.id" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                            Akses LAPOR! <ExternalLink className="h-4 w-4" />
                        </a>
                    </div>

                </div>
            </div>
        </>
    );
}
