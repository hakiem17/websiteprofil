import { ServiceCatalog } from "@/components/services/ServiceCatalog";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Katalog Layanan Publik",
    description: "Temukan berbagai layanan publik pemerintah daerah yang dapat diakses secara online maupun offline.",
};

export default function LayananPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl font-bold text-primary">Katalog Layanan Publik</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Temukan berbagai layanan publik pemerintah daerah yang dapat diakses secara online maupun offline.
                </p>
            </div>

            <ServiceCatalog />
        </div>
    );
}
