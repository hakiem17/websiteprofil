import { PageHero } from "@/components/layout/PageHero";
import { DocumentHub } from "@/components/program/DocumentHub";

export const metadata = {
    title: "Program & Dokumen - Pemerintah Daerah",
    description: "Pusat dokumen dan informasi program pemerintah daerah.",
};

export default function ProgramPage() {
    return (
        <main>
            <PageHero
                title="Program & Dokumen"
                subtitle="Pusat informasi dokumen perencanaan, evaluasi, dan laporan kinerja."
                breadcrumbs={[
                    { label: "Program" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <DocumentHub />
            </div>
        </main>
    );
}
