import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Shield, Lock, Cookie, FileText, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
    title: "Kebijakan Privasi",
    description: "Kebijakan privasi, keamanan informasi, cookie, dan syarat ketentuan penggunaan situs resmi Pemerintah Daerah.",
    openGraph: {
        title: "Kebijakan Privasi | Pemerintah Daerah",
        description: "Kebijakan privasi dan ketentuan penggunaan situs.",
    },
};

export default function KebijakanPage() {
    const kebijakan = [
        {
            icon: Shield,
            judul: "Kebijakan Privasi",
            deskripsi: "Kami berkomitmen untuk melindungi privasi pengunjung situs web ini. Informasi pribadi yang dikumpulkan hanya digunakan untuk keperluan pelayanan publik dan tidak akan dibagikan kepada pihak ketiga tanpa persetujuan.",
        },
        {
            icon: Lock,
            judul: "Keamanan Informasi",
            deskripsi: "Situs web ini menggunakan protokol keamanan SSL/TLS untuk memastikan keamanan data yang dikirimkan. Kami mengikuti standar keamanan informasi pemerintah sesuai regulasi yang berlaku.",
        },
        {
            icon: Cookie,
            judul: "Kebijakan Cookie",
            deskripsi: "Situs ini menggunakan cookie untuk meningkatkan pengalaman pengguna. Cookie digunakan untuk menganalisis trafik, menyimpan preferensi pengguna, dan menyediakan konten yang relevan.",
        },
        {
            icon: FileText,
            judul: "Syarat & Ketentuan",
            deskripsi: "Dengan mengakses situs ini, Anda menyetujui syarat dan ketentuan yang berlaku. Konten situs ini dilindungi oleh hak cipta dan hanya boleh digunakan untuk kepentingan non-komersial dengan mencantumkan sumber.",
        },
    ];

    return (
        <>
            <PageHero
                title="Kebijakan"
                subtitle="Kebijakan privasi, keamanan, dan ketentuan penggunaan situs"
                breadcrumbs={[
                    { label: "Menu Lainnya" },
                    { label: "Kebijakan" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-6">
                    {kebijakan.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-linear-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                                        <Icon className="h-6 w-6 text-cyan-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{item.judul}</h2>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.deskripsi}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <div className="bg-cyan-50 dark:bg-cyan-950 rounded-2xl p-8 border border-cyan-100 dark:border-cyan-900 text-center">
                        <p className="text-slate-600 dark:text-slate-300 text-sm">
                            Kebijakan ini terakhir diperbarui pada <strong>1 Januari 2026</strong>. Kami berhak mengubah kebijakan ini sewaktu-waktu. Perubahan akan diumumkan melalui situs resmi.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
