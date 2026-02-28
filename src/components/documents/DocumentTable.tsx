"use client";

import { FileText, Download } from "lucide-react";

type DocumentItem = {
    id: string;
    title: string;
    fiscal_year: number;
    category: string;
    description?: string;
    file_url: string;
    created_at: string;
};

// Mock Data for now - will be replaced by Supabase fetch
const mockDocuments: DocumentItem[] = [
    { id: "1", title: "Renstra 2024-2029", fiscal_year: 2024, category: "Renstra", file_url: "#", created_at: "2024-01-15" },
    { id: "2", title: "DPA Dinas XYZ 2024", fiscal_year: 2024, category: "DPA", file_url: "#", created_at: "2024-02-01" },
    { id: "3", title: "Laporan Kinerja 2023", fiscal_year: 2023, category: "LKJIP", file_url: "#", created_at: "2024-01-10" },
    { id: "4", title: "Rencana Kerja 2025", fiscal_year: 2025, category: "Renja", file_url: "#", created_at: "2024-12-01" },
];

export function DocumentTable({ category }: { category?: string }) {
    // const [yearFilter, setYearFilter] = useState<number | "all">("all");

    // Filter Logic
    const filteredDocs = mockDocuments.filter((doc) => {
        const matchCategory = category ? doc.category.toLowerCase() === category.toLowerCase() : true;
        // const matchYear = yearFilter === "all" ? true : doc.fiscal_year === yearFilter;
        return matchCategory;
    });

    // const uniqueYears = Array.from(new Set(mockDocuments.map((d) => d.fiscal_year))).sort((a, b) => b - a);

    return (
        <div className="space-y-6">
            {/* Filters - Disabled for now
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                 ...
            </div>
            */}

            {/* Table List */}
            <div className="grid gap-4">
                {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc) => (
                        <div
                            key={doc.id}
                            className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all hover:border-primary/20"
                        >          <div className="flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg flex items-center justify-center">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                        {doc.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-medium">
                                            {doc.fiscal_year}
                                        </span>
                                        <span>•</span>
                                        <span>{doc.category}</span>
                                        <span>•</span>
                                        <span>{new Date(doc.created_at).toLocaleDateString("id-ID")}</span>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={doc.file_url}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all group-hover:translate-x-1"
                            >
                                <Download className="h-4 w-4" />
                                Unduh
                            </a>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-200">
                        Tidak ada dokumen ditemukan.
                    </div>
                )
                }
            </div >
        </div >
    );
}
