"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseSppd } from "@/lib/supabase-sppd";
import { Pegawai } from "@/types/pegawai";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PegawaiFormProps {
    initialData?: Pegawai;
    isEdit?: boolean;
}

export function PegawaiForm({ initialData, isEdit = false }: PegawaiFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Pegawai>>({
        nama_pegawai: initialData?.nama_pegawai || "",
        nip: initialData?.nip || "",
        jenis_pegawai: initialData?.jenis_pegawai || "PNS",
        pangkat_golongan: initialData?.pangkat_golongan || "",
        jabatan_dinas: initialData?.jabatan_dinas || "",
        jabatan_keuangan: initialData?.jabatan_keuangan || "",
        bidang: initialData?.bidang || "",
        jenis_kelamin: initialData?.jenis_kelamin || "L",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit && initialData) {
                const { error } = await supabaseSppd
                    .from("pegawai")
                    .update(formData)
                    .eq("id", initialData.id);

                if (error) throw error;
                toast.success("Data pegawai berhasil diperbarui");
            } else {
                const { error } = await supabaseSppd
                    .from("pegawai")
                    .insert([formData]);

                if (error) throw error;
                toast.success("Pegawai baru berhasil ditambahkan");
            }

            router.push("/admin/pegawai");
            router.refresh();
        } catch (error) {
            console.error("Error saving pegawai:", error);
            toast.error("Gagal menyimpan data pegawai");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/pegawai"
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                            {isEdit ? "Edit Pegawai" : "Tambah Pegawai"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            {isEdit ? "Perbarui informasi pegawai" : "Tambahkan pegawai baru ke dalam sistem"}
                        </p>
                    </div>
                </div>
                <Button type="submit" disabled={loading} className="max-w-[150px]">
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? "Menyimpan..." : "Simpan"}
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="nama_pegawai">Nama Lengkap</Label>
                        <Input
                            id="nama_pegawai"
                            name="nama_pegawai"
                            value={formData.nama_pegawai}
                            onChange={handleChange}
                            placeholder="Contoh: Dr. H. Ahmad Zainal Arifin, M.Si."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nip">NIP (Nomor Induk Pegawai)</Label>
                        <Input
                            id="nip"
                            name="nip"
                            value={formData.nip}
                            onChange={handleChange}
                            placeholder="Contoh: 19750315 199803 1 005"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jenis_pegawai">Status Kepegawaian</Label>
                        <select
                            id="jenis_pegawai"
                            name="jenis_pegawai"
                            value={formData.jenis_pegawai}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="PNS">PNS</option>
                            <option value="PPPK">PPPK</option>
                            <option value="PTT">PTT (Honorer)</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jenis_kelamin">Jenis Kelamin</Label>
                        <select
                            id="jenis_kelamin"
                            name="jenis_kelamin"
                            value={formData.jenis_kelamin}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="L">Laki-laki</option>
                            <option value="P">Perempuan</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jabatan_dinas">Jabatan Dinas</Label>
                        <Input
                            id="jabatan_dinas"
                            name="jabatan_dinas"
                            value={formData.jabatan_dinas}
                            onChange={handleChange}
                            placeholder="Contoh: Kepala Dinas"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pangkat_golongan">Pangkat / Golongan</Label>
                        <Input
                            id="pangkat_golongan"
                            name="pangkat_golongan"
                            value={formData.pangkat_golongan}
                            onChange={handleChange}
                            placeholder="Contoh: Pembina Utama Muda (IV/c)"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bidang">Bidang / Unit Kerja</Label>
                        <Input
                            id="bidang"
                            name="bidang"
                            value={formData.bidang}
                            onChange={handleChange}
                            placeholder="Contoh: Bidang Informasi Komunikasi Publik"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jabatan_keuangan">Jabatan Keuangan (Opsional)</Label>
                        <Input
                            id="jabatan_keuangan"
                            name="jabatan_keuangan"
                            value={formData.jabatan_keuangan}
                            onChange={handleChange}
                            placeholder="Contoh: Pengguna Anggaran"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
