"use client";

import { FileText, Download, Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ProgramDocument {
    id: string;
    title: string;
    description: string | null;
    category: string;
    year: string;
    file_url: string;
    download_count: number;
    published_at: string;
}

interface DocumentCardProps {
    doc: ProgramDocument;
}

export function DocumentCard({ doc }: DocumentCardProps) {
    const handleDownload = async () => {
        // Here you could implement a download counter increment logic
        window.open(doc.file_url, "_blank");
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 group">
            <div className="flex gap-4 sm:gap-6 items-start">
                <div className="flex-shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 group-hover:scale-105 transition-transform">
                        <FileText className="h-7 w-7 sm:h-8 sm:w-8" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {doc.category}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300">
                            TA {doc.year}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {doc.title}
                    </h3>

                    {doc.description && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                            {doc.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Download className="h-3.5 w-3.5" />
                                <span>{doc.download_count} Unduhan</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                    {format(new Date(doc.published_at), "d MMMM yyyy", { locale: id })}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => window.open(doc.file_url, "_blank")}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                                Detail
                            </button>
                            <button
                                onClick={handleDownload}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                            >
                                <Download className="h-4 w-4" />
                                Unduh
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
