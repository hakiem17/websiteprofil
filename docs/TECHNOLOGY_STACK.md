# Technology Stack & Architecture

## Overview
Aplikasi ini adalah **Website Profil Pemerintah Daerah** yang dibangun menggunakan teknologi web modern untuk memastikan performa tinggi, keamanan, dan kemudahan pengelolaan konten.

## Technology Stack

### Core Framework
-   **Next.js 16+ (App Router)**: Framework modern untuk React, menggunakan fitur terbaru seperti Server Actions dan Partial Prerendering.
-   **React 19**: Library UI versi terbaru dengan peningkatan performa dan fitur baru (seperti `use` hook).
-   **TypeScript 5**: Bahasa pemrograman yang memberikan keamanan tipe (type safety) untuk mengurangi bug.

### Styling & UI
-   **Tailwind CSS 4**: CSS framework versi terbaru dengan engine Rust yang lebih cepat dan setup yang lebih ringkas.
-   **Lucide React**: Koleksi ikon SVG yang ringan dan customizable.
-   **Radix UI / Headless UI**: Komponen UI accessible tanpa styling bawaan (jika digunakan).

### Backend & Database
-   **Supabase**: Backend-as-a-Service (BaaS) yang menyediakan:
    -   **PostgreSQL**: Database relasional yang kuat.
    -   **Authentication**: Manajemen user dan login (Admin).
    -   **Storage**: Penyimpanan file (gambar berita, galeri, dokumen).
    -   **Realtime**: Update data secara langsung (opsional).

### State Management & Data Fetching
-   **React Hooks**: `useState`, `useEffect` untuk state lokal.
-   **Supabase Client**: Direct database querying dari client/server components.

## Project Structure (`src/`)

### `app/` (App Router)
-   `page.tsx`: Landing page utama.
-   `layout.tsx`: Root layout (termasuk font, global style).
-   `admin/`: Halaman-halaman dashboard admin (dilindungi auth).
    -   `layout.tsx`: Layout khusus admin (Sidebar, Header).
    -   `posts/`: Manajemen Berita.
    -   `services/`: Manajemen Layanan.
    -   `menus/`: Manajemen Menu Navigasi.
-   `login/`: Halaman login admin.
-   `(public)/`: Grup rute untuk halaman publik (landing page, berita detail, dll).

### `components/`
-   `admin/`: Komponen spesifik admin (`Sidebar`, `AdminHeader`, `PostForm`).
-   `home/`: Komponen landing page (`HeroCarousel`, `LayananUtama`, `BeritaTerkini`).
-   `layout/`: Komponen global (`Header`, `Footer`).
-   `ui/`: Komponen UI reusable (`Button`, `Card`, `Modal`).

### `lib/`
-   `supabase.ts`: Konfigurasi client Supabase.
-   `utils.ts`: Fungsi helper (misal: `cn` untuk class merging).

## Data Flow
1.  **Public View**:
    -   Komponen (`LayananUtama`, `BeritaTerkini`) mengambil data langsung dari Supabase saat render (Client-side fetching di `useEffect`).
    -   Gambar diambil dari URL publik Supabase Storage.
2.  **Admin View**:
    -   Admin login via Supabase Auth.
    -   Melakukan CRUD (Create, Read, Update, Delete) ke tabel `posts`, `services`, dll.
    -   Upload gambar ke Supabase Storage, URL disimpan di database.

## Database Schema (Key Tables)
-   `posts`: Berita dan artikel (`title`, `content`, `slug`, `thumbnail_url`, `is_published`).
-   `services`: Layanan publik (`name`, `description`, `type`, `link_url`, `location`).
-   `navigation_menus`: Struktur menu dinamis (`title`, `href`, `parent_id`, `order`).
-   `users`: Pengguna admin (via Supabase Auth).

## Future Improvements
-   [ ] Implementasi Server-Side Fetching untuk SEO lebih baik pada detail berita.
-   [ ] Image Optimization menggunakan `next/image`.
-   [ ] Role-based Access Control (RBAC) jika ada banyak level admin.
