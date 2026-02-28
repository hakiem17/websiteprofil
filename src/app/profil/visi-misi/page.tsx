import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { getProfilePage } from "@/lib/profile-service";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Visi & Misi",
    description: "Visi dan misi Pemerintah Daerah dalam mewujudkan pelayanan publik yang berkualitas.",
};

export default async function VisiMisiPage() {
    const page = await getProfilePage("visi-misi");

    if (!page) {
        notFound();
    }

    return (
        <>
            <PageHero
                title={page.title}
                subtitle="Arah dan tujuan pembangunan daerah untuk lima tahun ke depan"
                breadcrumbs={[
                    { label: "Profil", href: "/profil/visi-misi" },
                    { label: "Visi & Misi" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
                        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-cyan-700 dark:prose-headings:text-cyan-400 prose-blockquote:border-l-cyan-500 prose-li:marker:text-cyan-500">
                            <div dangerouslySetInnerHTML={{ __html: page.content || "" }} />
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}
