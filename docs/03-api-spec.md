# API Specification

> Dokumentasikan setiap endpoint yang dikembangkan maupun yang dikonsumsi dari layanan eksternal.
> Salin dan ulangi blok di bawah untuk setiap endpoint tambahan.


## Endpoint 1 — Registrasi Pengguna Baru

**Method:** `POST`

**URL:** `/api/register`

**Deskripsi:** Membuat akun pengguna baru (default role: `user`) ke dalam database dan langsung menerbitkan token akses awal.

**Autentikasi Diperlukan:** `Tidak`

**Sumber:** `Internal System — MySQL Database (Tabel users)`

**Request Headers:**

```
Content-Type: application/json

```

**Request Body:**

```json
{
  "name": "string (required)",
  "email": "string (required|email|unique)",
  "password": "string (required|min:6)",
  "nim": "string (nullable)"
}

```

**Response Sukses (`201 Created`):**

```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "name": "Arif Al Farisi",
    "email": "arif@uin.ac.id",
    "nim": "123456789",
    "role": "user",
    "created_at": "2026-06-27T17:50:00.000000Z"
  },
  "token": "1|qhY7XNzkSsdO9vL8FfP9v..."
}

```

---

## Endpoint 2 — Login Pengguna

**Method:** `POST`

**URL:** `/api/login`

**Deskripsi:** Memvalidasi email dan password pengguna, serta mengembalikan token autentikasi Sanctum jika berhasil.

**Autentikasi Diperlukan:** `Tidak`

**Sumber:** `Internal System — MySQL Database (Tabel users)`

**Request Headers:**

```
Content-Type: application/json

```

**Request Body:**

```json
{
  "email": "string (required|email)",
  "password": "string (required)"
}

```

**Response Sukses (`200 OK`):**

```json
{
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "name": "Arif Al Farisi",
    "email": "arif@uin.ac.id",
    "nim": "123456789",
    "role": "user"
  },
  "token": "2|pLaTextTok781XnZ..."
}

```

---

## Endpoint 3 — Update Profil Pengguna

**Method:** `PUT` / `POST` *(Menyesuaikan rute)*

**URL:** `/api/profile/update`

**Deskripsi:** Memperbarui data nama dan NIM milik pengguna yang sedang login saat ini.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System — MySQL Database (Tabel users)`

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json

```

**Request Body:**

```json
{
  "name": "string (required)",
  "nim": "string (nullable)"
}

```

**Response Sukses (`200 OK`):**

```json
{
  "message": "Profil berhasil diperbarui",
  "user": {
    "id": 1,
    "name": "Arif Al Farisi Terbaru",
    "email": "arif@uin.ac.id",
    "nim": "987654321",
    "role": "user"
  }
}

```

---

## Endpoint 4 — Get All Jenis Surat (Dropdown Pilihan)

**Method:** `GET`

**URL:** `/api/jenis-surat`

**Deskripsi:** Mengambil semua daftar tipe jenis surat dari database untuk dipasang di dropdown form komponen React.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System — MySQL Database (Tabel jenis_surat)`

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json

```

**Request Body:** `-`

**Response Sukses (`200 OK`):**

```json
[
  {
    "id": 1,
    "nama_surat": "Surat Keterangan Aktif Kuliah",
    "kode": "SRT01"
  },
  {
    "id": 2,
    "nama_surat": "Surat Permohonan Izin Penelitian",
    "kode": "SRT02"
  }
]

```

---

## Endpoint 5 — Get Dataset Draf Surat via GitHub Proxy

**Method:** `GET`

**URL:** `/api/template/{kode}`

**Deskripsi:** Mengambil teks draf contoh surat spesifik berdasarkan parameternya yang ditarik dari GitHub Raw Data menggunakan Service Class.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Third-Party API — GitHub Raw Content API`

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json

```

**Request Body:** `-`

**Response Sukses (`200 OK`):**

```json
{
  "status": "success",
  "data": {
    "kode": "SRT01",
    "nama_surat": "Surat Keterangan Aktif Kuliah",
    "template": "Dengan ini Dekan Fakultas menerangkan bahwa mahasiswa...\nNama: [Nama Lengkap]"
  }
}

```

---

## Endpoint 6 — Ajukan Pembuatan Surat Baru

**Method:** `POST`

**URL:** `/api/buat-surat` *(Atau rute penampung `store`)*

**Deskripsi:** Menyimpan pengajuan draf surat baru beserta data dinamis array data penanda tangan (maksimal 4 baris) ke database dengan status awal `pending`.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System — MySQL Database (Tabel surat_pengajuans & penanda_tangans)`

**Request Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json

```

**Request Body:**

```json
{
  "jenis_surat_id": 1,
  "lampiran": "1 Berkas",
  "tujuan": "Kepada Yth. Kepala Biro UIN",
  "kota": "Banda Aceh",
  "perihal": "Permohonan Aktif Kembali",
  "tanggal_acara": "2026-07-10",
  "isi_surat": "Isi detail draf teks surat...",
  "atas_nama": "Dekan Fakultas",
  "tanda_tangan": [
    { "nama": "Dr. Ahmad, M.A", "jabatan": "Dekan" },
    { "nama": "Hasan, M.Sc", "jabatan": "Sekretaris" }
  ]
}

```

