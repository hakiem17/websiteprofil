"use client";

import { useSearchParams } from "next/navigation";
import MenuForm from "../MenuForm";
import { Suspense } from "react";

function AddMenuContent() {
    const searchParams = useSearchParams();
    const parentId = searchParams.get("parent_id") || undefined;

    return (
        <div className="max-w-2xl">
            <MenuForm initialParentId={parentId} />
        </div>
    );
}

export default function AddMenuPage() {
    return (
        <Suspense fallback={<div className="max-w-2xl h-96 bg-white dark:bg-slate-800 rounded-xl animate-pulse" />}>
            <AddMenuContent />
        </Suspense>
    );
}
