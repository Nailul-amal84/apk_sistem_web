# Identitas Kelompok

---

**Nama Kelompok:** `...`

**Nama Proyek / Aplikasi:** `...`

**Jumlah Anggota:** `...` orang

**Repositori:** `https://github.com/...`

---

## Anggota & Role

**Anggota 1**
- Nama Lengkap: `Arif Alfarisi`
- NIM: `230705080`
- Role: `FronEnd`
- Teknologi: `React Js`

**Anggota 2**
- Nama Lengkap: `Nailul amal`
- NIM: `230705078`
- Role: `BackEnd`
- Teknologi: `Laravel`

---


## Stack Teknologi

**Frontend:** `React.js`

* **Utility & UI Styling:** Tailwind CSS *(Custom Theme Color: Purple-Dark, UIN-Green, Gold)*
* **State Management:** React Hooks (`useState`, `useEffect`)
* **HTTP Client:** Axios *(Konfigurasi base URL untuk komunikasi ke Backend Laravel)*
* **Icons Pack:** `@remixicon/react`

**Backend:** `Laravel` *(wajib)*

* **Arsitektur:** RESTful API Route (`routes/api.php`)
* **Fitur Utama Backend:** Laravel HTTP Client (`Illuminate\Support\Facades\Http`) sebagai *service/proxy proxy* untuk konsumsi data dinamis pihak ketiga, Eloquent ORM, Custom Service Classes (`App\Services`), Database Seeders & Factories.

**Database:** `MySQL`

* **Driver:** `pdo_mysql`
* **Struktur Utama:** Tabel `jenis_surat` dengan skema *auto-increment primary key* `id`, `nama_surat`, `kode`, dan seeder otomatis untuk replikasi data penomoran dokumen di lingkungan kampus.

**DevOps / Infrastruktur:** `GitHub & GitHub Raw Content API`

* **Version Control:** Git & GitHub *(Sebagai repositori utama kode program)*
* **Data Hosting / Dataset Storage:** GitHub Repositories (*Public/Private*) sebagai *Decoupled Database Storage* untuk menyimpan file eksternal `sample-data.json` yang berisi template draf isi utama dokumen UIN.## Arsitektur Aplikasi

*(Jelaskan secara singkat bagaimana aplikasi-aplikasi dalam proyek ini saling terhubung)*

## Alur Kerja Utama 2 Aplikasi (Frontend & Backend)

Secara garis besar, kedua aplikasi ini bekerja dengan prinsip **Client-Server Architecture** yang dihubungkan oleh protokol HTTP melalui format pertukaran data **JSON**.

1. **Sisi Pengguna (Frontend React):** Ketika pengguna berinteraksi di peramban (seperti memilih menu atau mengeklik tombol "Gunakan Template"), React tidak meminta halaman web baru ke server (seperti arsitektur monolitik), melainkan memicu fungsi *asynchronous* (`fetch` atau Axios).
2. **Sisi Pemrosesan (Backend Laravel):** Laravel bertindak sebagai penyedia layanan (*service provider*). Laravel menerima permintaan (*request*) dari React, melakukan validasi, berkomunikasi dengan database MySQL atau pihak ketiga (GitHub API), lalu mengirimkan hasilnya kembali dalam bentuk data mentah terstruktur (JSON response).
3. **Rendering Dinamis:** React menerima data JSON tersebut, memperbarui *state* komponen secara lokal, dan merender ulang tampilan secara instan tanpa perlu memuat ulang (*refresh*) seluruh halaman.

**Aplikasi 1 — Frontend**

* Nama Aplikasi: `E-Surat Portal Client (React.js)`
* Deskripsi Singkat: Aplikasi berbasis Single Page Application (SPA) yang menyajikan antarmuka interaktif bagi sivitas akademika untuk mengelola pengajuan dokumen resmi, mencari draf, melihat visualisasi kartu template surat, dan mengisi form pembuatan surat secara instan tanpa *page-refresh*.
* Berkomunikasi dengan: `Aplikasi 3 — Backend (Laravel)` dengan mengirimkan HTTP Request menggunakan Axios untuk autentikasi user, mengambil opsi dropdown dari database, serta mengambil koleksi dataset template surat.

**Aplikasi 3 — Backend (Laravel)**

* Nama Aplikasi / Service: `E-Surat Core API Engine`
* Deskripsi Singkat: Server backend utama yang mengekspos endpoint API, menangani validasi keamanan, mengelola migrasi serta seeder database MySQL, dan memiliki lapisan *Service Class* khusus untuk menarik data eksternal secara dinamis dari GitHub Raw Content API.
* Menyediakan layanan untuk: `Aplikasi 1 — Frontend` dengan menyediakan rute API terproteksi (seperti `/api/jenis-surat` dan `/template`) serta memproses data pasca-kirim (*post-submission*) dari formulir pembuatan surat.

