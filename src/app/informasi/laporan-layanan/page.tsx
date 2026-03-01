import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { getInformasiPage } from "@/lib/informasi-service";

export const metadata: Metadata = {
    title: "Laporan Layanan Informasi Publik",
    description: "Laporan layanan informasi publik Pemerintah Daerah.",
};

export default async function LaporanLayananPage() {
    const page = await getInformasiPage("laporan-layanan");

    return (
        <>
            <PageHero
                title={page?.title || "Laporan Layanan Informasi Publik"}
                subtitle="Laporan penyelenggaraan pelayanan informasi publik"
                breadcrumbs={[
                    { label: "Informasi", href: "/informasi/berita" },
                    { label: "Laporan Layanan Informasi Publik" },
                ]}
            />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
                        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-cyan-700 dark:prose-headings:text-cyan-400 prose-blockquote:border-l-cyan-500 prose-li:marker:text-cyan-500">
                            <div dangerouslySetInnerHTML={{ __html: page?.content || "<p>Konten sedang disiapkan.</p>" }} />
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}
