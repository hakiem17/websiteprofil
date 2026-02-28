import { DocumentTable } from "@/components/documents/DocumentTable";

// Map slug to display title
const categoryTitles: Record<string, string> = {
    renstra: "Rencana Strategis (Renstra)",
    renja: "Rencana Kerja (Renja)",
    dpa: "Dokumen Pelaksanaan Anggaran (DPA)",
    lkjip: "Laporan Kinerja (LKJIP)",
    lhkpn: "Laporan Harta Kekayaan (LHKPN)",
};

interface PageProps {
    params: Promise<{ category: string }>;
}

export default async function DocumentCategoryPage({ params }: PageProps) {
    const { category } = await params;
    const title = categoryTitles[category] || category.toUpperCase();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-primary capitalize">{title}</h1>
                    <p className="text-muted-foreground">
                        Arsip dokumen {title} yang dapat diunduh oleh publik sebagai bentuk transparansi kinerja.
                    </p>
                </div>

                <DocumentTable category={category} />
            </div>
        </div>
    );
}
