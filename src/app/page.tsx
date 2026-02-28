import { HeroCarousel } from "@/components/home/HeroCarousel";
import { LayananUtama } from "@/components/home/LayananUtama";
import { BeritaTerkini } from "@/components/home/BeritaTerkini";
import { GaleriFoto } from "@/components/home/GaleriFoto";
import { StatistikSection } from "@/components/home/StatistikSection";
import { VideoTerbaru } from "@/components/home/VideoTerbaru";

export default function Home() {
  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Layanan Utama */}
      <LayananUtama />

      {/* Statistik */}
      <StatistikSection />

      {/* Berita Terkini */}
      <BeritaTerkini />

      {/* Galeri Foto */}
      <GaleriFoto />

      {/* Video Terbaru */}
      <VideoTerbaru />
    </div>
  );
}
