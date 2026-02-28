"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import MenuForm from "../../MenuForm";

export default function EditMenuPage() {
    const params = useParams();
    const [menu, setMenu] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            if (!params.id) return;

            const { data, error } = await supabase
                .from("navigation_menus")
                .select("*")
                .eq("id", params.id)
                .single();

            if (error) {
                console.error("Error fetching menu:", error);
                alert("Menu tidak ditemukan");
            } else {
                setMenu(data);
            }
            setLoading(false);
        };

        fetchMenu();
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (!menu) return <div>Data tidak ditemukan.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <MenuForm initialData={menu} isEdit={true} />
        </div>
    );
}
