import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Image as ImageIcon, Video, Camera } from "lucide-react";

export const metadata: Metadata = {
    title: "Galeri",
    description: "Dokumentasi foto dan video kegiatan Dinas Komunikasi dan Informatika Pemerintah Daerah.",
    openGraph: {
        title: "Galeri | Pemerintah Daerah",
        description: "Dokumentasi foto dan video kegiatan Dinas Komunikasi dan Informatika.",
    },
};

export default function GaleriPage() {
    const fotoGaleri = [
        { judul: "Upacara HUT Kominfo", tanggal: "17 Januari 2026", kategori: "Kegiatan" },
        { judul: "Rapat Koordinasi Smart City", tanggal: "10 Januari 2026", kategori: "Rapat" },
        { judul: "Workshop Transformasi Digital", tanggal: "5 Januari 2026", kategori: "Workshop" },
        { judul: "Kunjungan Kerja Data Center", tanggal: "20 Desember 2025", kategori: "Kunjungan" },
        { judul: "Sosialisasi Keamanan Siber", tanggal: "15 Desember 2025", kategori: "Sosialisasi" },
        { judul: "Pelatihan ASN Digital", tanggal: "8 Desember 2025", kategori: "Pelatihan" },
        { judul: "Launching Aplikasi Layanan Publik", tanggal: "1 Desember 2025", kategori: "Launching" },
        { judul: "Penandatanganan MoU Kerja Sama", tanggal: "25 November 2025", kategori: "Kerja Sama" },
    ];

    const colors = [
        "from-cyan-500 to-blue-600",
        "from-violet-500 to-purple-600",
        "from-amber-500 to-orange-600",
        "from-emerald-500 to-teal-600",
        "from-rose-500 to-pink-600",
        "from-sky-500 to-indigo-600",
        "from-lime-500 to-green-600",
        "from-fuchsia-500 to-pink-600",
    ];

    return (
        <>
            <PageHero
                title="Galeri"
                subtitle="Dokumentasi kegiatan dan momen di Dinas Komunikasi dan Informatika"
                breadcrumbs={[
                    { label: "Menu Lainnya" },
                    { label: "Galeri" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto space-y-8">

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {["Semua", "Kegiatan", "Rapat", "Workshop", "Kunjungan"].map((tab, i) => (
                            <button key={tab} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${i === 0 ? "bg-cyan-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-cyan-50 dark:hover:bg-slate-700"}`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Photo Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {fotoGaleri.map((foto, index) => (
                            <div key={index} className="group relative rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow cursor-pointer">
                                <div className={`aspect-square bg-linear-to-br ${colors[index % colors.length]} flex items-center justify-center`}>
                                    <Camera className="h-12 w-12 text-white/30" />
                                </div>
                                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-white/20 text-white mb-1.5">{foto.kategori}</span>
                                    <h3 className="text-white font-bold text-sm">{foto.judul}</h3>
                                    <p className="text-white/70 text-xs mt-0.5">{foto.tanggal}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </>
    );
}
