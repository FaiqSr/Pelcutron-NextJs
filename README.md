# PetCare Medical Records Management System

Sistem manajemen rekam medis hewan modern yang dibangun menggunakan **Next.js**, dirancang khusus untuk membantu perawat hewan dalam mengelola data pasien (hewan), klien (pemilik), dan dokter hewan secara efisien.

## 📋 Fitur Utama

- **Manajemen Pasien (Hewan)**: Registrasi hewan peliharaan, riwayat spesies, ras, dan profil kesehatan lengkap.
- **Manajemen Klien (Pemilik)**: Database informasi kontak pemilik hewan dan integrasi dengan data peliharaan mereka.
- **Portal Dokter**: Penjadwalan konsultasi dan penugasan dokter hewan spesifik untuk setiap kasus.
- **Rekam Medis Elektronik (EMR)**: Pencatatan riwayat medis, diagnosis, hasil laboratorium, dan pengobatan secara kronologis.
- **Dashboard Perawat**: Ringkasan aktivitas harian, status pasien rawat inap, dan jadwal kontrol.
- **Otentikasi Keamanan**: Akses berbasis peran (RBAC) untuk memastikan kerahasiaan data medis.

## 🚀 Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore & Firebase Auth)
- **Icons**: Lucide React

## 🛠️ Instalasi

1. **Clone repositori:**
   ```bash
   git clone [https://github.com/username/project-name.git](https://github.com/username/project-name.git)
   cd project-name
   ```
2. **Install Dependecy**
   ```bash
   npm install
   # atau
   yarn install
   ```
3. **Konfigurasi Environment Variables: Buat file .env.local di akar direktori dan tambahkan kredensial Firebase Anda:**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
4. **Run Website**
   ```bash
   npm run dev
   ```
