import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { getProfilePage } from "@/lib/profile-service";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Maklumat Pelayanan",
    description: "Maklumat pelayanan publik Dinas Komunikasi dan Informatika Pemerintah Daerah.",
};

export default async function MaklumatPage() {
    const page = await getProfilePage("maklumat");

    if (!page) {
        notFound();
    }

    return (
        <>
            <PageHero
                title={page.title}
                subtitle="Komitmen kami dalam memberikan pelayanan terbaik"
                breadcrumbs={[
                    { label: "Profil", href: "/profil/visi-misi" },
                    { label: "Maklumat Pelayanan" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 md:p-16 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-cyan-700 dark:prose-headings:text-cyan-400 prose-blockquote:font-medium prose-blockquote:text-xl md:prose-blockquote:text-2xl prose-blockquote:not-italic prose-blockquote:border-none prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-200">
                            <div dangerouslySetInnerHTML={{ __html: page.content || "" }} />
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}
