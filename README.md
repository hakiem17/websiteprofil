# Website Profil Perangkat Daerah 🏛️

**Portal resmi website profil instansi pemerintah daerah — transparan, modern, dan mudah dikelola.**

Dibangun untuk Dinas Komunikasi, Informatika, Statistik, dan Persandian Kabupaten Hulu Sungai Tengah sebagai wujud keterbukaan informasi publik berbasis teknologi web modern.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 🎯 Tentang Aplikasi

**Website Profil Perangkat Daerah** adalah portal informasi publik resmi yang menyediakan akses terbuka ke profil instansi, berita terkini, layanan publik, dokumen resmi, galeri kegiatan, dan agenda pimpinan. Dilengkapi dengan **panel admin CMS** yang memungkinkan pengelolaan seluruh konten website tanpa memerlukan keahlian teknis.

Aplikasi ini menggantikan website statis konvensional dengan solusi dinamis berbasis database yang dapat diperbarui secara real-time.

---

## ✨ Fitur Utama

### 🌐 Portal Publik
| Fitur | Keterangan |
|---|---|
| **Hero Carousel** | Slider banner dinamis dengan konten CMS |
| **Berita Terkini** | Artikel berita dengan kategori dan rich text editor |
| **Layanan Publik** | Katalog layanan online & offline dengan ikon dan deskripsi |
| **Statistik Instansi** | Visualisasi data jumlah pegawai, layanan, dan kinerja |
| **Galeri Foto** | Galeri kegiatan dengan lightbox viewer |
| **Video Terbaru** | Feed otomatis dari channel YouTube resmi instansi |
| **Dark Mode** | Tema gelap/terang dengan toggle dan persistensi preferensi |

### 🏛️ Profil Instansi
- **Gambaran Umum** — Sejarah, Visi & Misi, Tugas & Fungsi
- **Struktur Organisasi** — Bagan struktur dengan data dinamis
- **Pejabat & Pegawai** — Profil pejabat dengan foto dan jabatan
- **Kedudukan & Maklumat** — Halaman statis yang bisa diedit via CMS
- **LHKPN** — Tautan ke data Laporan Harta Kekayaan Penyelenggara Negara

### 📢 Informasi Publik
- **Pengumuman** — Pengumuman resmi instansi dengan dukungan lampiran PDF
- **Agenda Pimpinan** — Jadwal kegiatan dengan status published
- **Unduhan & Dokumen JDIH** — Arsip digital regulasi dan peraturan
- **Data Statistik** — Halaman data statistik publik
- **Produk Hukum** — Peraturan perundangan instansi
- **Laporan Layanan & Aset** — Halaman transparansi kinerja
- **Pengadaan** — Informasi pengadaan barang/jasa
- **Alur Kunjungan & Saluran Pengaduan** — Panduan layanan publik

### 🔐 Panel Admin (CMS)
| Modul Admin | Fitur |
|---|---|
| **Dashboard** | Statistik pengunjung real-time, grafik 7 hari, agenda terdekat |
| **Manajemen Berita** | Buat/edit/hapus/publish artikel dengan TipTap rich text editor |
| **Manajemen Layanan** | CRUD layanan publik dengan ikon, deskripsi, dan link |
| **Manajemen Dokumen** | Upload dan kelola dokumen/arsip digital |
| **Manajemen Pegawai** | Data ASN dengan tipe jabatan dan foto |
| **Manajemen Galeri** | Upload dan organisasi galeri foto kegiatan |
| **Manajemen Agenda** | Penjadwalan kegiatan pimpinan |
| **Manajemen Pengumuman** | Penerbitan pengumuman dengan lampiran PDF |
| **Halaman Profil** | Edit konten profil instansi (visi-misi, sejarah, dll.) via CMS |
| **Program/Dokumen Program** | Kelola dokumen program dan navigasi |
| **Pengaturan Situs** | Konfigurasi nama instansi, logo, kontak |
| **Manajemen Menu** | Kustomisasi navigasi website |
| **Manajemen Pengguna** | CRUD akun admin |
| **Statistik Pengunjung** | Tracking pengunjung harian dan total |

---

## 🏗️ Arsitektur

```
Website Profil
├── Frontend (Next.js 16 App Router)
│   ├── Public Portal      → Halaman-halaman publik yang dapat diakses umum
│   └── Admin Panel (CMS)  → Dashboard pengelola konten (autentikasi required)
│
├── Backend (Supabase)
│   ├── PostgreSQL DB      → Penyimpanan seluruh konten & konfigurasi
│   ├── Auth               → Autentikasi berbasis JWT (email + password)
│   ├── Storage            → Upload file (foto, PDF, dokumen)
│   └── Row Level Security → Kebijakan akses data per tabel
│
└── API Routes (Next.js)
    ├── /api/visitor-stats → Tracking dan agregasi pengunjung
    └── /api/youtube       → Proxy RSS feed YouTube channel instansi
```

