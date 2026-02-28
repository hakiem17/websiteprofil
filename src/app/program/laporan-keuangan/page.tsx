import { PageHero } from "@/components/layout/PageHero";
import { DocumentHub } from "@/components/program/DocumentHub";

export const metadata = {
    title: "Laporan Keuangan - Pemerintah Daerah",
    description: "Laporan Pertanggungjawaban Keuangan Pemerintah Daerah.",
};

export default function LaporanKeuanganPage() {
    return (
        <main>
            <PageHero
                title="Laporan Keuangan"
                subtitle="Transparansi dan Akuntabilitas Pengelolaan Keuangan Daerah"
                breadcrumbs={[
                    { label: "Program", href: "/program" },
                    { label: "Laporan Keuangan" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <DocumentHub initialCategory="Laporan Keuangan" />
            </div>
        </main>
    );
}
