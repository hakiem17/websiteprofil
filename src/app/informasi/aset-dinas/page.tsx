import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Package, Server, Monitor, Wifi, HardDrive } from "lucide-react";

export const metadata: Metadata = {
    title: "Aset Dinas",
    description: "Informasi aset Dinas Komunikasi dan Informatika Pemerintah Daerah.",
};

export default function AsetDinasPage() {
    const aset = [
        { icon: Server, nama: "Server & Data Center", jumlah: 12, satuan: "Unit", kondisi: "Baik" },
        { icon: Monitor, nama: "Komputer / Laptop", jumlah: 85, satuan: "Unit", kondisi: "Baik" },
        { icon: Wifi, nama: "Perangkat Jaringan", jumlah: 45, satuan: "Unit", kondisi: "Baik" },
        { icon: HardDrive, nama: "Storage System", jumlah: 8, satuan: "Unit", kondisi: "Baik" },
        { icon: Package, nama: "Kendaraan Dinas", jumlah: 6, satuan: "Unit", kondisi: "Baik" },
    ];

    return (
        <>
            <PageHero
                title="Aset Dinas"
                subtitle="Informasi aset dan inventaris perangkat daerah"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Aset Dinas" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Daftar Aset</h2>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            Informasi aset dinas yang dikelola sebagai bentuk transparansi dan akuntabilitas pengelolaan barang milik daerah.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aset.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                                    <div className="h-14 w-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-7 w-7 text-cyan-600" />
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">{item.nama}</h3>
                                    <p className="text-3xl font-bold text-cyan-600 mt-2">{item.jumlah}</p>
                                    <p className="text-sm text-slate-500">{item.satuan}</p>
                                    <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">{item.kondisi}</span>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </>
    );
}
