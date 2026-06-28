
<h1 align="center">
Sistem Informasi Layanan Pengajuan Surat Elektronik (E-Surat)

</h1>

> **Platform Digitalisasi Dokumen Administrasi dan Persuratan Terintegrasi UIN Ar-Raniry Banda Aceh.**

Aplikasi berbasis web ini dirancang untuk mempermudah civitas akademika dalam melakukan pengajuan draf surat secara mandiri (*Self-Service*). Sistem ini mendukung alur kerja dinamis multi-penandatangan pejabat, validasi otomatis nomor dokumen oleh sekretariat, ekspor fisik berkas ke PDF, hingga visualisasi grafik performa laporan berkas.


##  Stack Teknologi (Tech Stack)

Sistem ini dibangun menggunakan arsitektur modern *Separation of Concerns* (pemisahan backend & frontend) dengan efisiensi performa tinggi:

* **UI Framework:** `React.js` (Menggunakan pendekatan *State-Based Single Page Routing* untuk transisi antarmuka yang instan tanpa *flicker*).
* **Styling Engine:** `Tailwind CSS` (Kustomisasi tema kustom dengan dominasi palet *Dark Mode-inspired* `ungu-gelap` dan aksen `hijau-uin`).
* **Icon Library:** `Remix Icon v4.2.0` (Implementasi via CDN untuk rendering grafis vektor dan aset ikonik abstrak latar belakang yang ringan).
* **HTTP Client:** `Axios` (Manajemen *request interseptor* global untuk penanganan otomatis injeksi Bearer Token keamanan).
* **PDF Generator:** `DomPDF (Laravel-side)` (Dikonsumsi oleh React via penanganan data aliran biner / *Blob Binary Stream Response*).

### Informasi Jaringan & Integrasi API

Seluruh komunikasi data ke server backend Laravel dilakukan secara terpusat melalui *Axios Instance API Manager*.

* **Lokasi Berkas Konfigurasi:** `src/utils/api.js`
* **Fungsi Utama:**
* Mengunci alamat pangkalan URL (`baseURL`) server utama (misalnya: `http://localhost:8000/api`).
* Secara otomatis menyisipkan tajuk `Authorization: Bearer <token>` dari `localStorage` pada setiap permintaan keluar (jika token tersedia).


### Peta Navigasi & Alur Modul Halaman

Aplikasi ini mendeteksi hak akses (*Role*) pengguna secara dinamis dan membagi aksesibilitas sistem ke dalam **4 Komponen Utama**:

1.  Modul Dasbor & Profil

* **`Dashboard.jsx`:** Halaman pendaratan (*Landing*) dengan desain *clean* minimalis, efek *ambient glow*, dan *watermark* Remix Icon. Menyediakan tombol pintas langsung ke halaman profil untuk memastikan kelengkapan data induk pengguna.
* **`Profil.jsx`:** Memungkinkan pengguna mengubah Nama Lengkap dan NIM. Melakukan sinkronisasi global sehingga perubahan nama langsung berdampak pada seluruh komponen aplikasi (seperti nama di sidebar/navbar) secara *real-time*.

 2.  Modul Pengajuan Surat (Sisi Mahasiswa/User)

* **`BuatSurat.jsx`:** Formulir input dinamis yang terhubung dengan validasi skema database. Dilengkapi fitur penambahan kolom penandatangan pejabat secara dinamis (Minimal 1, Maksimal 4 pejabat) beserta urutan otoritasnya.

 3.  Modul Riwayat & Unduh Berkas

* **`RiwayatSurat.jsx`:** Menampilkan tabel linimasa status dokumen pengguna (`pending`, `disetujui`, atau `ditolak`). Dilengkapi sistem pengaman tombol unduh PDF yang akan aktif otomatis hanya jika status surat telah dikonfirmasi `disetujui` oleh sekretariat.

 4.  Modul Sekretariat (Sisi Sekretaris)

