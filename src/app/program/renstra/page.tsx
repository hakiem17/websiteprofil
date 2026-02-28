import { PageHero } from "@/components/layout/PageHero";
import { DocumentHub } from "@/components/program/DocumentHub";

export const metadata = {
    title: "Dokumen Renstra - Pemerintah Daerah",
    description: "Dokumen Rencana Strategis (Renstra) Dinas Komunikasi dan Informatika.",
};

export default function RenstraPage() {
    return (
        <main>
            <PageHero
                title="Dokumen Renstra"
                subtitle="Rencana Strategis Dinas Komunikasi dan Informatika"
                breadcrumbs={[
                    { label: "Program", href: "/program" },
                    { label: "Dokumen Renstra" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                {/* 
                    Using DocumentHub with initial category. 
                    Ensure the category name matches exactly what is used in Admin.
                */}
                <DocumentHub initialCategory="Dokumen Perencanaan" />
            </div>
        </main>
    );
}
