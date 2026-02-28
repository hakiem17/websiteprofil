import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { getProfilePage } from "@/lib/profile-service";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Tugas & Fungsi",
    description: "Tugas pokok dan fungsi Dinas Komunikasi dan Informatika Pemerintah Daerah.",
};

export default async function TugasFungsiPage() {
    const page = await getProfilePage("tugas-fungsi");

    if (!page) {
        notFound();
    }

    return (
        <>
            <PageHero
                title={page.title}
                subtitle="Tugas pokok dan fungsi unit kerja perangkat daerah"
                breadcrumbs={[
                    { label: "Profil", href: "/profil/visi-misi" },
                    { label: "Tugas Dan Fungsi" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-cyan-700 dark:prose-headings:text-cyan-400 prose-blockquote:border-l-cyan-500 prose-li:marker:text-cyan-500">
                            <div dangerouslySetInnerHTML={{ __html: page.content || "" }} />
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}
