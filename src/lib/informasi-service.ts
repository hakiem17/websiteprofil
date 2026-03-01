import { supabase } from "@/lib/supabase";

export async function getInformasiPage(slug: string) {
    const { data, error } = await supabase
        .from("informasi_pages")
        .select("title, content, updated_at")
        .eq("slug", slug)
        .single();

    if (error || !data) {
        console.error(`Error fetching informasi page ${slug}:`, error);
        return null;
    }

    return data;
}
