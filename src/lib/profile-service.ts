import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export async function getProfilePage(slug: string) {
    const { data, error } = await supabase
        .from("profile_pages")
        .select("title, content, updated_at")
        .eq("slug", slug)
        .single();

    if (error || !data) {
        console.error(`Error fetching profile page ${slug}:`, error);
        return null;
    }

    return data;
}
