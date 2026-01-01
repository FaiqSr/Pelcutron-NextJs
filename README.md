# Pelcutron - Fish Pellet Machine Monitoring System

Pelcutron adalah platform monitoring berbasis web yang dirancang untuk memantau kinerja dan data operasional alat pembuat pelet ikan secara real-time. Dibangun dengan **Next.js** dan **Firebase**, sistem ini memungkinkan pengguna untuk melacak metrik produksi dan kondisi mesin secara akurat.

## 📋 Fitur Utama

- **Real-time Monitoring**: Menampilkan data sensor dari alat pembuat pelet (seperti suhu, kecepatan motor, atau kapasitas produksi) secara langsung.
- **Dashboard Statistik**: Visualisasi data historis produksi pelet untuk analisis efisiensi alat.
- **Status Perangkat**: Indikator konektivitas dan kesehatan mesin pembuat pelet.
- **Riwayat Aktivitas**: Log operasional mesin yang mencatat waktu mulai dan berhenti produksi.
- **Notifikasi Sistem**: Peringatan otomatis jika terdeteksi anomali pada sensor mesin.

## 🚀 Teknologi

- **Framework**: Next.js (App Router).
- **Database**: Firebase Firestore untuk penyimpanan data sensor dan log.
- **Otentikasi**: Firebase Auth untuk akses kontrol pengguna.
- **Styling**: Tailwind CSS & Shadcn/UI untuk antarmuka yang modern dan responsif.

## 🛠️ Instalasi

1. **Clone repositori:**
   ```bash
   git clone [https://github.com/faiqsr/pelcutron-nextjs.git](https://github.com/faiqsr/pelcutron-nextjs.git)
   cd pelcutron-nextjs
   ```
2. **Instal dependensi**
   ```bash
   npm install
   ```
3. **Konfigurasi Environment**
   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
4. **Jalankan Website**
   ```bash
   npm run dev
   ```
⚙️ Integrasi Alat

Aplikasi ini menerima data dari perangkat IoT pembuat pelet yang dikirimkan ke Firebase Firestore. Dashboard akan secara otomatis memperbarui tampilan setiap kali ada perubahan data pada koleksi yang dipantau.
