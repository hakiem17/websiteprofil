import { Plus } from "lucide-react";

interface PageHeaderProps {
    title: string;
    description?: string;
    onAdd?: () => void; // If provided, shows Add button
    addButtonText?: string;
}

export function PageHeader({ title, description, onAdd, addButtonText = "Tambah Baru" }: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus className="h-4 w-4" />
                    {addButtonText}
                </button>
            )}
        </div>
    );
}
