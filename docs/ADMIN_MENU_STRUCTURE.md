# Struktur Menu Admin

Dokumen ini menjelaskan struktur menu dan halaman yang tersedia di Dashboard Admin.

## Ringkasan Menu Sidebar

Berikut adalah struktur navigasi utama yang terdapat di Sidebar Admin:

### 1. MAIN MENU
- **Dashboard** (`/admin`)
  - Halaman utama dengan ringkasan statistik.
  - Status: ✅ Terimplementasi

### 2. KONTEN WEBSITE
- **Berita & Artikel** (`/admin/posts`)
  - Manajemen postingan blog/berita.
  - Status: ✅ Terimplementasi
- **Agenda Kegiatan** (`/admin/agenda`)
  - Manajemen jadwal kegiatan.
  - Status: ⚠️ Belum Terimplementasi (Link ada, Halaman belum ada)
- **Pengumuman** (`/admin/announcements`)
  - Manajemen pengumuman penting.
  - Status: ⚠️ Belum Terimplementasi (Link ada, Halaman belum ada)

### 3. LAYANAN & MEDIA
- **Layanan Publik** (`/admin/services`)
  - Manajemen daftar layanan (Online/Offline).
  - Status: ✅ Terimplementasi
- **Galeri Foto** (`/admin/galleries`)
  - Manajemen album dan foto kegiatan.
  - Status: ✅ Terimplementasi
- **JDIH / Dokumen** (`/admin/documents`)
  - Manajemen dokumen publik dan arsip.
  - Status: ✅ Terimplementasi

### 4. PENGATURAN
- **Manajemen Menu** (`/admin/menus`)
  - Pengaturan struktur menu navigasi publik (Header).
  - Status: ✅ Terimplementasi
- **Identitas Website** (`/admin/settings`)
  - Pengaturan nama instansi, deskripsi, dan logo website.
  - Status: ✅ Terimplementasi
- **Pengguna** (`/admin/users`)
  - Manajemen pengguna admin.
  - Status: ⚠️ Belum Terimplementasi (Link ada, Halaman belum ada)

## Detail Halaman & Fitur

### Dashboard (`/admin`)
- Menampilkan kartu ringkasan jumlah:
  - Total Postingan
  - Total Layanan
  - Total Galeri
  - Total Dokumen

### Manajemen Berita (`/admin/posts`)
- List semua berita dengan status (Published/Draft).
- Fitur Tambah Berita Baru.
- Fitur Edit dan Hapus Berita.

### Manajemen Layanan (`/admin/services`)
- List layanan publik.
- Mengelola jenis layanan (Online/Offline).
- Upload ikon layanan.

### Identitas Website (`/admin/settings`)
- Form untuk mengubah Nama Instansi.
- Form untuk mengubah Deskripsi (Tagline).
- Upload Logo Website.