* **`SemuaSurat.jsx`:** Gerbang pengawasan semua draf masuk. Sekretaris dapat menyetujui (yang akan memicu otomatisasi cetak nomor surat kombinasi romawi dan tahun berjalan) atau menolak dokumen dengan modal dialog *pop-up* catatan penolakan.
* **`LaporanSurat.jsx`:** Dasbor analitik berkas yang menyajikan data akumulasi total berkas dan diagram batang (*progress bar*) persentase volume persebaran berdasarkan jenis klasifikasi surat.


### Keamanan Sesi (Session & Authentication Guard)

Sistem mengadopsi mekanisme **Gerbang Satpam Global** di level `App.jsx`.

1. **Auto-Login Check:** Setiap kali aplikasi dimuat ulang (*Refresh* / F5), sistem memicu layar loading *translucent* untuk memverifikasi kesahihan token lokal ke server via endpoint `GET /api/profil`. Jika valid, sesi dipulihkan tanpa memaksa user login ulang.
2. **Strict Route Protection:** Jika `user === null`, status render halaman internal akan terputus total secara otomatis dan dialihkan paksa menuju komponen `<Login />`, sehingga draf halaman internal tidak dapat dibocorkan atau diakses secara ilegal.


### Kontrak API (API Contract)

##### Modul Jenis Surat (Master Data)

1. **[GET] /api/jenis-surat**

* **Fungsi:** Mengambil semua daftar referensi kategori/jenis surat yang tersedia.
* **Autentikasi:** Ya (Bearer Token)
* **Respons Sukses (200 OK):**
```json
[
  {
    "id": 1,
    "nama_surat": "Surat Keterangan Aktif Kuliah",
    "kode": "SKAK",
    "created_at": "2026-06-24T00:00:00.000000Z",
    "updated_at": "2026-06-24T00:00:00.000000Z"
  }
]

```
##### Modul Pengajuan & Riwayat Surat (Sisi Mahasiswa/User)

2. **[POST] /api/surat**

* **Fungsi:** Mengirim draf pengajuan surat baru beserta daftar urutan tanda tangan pejabat.
* **Autentikasi:** Ya (Bearer Token)
* **Payload / Body Request (JSON):**
```json
{
  "jenis_surat_id": 1,
  "perihal": "Permohonan Beasiswa",
  "tujuan": "Wakil Dekan III Bagian Kemahasiswaan",
  "kota": "Banda Aceh",
  "tanggal_acara": "2026-07-01",
  "lampiran": "1 Berkas",
  "isi_surat": "Dengan hormat, saya yang bertanda tangan di bawah ini...",
  "atas_nama": "Kepala Bagian Tata Usaha",
  "tanda_tangan": [
    { "nama": "Dr. Ahmad, M.Pd", "jabatan": "Ketua Prodi" },
    { "nama": "Prof. Sulaiman", "jabatan": "Dekan" }
  ]
}

```

* **Respons Sukses (201 Created):**
```json
{
  "message": "Pengajuan surat berhasil dikirim",
  "data": {
    "id": 12,
    "user_id": 3,
    "jenis_surat_id": 1,
    "perihal": "Permohonan Beasiswa",
    "status": "pending",
    "tanda_tangan": [
      { "id": 1, "surat_pengajuan_id": 12, "nama": "Dr. Ahmad, M.Pd", "jabatan": "Ketua Prodi", "urutan": 1 },
      { "id": 2, "surat_pengajuan_id": 12, "nama": "Prof. Sulaiman", "jabatan": "Dekan", "urutan": 2 }
    ]
  }
}

```

3. **[GET] /api/surat/riwayat**

* **Fungsi:** Mengambil daftar riwayat surat yang pernah diajukan oleh user yang sedang login.
* **Autentikasi:** Ya (Bearer Token)
* **Respons Sukses (200 OK):**
```json
[
  {
    "id": 12,
    "nomor_surat": "001/SKAK/VI/2026",
    "perihal": "Permohonan Beasiswa",
    "status": "disetujui",
    "catatan_sekretaris": null,
    "jenis_surat": {
      "id": 1,
      "nama_surat": "Surat Keterangan Aktif Kuliah"
    }
  }
]

```
4.  **[GET] /api/surat/{id}/download**

