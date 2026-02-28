"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DocumentCard } from "./DocumentCard";
import { Search, ChevronDown, ChevronRight, FileText, Loader2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

type ProgramDocument = {
    id: string;
    title: string;
    description: string | null;
    category: string;
    year: string;
    file_url: string;
    download_count: number;
    published_at: string;
    created_at: string;
};

// Grouped data structure for sidebar
type CategoryGroup = {
    name: string;
    years: string[];
};

type DocumentHubProps = {
    initialCategory?: string;
};

export function DocumentHub({ initialCategory }: DocumentHubProps) {
    const [documents, setDocuments] = useState<ProgramDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Filter State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory ?? null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    // Sidebar Data State
    const [categories, setCategories] = useState<CategoryGroup[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("program_documents")
                .select("*")
                .order("published_at", { ascending: false });

            if (error) throw error;

            const docs = data as ProgramDocument[];
            setDocuments(docs);
            processCategories(docs);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const processCategories = (docs: ProgramDocument[]) => {
        const categoryMap = new Map<string, Set<string>>();

        docs.forEach(doc => {
            if (!categoryMap.has(doc.category)) {
                categoryMap.set(doc.category, new Set());
            }
            categoryMap.get(doc.category)?.add(doc.year);
        });

        const groups: CategoryGroup[] = Array.from(categoryMap.entries()).map(([name, yearSet]) => ({
            name,
            years: Array.from(yearSet).sort().reverse()
        }));

        setCategories(groups);

        // If no initialCategory, expand all by default
        if (!initialCategory && groups.length > 0) {
            setExpandedCategories(groups.map(g => g.name));
        }
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category && selectedYear === null) {
            // Deselect if already selected and no year
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
            setSelectedYear(null);
        }
    };

    const handleYearClick = (category: string, year: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent category toggle
        if (selectedCategory === category && selectedYear === year) {
            setSelectedYear(null);
        } else {
            setSelectedCategory(category);
            setSelectedYear(year);
        }
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory ? doc.category === selectedCategory : true;
        const matchesYear = selectedYear ? doc.year === selectedYear : true;

        return matchesSearch && matchesCategory && matchesYear;
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter Dokumen
                    </h3>

                    <div className="space-y-2">
                        <button
                            onClick={() => { setSelectedCategory(null); setSelectedYear(null); }}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                                !selectedCategory
                                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            )}
                        >
                            <FileText className="h-4 w-4" />
                            Semua Dokumen
                        </button>

                        {categories.map((cat) => (
                            <div key={cat.name} className="space-y-1">
                                <button
                                    onClick={() => toggleCategory(cat.name)}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group"
                                >
                                    <span
                                        onClick={(e) => { e.stopPropagation(); handleCategoryClick(cat.name); }}
                                        className={cn(
                                            "flex-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                                            selectedCategory === cat.name && !selectedYear && "text-blue-600 dark:text-blue-400 font-bold"
                                        )}
                                    >
                                        {cat.name}
                                    </span>
                                    <span className="p-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                        {expandedCategories.includes(cat.name) ? (
                                            <ChevronDown className="h-3 w-3" />
                                        ) : (
                                            <ChevronRight className="h-3 w-3" />
                                        )}
                                    </span>
                                </button>

                                {expandedCategories.includes(cat.name) && (
                                    <div className="pl-4 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-3">
                                        {cat.years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={(e) => handleYearClick(cat.name, year, e)}
                                                className={cn(
                                                    "w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors block",
                                                    selectedCategory === cat.name && selectedYear === year
                                                        ? "bg-blue-600 text-white shadow-sm"
                                                        : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari dokumen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[400px]">
                        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
                        <p className="text-slate-500">Memuat dokumen...</p>
                    </div>
                ) : filteredDocuments.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Dokumen Tidak Ditemukan</h3>
                        <p className="text-slate-500">Coba ubah kata kunci pencarian atau filter anda.</p>
                        <button
                            onClick={() => { setSelectedCategory(null); setSelectedYear(null); setSearchQuery(""); }}
                            className="mt-4 text-blue-600 hover:underline text-sm font-medium"
                        >
                            Reset Filter
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h2 className="font-bold text-slate-800 dark:text-white text-lg">
                                {selectedCategory
                                    ? <>{selectedCategory} {selectedYear ? `- Tahun ${selectedYear}` : ''}</>
                                    : "Semua Dokumen"
                                }
                            </h2>
                            <span className="text-sm text-slate-500">{filteredDocuments.length} dokumen</span>
                        </div>
                        <div className="grid gap-4">
                            {filteredDocuments.map(doc => (
                                <DocumentCard key={doc.id} doc={doc} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
