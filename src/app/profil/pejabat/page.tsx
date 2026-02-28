import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ProfilPejabatList } from "@/components/profil/ProfilPejabatList";

export const metadata: Metadata = {
    title: "Profil Pejabat",
    description: "Profil pejabat dan pimpinan Pemerintah Daerah.",
};

export default function PejabatPage() {
    return (
        <>
            <PageHero
                title="Profil Pejabat"
                subtitle="Pejabat struktural di lingkungan Dinas Komunikasi dan Informatika"
                breadcrumbs={[
                    { label: "Profil", href: "/profil" },
                    { label: "Profil Pejabat" },
                ]}
            />

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-7xl mx-auto">
                    <ProfilPejabatList />
                </div>
            </div>
        </>
    );
}