* **Fungsi:** Mengunduh berkas fisik surat dalam format PDF (hanya untuk surat berstatus `disetujui`).
* **Autentikasi:** Ya (Bearer Token)
* **Respons Sukses (200 OK):** Mengembalikan file biner (`application/pdf`).
* **Respons Gagal (403 Forbidden):**
```json
{ "message": "Surat belum disetujui, PDF belum bisa diunduh." }

```

#####  Modul Sekretariat (Sisi Sekretaris)

5. **[GET] /api/surat/semua**

* **Fungsi:** Melihat seluruh pengajuan surat dari semua user untuk keperluan validasi.
* **Autentikasi:** Ya + Middleware `sekretaris`
* **Respons Sukses (200 OK):**
```json
[
  {
    "id": 12,
    "perihal": "Permohonan Beasiswa",
    "status": "pending",
    "user": { "id": 3, "name": "Fulan", "email": "fulan@ar-raniry.ac.id" },
    "jenis_surat": { "id": 1, "kode": "SKAK", "nama_surat": "Surat Keterangan Aktif Kuliah" }
  }
]

```

6. **[PUT] /api/surat/{id}/approve**

* **Fungsi:** Menyetujui surat dan generate nomor surat otomatis berdasarkan urutan, kode, bulan romawi, dan tahun saat ini.
* **Autentikasi:** Ya + Middleware `sekretaris`
* **Respons Sukses (200 OK):**
```json
{
  "message": "Surat berhasil disetujui",
  "data": {
    "id": 12,
    "status": "disetujui",
    "nomor_surat": "001/SKAK/VI/2026"
  }
}

```
7. **[PUT] /api/surat/{id}/tolak**

* **Fungsi:** Menolak pengajuan surat dengan menyertakan alasan.
* **Autentikasi:** Ya + Middleware `sekretaris`
* **Payload / Body Request (JSON):**
```json
{ "catatan_sekretaris": "Format isi surat tidak baku dan nama penandatangan salah." }

```


* **Respons Sukses (200 OK):**
```json
{
  "message": "Surat ditolak",
  "data": {
    "id": 12,
    "status": "ditolak",
    "catatan_sekretaris": "Format isi surat tidak baku dan nama penandatangan salah."
  }
}

```

8. **[GET] /api/surat/laporan**

* **Fungsi:** Mengambil data ringkasan total statistik dokumen untuk konsumsi grafik dasbor.
* **Autentikasi:** Ya + Middleware `sekretaris`
* **Respons Sukses (200 OK):**
```json
{
  "total": 45,
  "pending": 5,
  "disetujui": 35,
  "ditolak": 5,
  "per_jenis": [
    { "nama_surat": "Surat Keterangan Aktif Kuliah", "jumlah": 20 },
    { "nama_surat": "Surat Izin Penelitian", "jumlah": 15 }
  ]
}

```

#### Modul Profil Pengguna

9. **[GET] /api/profil**

* **Fungsi:** Mengambil detail informasi profil pengguna yang sedang login.
* **Autentikasi:** Ya (Bearer Token)
* **Respons Sukses (200 OK):**
```json
{
  "id": 3,
  "name": "M. Al-Fatih",
  "nim": "210401011",
  "email": "alfatih@ar-raniry.ac.id",
  "role": "mahasiswa"
}

```
10. **[PUT] /api/profil**

* **Fungsi:** Mengubah data Nama Lengkap dan NIM/Nomor Induk pengguna.
* **Autentikasi:** Ya (Bearer Token)
* **Payload / Body Request (JSON):**
```json
{
  "name": "M. Al-Fatih S.Kom",
  "nim": "210401011"
}

```


* **Respons Sukses (200 OK):**
```json
{
  "message": "Profil berhasil diperbarui",
  "user": {
    "id": 3,
    "name": "M. Al-Fatih S.Kom",
    "nim": "210401011",
    "email": "alfatih@ar-raniry.ac.id",
    "role": "mahasiswa"
  }
}

```