**Response Sukses (`201 Created`):**

```json
{
  "message": "Pengajuan surat berhasil dikirim",
  "data": {
    "id": 15,
    "user_id": 1,
    "jenis_surat_id": 1,
    "perihal": "Permohonan Aktif Kembali",
    "status": "pending",
    "created_at": "2026-06-27T17:55:00.000000Z",
    "tanda_tangan": [
      { "id": 1, "surat_pengajuan_id": 15, "nama": "Dr. Ahmad, M.A", "jabatan": "Dekan", "urutan": 1 },
      { "id": 2, "surat_pengajuan_id": 15, "nama": "Hasan, M.Sc", "jabatan": "Sekretaris", "urutan": 2 }
    ]
  }
}

```

---

## Endpoint 7 — Ambil Riwayat Surat Saya (Sisi Mahasiswa)

**Method:** `GET`

**URL:** `/api/riwayat`

**Deskripsi:** Menampilkan semua daftar surat yang diajukan oleh user yang sedang login, diurutkan dari yang paling baru.

**Autentikasi Diperlukan:** `Ya`

**Sumber:** `Internal System — MySQL Database`

**Request Headers:**

```
Authorization: Bearer <token>

```

**Response Sukses (`200 OK`):**

```json
[
  {
    "id": 15,
    "user_id": 1,
    "perihal": "Permohonan Aktif Kembali",
    "status": "pending",
    "jenis_surat": {
      "id": 1,
      "nama_surat": "Surat Keterangan Aktif Kuliah",
      "kode": "SRT01"
    }
  }
]

```

---

## Endpoint 8 — Ambil Semua Pengajuan (Sisi Sekretaris / Admin)

**Method:** `GET`

**URL:** `/api/admin/semua-pengajuan`

**Deskripsi:** Mengambil total keseluruhan data pengajuan surat masuk dari semua mahasiswa untuk divalidasi oleh sekretaris.

**Autentikasi Diperlukan:** `Ya (Role Sekretaris)`

**Response Sukses (`200 OK`):**

```json
[
  {
    "id": 15,
    "status": "pending",
    "user": { "id": 1, "name": "Arif Al Farisi" },
    "jenis_surat": { "nama_surat": "Surat Keterangan Aktif Kuliah" }
  }
]

```

---

## Endpoint 9 — Setujui Pengajuan Surat & Generate Nomor Otomatis

**Method:** `POST` / `PUT`

**URL:** `/api/admin/approve/{id}`

**Deskripsi:** Mengubah status menjadi `disetujui` dan menyusun nomor surat resmi otomatis dengan format penomoran `[No]/[KodeSurat]/[BulanRomawi]/[Tahun]`.

**Autentikasi Diperlukan:** `Ya (Role Sekretaris)`

**Response Sukses (`200 OK`):**

```json
{
  "message": "Surat berhasil disetujui",
  "data": {
    "id": 15,
    "status": "disetujui",
    "nomor_surat": "001/SRT01/VI/2026"
  }
}

```

---

## Endpoint 10 — Tolak Pengajuan Surat

**Method:** `POST`

**URL:** `/api/admin/tolak/{id}`

**Deskripsi:** Mengubah status dokumen menjadi `ditolak` disertai input teks alasan penolakan.

**Request Body:**

```json
{
  "catatan_sekretaris": "Format penulisan NIM salah, harap perbaiki."
}

```

**Response Sukses (`200 OK`):**

```json
{
  "message": "Surat ditolak",
  "data": {
    "id": 15,
    "status": "ditolak",
    "catatan_sekretaris": "Format penulisan NIM salah, harap perbaiki."
  }
}

```

---

## Endpoint 11 — Unduh File PDF Surat Resmi

**Method:** `GET`

**URL:** `/api/surat/download-pdf/{id}`

**Deskripsi:** Memvalidasi status surat lalu mengunduh konversi dokumen HTML murni menjadi file `.pdf` siap cetak menggunakan wrapper *Barryvdh DomPDF*.

**Autentikasi Diperlukan:** `Ya (Pemilik Surat / Sekretaris)`

**Response Sukses (`200 OK`):** `File Binary Data (Stream Application/PDF)`

---

## Endpoint 12 — Ringkasan Laporan Statistik (Dashboard Analytics)

**Method:** `GET`

**URL:** `/api/laporan`

**Deskripsi:** Mengkalkulasi angka hitungan total penstatusan surat dan pemetaan grafik frekuensi jumlah surat berdasarkan tipenya.

**Autentikasi Diperlukan:** `Ya`

**Response Sukses (`200 OK`):**

```json
{
  "total": 120,
  "pending": 20,
  "disetujui": 90,
  "ditolak": 10,
  "per_jenis": [
    {
      "nama_surat": "Surat Keterangan Aktif Kuliah",
      "jumlah": 65
    }
  ]
}

```

---

## Endpoint 13 — Logout Pengguna

**Method:** `POST`

**URL:** `/api/logout`

**Deskripsi:** Menghapus data *current access token* aktif yang terdaftar di sistem Laravel Sanctum.

**Autentikasi Diperlukan:** `Ya`

**Response Sukses (`200 OK`):**

```json
{
  "message": "Logout berhasil"
}

```
