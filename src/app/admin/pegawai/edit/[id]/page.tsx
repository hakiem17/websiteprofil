"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseSppd } from "@/lib/supabase-sppd";
import { Pegawai } from "@/types/pegawai";
import { PegawaiForm } from "../../_components/PegawaiForm";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function EditPegawaiPage() {
    const params = useParams();
    const router = useRouter();
    const [pegawai, setPegawai] = useState<Pegawai | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPegawai = async () => {
            try {
                const { data, error } = await supabaseSppd
                    .from("pegawai")
                    .select("*")
                    .eq("id", params.id)
                    .single();

                if (error) throw error;
                setPegawai(data);
            } catch (error) {
                console.error("Error fetching pegawai:", error);
                toast.error("Gagal memuat data pegawai");
                router.push("/admin/pegawai");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchPegawai();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!pegawai) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <PegawaiForm initialData={pegawai} isEdit />
        </div>
    );
}
