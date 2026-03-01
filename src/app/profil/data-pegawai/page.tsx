import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { DataPegawaiList } from "@/components/profil/DataPegawaiList";

export const metadata: Metadata = {
    title: "Data Pegawai",
    description:
        "Daftar pegawai Dinas Komunikasi dan Informatika Kabupaten Hulu Sungai Tengah.",
};

export default function DataPegawaiPage() {
    return (
        <>
            <PageHero
                title="Data Pegawai"
                subtitle="Daftar pegawai di lingkungan Dinas Komunikasi dan Informatika"
                breadcrumbs={[
                    { label: "Profil", href: "/profil" },
                    { label: "Data Pegawai" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <DataPegawaiList />
                </div>
            </div>
        </>
    );
}
