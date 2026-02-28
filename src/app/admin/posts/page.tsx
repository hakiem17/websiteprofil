"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Edit, Trash2, Eye, FileText } from "lucide-react";

type Post = {
    id: string;
    title: string;
    category: string | null;
    is_published: boolean;
    published_at: string;
    created_at: string;
};

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("posts")
            .select("id, title, category, is_published, published_at, created_at")
            .order("created_at", { ascending: false });

        if (!error && data) {
            setPosts(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Apakah Anda yakin ingin menghapus berita ini?")) return;
        const { error } = await supabase.from("posts").delete().eq("id", id);
        if (!error) fetchPosts();
        else alert("Gagal menghapus: " + error.message);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Berita & Artikel</h1>
                    <p className="text-muted-foreground">Kelola publikasi berita dan artikel terbaru.</p>
                </div>
                <Link
                    href="/admin/posts/create"
                    className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                    + Tulis Berita
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : posts.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                        <FileText className="h-12 w-12 mb-4 opacity-20" />
                        <p>Belum ada berita.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4 font-medium text-slate-500">Judul</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Kategori</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Status</th>
                                <th className="px-6 py-4 font-medium text-slate-500">Tanggal Publikasi</th>
                                <th className="px-6 py-4 font-medium text-slate-500 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-md truncate">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600 dark:text-slate-300">{post.category || "Berita"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${post.is_published
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                                }`}
                                        >
                                            {post.is_published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        {post.published_at
                                            ? format(new Date(post.published_at), "dd MMM yyyy", {
                                                locale: idLocale,
                                            })
                                            : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/admin/posts/${post.id}`}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
