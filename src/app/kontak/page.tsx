import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { MapPin, Phone, Mail, Clock, Send, Globe } from "lucide-react";

export const metadata: Metadata = {
    title: "Kontak",
    description: "Hubungi Dinas Komunikasi dan Informatika Pemerintah Daerah. Alamat, telepon, email, dan jam operasional.",
    openGraph: {
        title: "Kontak | Pemerintah Daerah",
        description: "Informasi kontak dan jam operasional Dinas Komunikasi dan Informatika.",
    },
};

export default function KontakPage() {
    return (
        <>
            <PageHero
                title="Kontak"
                subtitle="Hubungi kami untuk informasi, pertanyaan, atau pengaduan"
                breadcrumbs={[
                    { label: "Menu Lainnya" },
                    { label: "Kontak" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Contact Info Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                            <div className="h-14 w-14 rounded-xl bg-cyan-50 dark:bg-cyan-950 flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-7 w-7 text-cyan-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Alamat</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Jl. Brigjen Katamso, Kota Baru<br />
                                Yogyakarta 55211
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                            <div className="h-14 w-14 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-4">
                                <Phone className="h-7 w-7 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Telepon</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">(0274) 555123</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Fax: (0274) 555124</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                            <div className="h-14 w-14 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white mb-2">Email</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">info@diskominfo.go.id</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">ppid@diskominfo.go.id</p>
                        </div>
                    </div>

                    {/* Email + Jam Operasional */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <Send className="h-5 w-5 text-cyan-600" />
                                Kirim Pesan
                            </h2>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                                    <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all" placeholder="Masukkan nama" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                    <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all" placeholder="email@contoh.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pesan</label>
                                    <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Tulis pesan Anda..." />
                                </div>
                                <button type="button" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>

                        {/* Jam Operasional + Map */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-cyan-600" />
                                    Jam Operasional
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { hari: "Senin - Kamis", jam: "07.30 - 16.00 WIB" },
                                        { hari: "Jumat", jam: "07.30 - 14.30 WIB" },
                                        { hari: "Sabtu - Minggu", jam: "Libur" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.hari}</span>
                                            <span className={`text-sm font-semibold ${item.jam === "Libur" ? "text-red-500" : "text-cyan-600"}`}>{item.jam}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                                <div className="aspect-video bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                    <div className="text-center">
                                        <Globe className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">Google Maps</p>
                                        <p className="text-xs text-slate-400">Peta lokasi kantor</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
