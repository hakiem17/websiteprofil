"use client";

import { PageHero } from "@/components/layout/PageHero";
import { BeritaTerkini } from "@/components/home/BeritaTerkini";

export default function BeritaPage() {
    return (
        <main>
            <PageHero
                title="Berita & Informasi"
                subtitle="Berita terkini, artikel, dan pengumuman resmi dari Pemerintah Daerah."
                breadcrumbs={[
                    { label: "Beranda", href: "/" },
                    { label: "Informasi", href: "/informasi" },
                    { label: "Berita", href: "/informasi/berita", active: true },
                ]}
            />
            {/* Reuse the BeritaTerkini component content style but maybe expanded. 
                For now reusing the component is efficient as it already has filters. 
                We might want to tweak it to handle 'all' items if pagination was needed, 
                but for static demo this is perfect.
             */}
            <BeritaTerkini />
        </main>
    );
}
