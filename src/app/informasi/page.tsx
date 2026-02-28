import { PageHero } from "@/components/layout/PageHero";
import { Card, Carddescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import {
    Newspaper,
    Calendar,
    FileText,
    Download,
    MessageSquare,
    Scale,
    Map
} from "lucide-react";

export const metadata: Metadata = {
    title: "Pusat Informasi",
    description: "Pusat informasi publik, berita terkini, agenda pimpinan, dan dokumen resmi pemerintah daerah.",
};

const infoMenus = [
    {
        title: "Berita & Artikel",
        href: "/informasi/berita",
        description: "Berita terkini dan artikel informatif seputar kegiatan pemerintah daerah.",
        icon: Newspaper,
    },
    {
        title: "Agenda Pimpinan",
        href: "/informasi/agenda-pimpinan",
        description: "Jadwal dan agenda kegiatan pimpinan daerah.",
        icon: Calendar,
    },
    {
        title: "Produk Hukum",
        href: "/informasi/produk-hukum",
        description: "Peraturan Daerah, Peraturan Bupati, dan produk hukum lainnya.",
        icon: Scale,
    },
    {
        title: "Unduhan Dokumen",
        href: "/informasi/unduhan",
        description: "Dokumen publik, formulir, dan laporan yang dapat diunduh.",
        icon: Download,
    },
    {
        title: "Layanan Pengaduan",
        href: "/informasi/saluran-pengaduan",
        description: "Saluran resmi untuk menyampaikan aspirasi dan pengaduan.",
        icon: MessageSquare,
    },
    {
        title: "Laporan Layanan",
        href: "/informasi/laporan-layanan",
        description: "Laporan kinerja dan survei kepuasan masyarakat.",
        icon: FileText,
    },
    {
        title: "Alur Kunjungan",
        href: "/informasi/alur-kunjungan",
        description: "Prosedur dan tata cara kunjungan kerja atau tamu daerah.",
        icon: Map,
    },
];

export default function InformasiPage() {
    return (
        <main>
            <PageHero
                title="Pusat Informasi"
                subtitle="Akses mudah ke berbagai informasi publik dan layanan pemerintah daerah."
                breadcrumbs={[
                    { label: "Beranda", href: "/" },
                    { label: "Informasi", href: "/informasi", active: true },
                ]}
            />

            <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {infoMenus.map((item, index) => (
                            <Link key={index} href={item.href} className="group">
                                <Card className="h-full hover:shadow-md transition-all duration-300 border-slate-200 dark:border-slate-800 hover:border-primary/50 dark:hover:border-primary/50 group-hover:-translate-y-1">
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                            {item.title}
                                        </CardTitle>
                                        <Carddescription className="text-base mt-2">
                                            {item.description}
                                        </Carddescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
