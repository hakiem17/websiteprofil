"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { Users, Mail, Shield, Clock } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

type UserInfo = {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
};

export default function UsersPage() {
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setCurrentUser({
                    id: user.id,
                    email: user.email || "–",
                    created_at: user.created_at,
                    last_sign_in_at: user.last_sign_in_at || null,
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "dd MMM yyyy, HH:mm", { locale: idLocale });
        } catch {
            return dateStr;
        }
    };

    return (
        <div>
            <PageHeader
                title="Manajemen Pengguna"
                description="Kelola pengguna admin yang memiliki akses ke dashboard."
            />

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {/* Current user */}
                        {currentUser && (
                            <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                    {currentUser.email.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{currentUser.email}</h3>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                                            <Shield className="h-3 w-3" />
                                            Admin
                                        </span>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                                            Anda
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5" />
                                            {currentUser.email}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            Terdaftar: {formatDate(currentUser.created_at)}
                                        </span>
                                        {currentUser.last_sign_in_at && (
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                Login terakhir: {formatDate(currentUser.last_sign_in_at)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Info card */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Manajemen Pengguna</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                            Untuk menambah atau mengelola pengguna admin lainnya, gunakan dashboard Supabase di bagian <strong>Authentication → Users</strong>.
                            Setiap pengguna yang terdaftar dan terautentikasi akan memiliki akses penuh ke dashboard admin.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
