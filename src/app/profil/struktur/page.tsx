import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { getProfilePage } from "@/lib/profile-service";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Struktur Organisasi",
    description: "Struktur organisasi dan bagan tata kelola Pemerintah Daerah.",
};

export default async function StrukturPage() {
    const page = await getProfilePage("struktur");

    if (!page) {
        notFound();
    }

    return (
        <>
            <PageHero
                title={page.title}
                subtitle="Bagan susunan organisasi dan tata kerja perangkat daerah"
                breadcrumbs={[
                    { label: "Profil", href: "/profil/visi-misi" },
                    { label: "Struktur Organisasi" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 shadow-sm border border-slate-100 dark:border-slate-800">
                        <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-cyan-700 dark:prose-headings:text-cyan-400">
                            <div dangerouslySetInnerHTML={{ __html: page.content || "" }} />
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}
