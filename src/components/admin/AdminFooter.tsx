"use client";

export function AdminFooter() {
    return (
        <footer className="py-6 px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <p>
                    &copy; {new Date().getFullYear()} Pemerintah Kabupaten. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
                        Bantuan
                    </span>
                    <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
                        Kebijakan Privasi
                    </span>
                </div>
            </div>
        </footer>
    );
}