### Alur Data

```
[Pengguna Publik]
    │
    ▼
[Next.js Pages] ──→ [Supabase DB] ──→ [Data Konten Publik]
                 ──→ [YouTube API]  ──→ [Feed Video Terbaru]

[Admin]
    │
    ▼
[Login Page] ──→ [Supabase Auth] ──→ [Admin Dashboard]
                                        │
                                        ▼
                                  [Supabase CRUD]
                                  [Supabase Storage]
```

---

## 🗂️ Struktur Proyek

```
website-profil/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Halaman beranda
│   │   ├── layout.tsx               # Root layout (font, theme, metadata)
│   │   ├── profil/                  # Halaman profil instansi
│   │   │   ├── gambaran-umum/
│   │   │   ├── visi-misi/
│   │   │   ├── sejarah/
│   │   │   ├── tugas-fungsi/
│   │   │   ├── struktur/
│   │   │   ├── pejabat/
│   │   │   ├── pegawai/
│   │   │   ├── kedudukan/
│   │   │   ├── maklumat/
│   │   │   └── lhkpn/
│   │   ├── informasi/               # Halaman informasi publik
│   │   │   ├── berita/
│   │   │   ├── pengumuman/
│   │   │   ├── agenda-pimpinan/
│   │   │   ├── unduhan/
│   │   │   ├── produk-hukum/
│   │   │   ├── data-statistik/
│   │   │   ├── laporan-layanan/
│   │   │   ├── aset-dinas/
│   │   │   ├── pengadaan/
│   │   │   ├── alur-kunjungan/
│   │   │   ├── saluran-pengaduan/
│   │   │   └── layanan-informasi-publik/
│   │   ├── layanan/                 # Halaman katalog layanan
│   │   ├── galeri/                  # Halaman galeri foto
│   │   ├── program/                 # Halaman program & dokumen
│   │   ├── kontak/                  # Halaman kontak
│   │   ├── kebijakan/              # Kebijakan privasi
│   │   ├── login/                   # Halaman login admin
│   │   ├── admin/                   # Panel admin (protected)
│   │   │   ├── page.tsx             # Dashboard admin
│   │   │   ├── posts/              # Manajemen berita
│   │   │   ├── services/           # Manajemen layanan
│   │   │   ├── documents/          # Manajemen dokumen
│   │   │   ├── pegawai/            # Manajemen pegawai
│   │   │   ├── galleries/          # Manajemen galeri
│   │   │   ├── agenda/             # Manajemen agenda
│   │   │   ├── announcements/      # Manajemen pengumuman
│   │   │   ├── profile-pages/      # Edit halaman profil
│   │   │   ├── program/            # Manajemen program
│   │   │   ├── menus/              # Manajemen menu
│   │   │   ├── users/              # Manajemen pengguna
│   │   │   └── settings/           # Pengaturan situs
│   │   └── api/
│   │       ├── visitor-stats/      # API statistik pengunjung
│   │       └── youtube/            # API proxy YouTube RSS
│   │
│   ├── components/
│   │   ├── home/                   # Komponen halaman beranda
│   │   │   ├── HeroCarousel.tsx
│   │   │   ├── BeritaTerkini.tsx
│   │   │   ├── LayananUtama.tsx
│   │   │   ├── StatistikSection.tsx
│   │   │   ├── GaleriFoto.tsx
│   │   │   ├── VideoTerbaru.tsx
│   │   │   └── ProfilPejabat.tsx
│   │   ├── layout/                 # Komponen navigasi & layout
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── admin/                  # Komponen UI panel admin
│   │   │   └── Sidebar.tsx
│   │   ├── ui/                     # Komponen UI reusable (shadcn-style)
│   │   │   └── RichTextEditor.tsx  # TipTap editor
│   │   ├── a11y/                   # Komponen aksesibilitas
│   │   ├── ThemeToggle.tsx         # Toggle dark/light mode
│   │   └── theme-provider.tsx
│   │
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client (public)
│   │   ├── supabase-sppd.ts        # Supabase client (SPPD)
│   │   ├── profile-service.ts      # Layanan fetch profil CMS
│   │   └── utils.ts
│   │
│   ├── hooks/                      # Custom React hooks
│   ├── middleware.ts                # Proteksi route admin
│   └── types/                      # TypeScript type definitions
│
├── supabase/
│   ├── schema.sql                  # Skema utama database
│   ├── migrations/                 # Riwayat migrasi database
│   └── seeds/                      # Data awal (seed)
│
├── public/                         # Aset statis (logo, favicon)
├── docs/                           # Dokumentasi proyek
└── scripts/                        # Skrip utilitas
```

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) — App Router, Server Components |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Rich Text** | [TipTap v3](https://tiptap.dev/) — Editor artikel & konten CMS |
| **Icons** | [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) |
| **Backend & DB** | [Supabase](https://supabase.com/) — PostgreSQL, Auth, Storage, RLS |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com/) — Select, Label, Slot |
| **Date Utility** | [date-fns](https://date-fns.org/) dengan locale bahasa Indonesia |
| **Theme** | [next-themes](https://github.com/pacocoursey/next-themes) — Dark/Light mode |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) — Toast notification |
| **Middleware** | Next.js Middleware — Proteksi route admin |

---

## 🗄️ Database Schema

Database utama menggunakan **PostgreSQL via Supabase** dengan tabel-tabel berikut:

| Tabel | Keterangan |
|---|---|
| `posts` | Artikel berita/konten dengan status published |
| `services` | Layanan publik instansi |
| `documents` | Arsip dan dokumen JDIH |
| `pegawai` | Data ASN (Aparatur Sipil Negara) |
| `agenda` | Jadwal kegiatan pimpinan |
| `announcements` | Pengumuman resmi |
| `galleries` | Foto kegiatan instansi |
| `profile_pages` | Konten dinamis halaman profil (CMS) |
| `site_settings` | Konfigurasi website (nama, logo, kontak) |
| `menus` | Konfigurasi navigasi menu |
| `program_documents` | Dokumen program kegiatan |
| `visitor_logs` | Log statistik pengunjung |

---

## 🚀 Cara Instalasi

### Prasyarat
- Node.js **18+**
- npm atau yarn
- Akun [Supabase](https://supabase.com/) (gratis)

### Langkah Instalasi

1. **Clone repositori**
   ```bash
   git clone https://github.com/username/website-profil.git
   cd website-profil
   ```

2. **Install dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi environment**

   Buat file `.env.local` di root proyek:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Setup database**

   Jalankan file `supabase/schema.sql` di Supabase SQL Editor, lalu jalankan file migrasi di `supabase/migrations/` secara berurutan.

5. **Jalankan development server**
   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

6. **Build production**
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Autentikasi Admin

Akses panel admin tersedia di `/login`. Akun admin dibuat melalui **Supabase Auth** (Email + Password). Middleware Next.js melindungi seluruh route `/admin/*` agar hanya dapat diakses oleh pengguna yang sudah login.

Role management menggunakan **Row Level Security (RLS)** di Supabase:
- **Public** — Baca data yang dipublikasikan
- **Admin** — Akses penuh CRUD semua tabel

---

## 📂 Rute Aplikasi

| URL | Keterangan |
|---|---|
| `/` | Beranda |
| `/profil/[slug]` | Halaman profil instansi |
| `/informasi/berita` | Daftar berita |
| `/informasi/pengumuman` | Daftar pengumuman |
| `/informasi/agenda-pimpinan` | Jadwal agenda pimpinan |
| `/informasi/unduhan` | Daftar unduhan dokumen |
| `/layanan` | Katalog layanan publik |
| `/galeri` | Galeri foto kegiatan |
| `/program` | Dokumen program |
| `/kontak` | Halaman kontak |
| `/login` | Login admin |
| `/admin` | Dashboard admin (protected) |
| `/admin/posts` | Kelola berita |
| `/admin/services` | Kelola layanan |
| `/admin/documents` | Kelola dokumen |
| `/admin/pegawai` | Kelola pegawai |
| `/admin/galleries` | Kelola galeri |
| `/admin/agenda` | Kelola agenda |
| `/admin/announcements` | Kelola pengumuman |
| `/admin/profile-pages` | Edit halaman profil |
| `/admin/settings` | Pengaturan situs |
| `/admin/users` | Kelola pengguna |

---

## 🤝 Kontribusi

Proyek ini dikembangkan khusus untuk kepentingan internal instansi. Saran dan laporan bug dapat disampaikan melalui sistem pengaduan internal.

---

## 📄 Lisensi

Copyright © 2026 Dinas Komunikasi, Informatika, Statistik, dan Persandian  
Kabupaten Hulu Sungai Tengah. All rights reserved.
