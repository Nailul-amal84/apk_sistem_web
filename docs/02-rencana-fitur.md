# Rencana Fitur

> Dokumentasikan minimal **5 fitur utama** proyek Anda.
> Salin dan ulangi blok di bawah untuk setiap fitur tambahan.



## Fitur 1 — Sinkronisasi Pilihan Jenis Surat (Dropdown Form)

**Role Penanggung Jawab:** `Backend & Frontend`

**Sumber Data:** `Internal System — MySQL Database (Tabel jenis_surat)`

**Deskripsi & Ekspektasi:**
Fitur ini memuat opsi pilihan jenis surat pada dropdown di halaman pembuatan surat secara dinamis. Backend menyediakan endpoint `/api/jenis-surat` yang menarik data dari database (hasil dari *migration* dan *seeder* otomatis). Di sisi frontend, React melakukan *fetch* data tersebut saat halaman pertama kali dimuat menggunakan `useEffect` dan menyimpannya ke `jenisSuratList` untuk dirender ke dalam elemen `<select>`. Ekspektasinya, data opsi pilihan akan terisi secara urut sesuai database, dan sistem mengantisipasi masalah `id` kosong dengan menyediakan pencocokan berbasis properti `kode`.

---

## Fitur 2 — Integrasi Dataset Draf Surat dari Jauh (GitHub Raw Proxy)

**Role Penanggung Jawab:** `Backend`

**Sumber Data:** `Third-Party API — GitHub Raw Content API`

**Deskripsi & Ekspektasi:**
Fitur penanggung jawab penyedia draf teks surat resmi UIN secara terpisah (*decoupled dataset*). Di bagian *service layer*, backend Laravel mengekspos rute `/template` yang memanfaatkan komponen `Http::get` untuk menembak URL berkas JSON mentah yang di-hosting di repositori GitHub (`sample-data.json`). Ekspektasinya, backend bertindak sebagai jembatan (*proxy*) yang aman, mengambil 10 dataset draf surat terstruktur, mengubahnya menjadi array objek PHP melalui fungsi `.json()`, lalu menyediakannya kembali dalam format API yang bersih ke frontend tanpa membebani database lokal.

---

## Fitur 3 — Pengisian Otomatis Draf Surat (Auto-Fill Isi Utama)

**Role Penanggung Jawab:** `Frontend`

**Sumber Data:** `Internal System — Laravel /template API Endpoint`

**Deskripsi & Ekspektasi:**
Fitur kecerdasan antarmuka (*UI/UX Intelligence*) pada komponen `BuatSurat.jsx`. React memanggil fungsi `getTemplateSuratAll()` di awal siklus halaman untuk menyimpan seluruh draf dari GitHub ke state `templateList`. Melalui fungsi pengawas `useEffect` kedua, setiap kali pengguna memilih salah satu jenis surat pada dropdown, React akan mendeteksi perubahan `jenis_surat_id`, mencari objek yang memiliki `kode` yang cocok (misalnya: `SRT01` untuk Surat Aktif Kuliah), lalu otomatis menyisipkan teks *template* tersebut langsung ke dalam *state* `formData.isi_surat`. Ekspektasinya, kolom *textarea* isi utama surat akan terisi otomatis secara instan tanpa memicu *delay login/loading* server berulang kali.

---

## Fitur 4 — Katalog Visual Template Surat (Card View Explorer)

**Role Penanggung Jawab:** `Frontend`

**Sumber Data:** `Internal System — Laravel /template API Endpoint`

**Deskripsi & Ekspektasi:**
Halaman penjelajah khusus (`TemplateSurat.jsx`) yang menyajikan visualisasi seluruh draf dokumen resmi UIN dalam bentuk susunan komponen *card* (kartu) berbasis Tailwind CSS Grid Layout. Fitur ini dilengkapi dengan bilah pencarian *real-time* berbasis pencocokan nama atau kode surat. Pengguna dapat mengeklik tombol "Detail" untuk membuka jendela *Modal Popup Preview* berfont monospasi yang menampilkan struktur dokumen secara utuh, atau mengeklik "Gunakan Template" yang secara otomatis menyimpan kode surat ke `localStorage` dan mengarahkan halaman form pembuatan surat secara otomatis.

---

## Fitur 5 — Formulir Multi-Baris Dinamis Tanda Tangan (Dynamic Input Row)

**Role Penanggung Jawab:** `Frontend & Backend`

**Sumber Data:** `Internal System`

**Deskripsi & Ekspektasi:**
Fitur pengisian data struktural penanda tangan dokumen yang bersifat fleksibel di halaman pembuatan surat. Pada sisi frontend, pengguna disajikan tombol untuk menambah baris penanda tangan baru (`handleAddTtd`) atau menghapus baris tertentu (`handleRemoveTtd`) secara dinamis dengan batasan maksimal 4 baris jabatan dan minimal 1 baris. State dikelola dalam bentuk *array of objects* `tandaTangan`. Ekspektasinya, saat form disubmit melalui metode `postBuatSurat`, seluruh susunan nama dan jabatan penanda tangan tersebut akan dikirimkan secara utuh dalam satu payload JSON menuju backend Laravel untuk divalidasi dan disimpan.

---



## Fitur 6 — Autentikasi Pengguna & Proteksi API (Stateless Authentication)

**Role Penanggung Jawab:** `Security & Backend`

**Sumber Data:** `Internal System — MySQL Database (Tabel users & personal_access_tokens)`

**Deskripsi & Ekspektasi:**
Fitur ini bertanggung jawab untuk mengamankan seluruh ekosistem aplikasi dari akses ilegal. Di sisi backend, autentikasi dibangun menggunakan paket bawaan Laravel (seperti **Laravel Sanctum**) untuk menerapkan sistem token *stateless*. Ketika pengguna berhasil melakukan login, backend akan menerbitkan sebuah *Bearer Token*. Token ini kemudian disimpan secara aman oleh frontend React (misalnya di `localStorage` atau `secure cookies`) dan wajib disisipkan ke dalam *Header HTTP Authorization* pada setiap permintaan API yang dikirim melalui Axios instance. Ekspektasinya, endpoint sensitif seperti `/api/buat-surat` atau `/template` tidak dapat diakses oleh pengguna yang belum terautentikasi (mengembalikan error HTTP 401 Unauthorized), sehingga data draf surat kampus tetap aman dan terlindungi.

---

## Fitur 7 — Registrasi Akun Mandiri

**Role Penanggung Jawab:** `Backend & Frontend`

**Sumber Data:** `Internal System — MySQL Database (Tabel users)`

**Deskripsi & Ekspektasi:**
Fitur yang memungkinkan mahasiswa atau sivitas akademika baru untuk membuat akun secara mandiri ke dalam sistem E-Surat. Pengguna menginput nama, email unik, password (minimal 6 karakter), serta Nomor Induk Mahasiswa (NIM). Backend Laravel akan melakukan enkripsi password menggunakan `Hash::make` sebelum menyimpannya, lalu secara otomatis menerbitkan token akses Sanctum awal. Ekspektasinya, pengguna baru dapat langsung terdaftar dengan peran bawaan (*default role*) sebagai `user` tanpa perlu aktivasi manual oleh admin.

---

## Fitur 8 — Pembaruan Profil Pengguna (Update Profile)

**Role Penanggung Jawab:** `Frontend & Backend`

**Sumber Data:** `Internal System — MySQL Database (Tabel users)`

**Deskripsi & Ekspektasi:**
Fitur manajemen akun di sisi frontend yang memungkinkan pengguna terautentikasi untuk memperbarui data informasi dasar mereka (Nama Lengkap dan NIM). Ketika form profil disimpan, React mengirimkan data ke endpoint `/api/profile/update` bersama dengan token *Bearer*. Backend akan memvalidasi kecocokan data, melakukan pembaruan pada baris user yang sedang aktif (`$request->user()->update()`), dan mengembalikan objek user terbaru. Ekspektasinya, perubahan nama dan NIM akan langsung merefleksikan identitas otomatis saat mahasiswa membuat surat baru.

---

## Fitur 9 — Pembuatan Nomor Surat Otomatis Berbasis Angka & Romawi (Auto-Numbering)

**Role Penanggung Jawab:** `Backend`

**Sumber Data:** `Internal System — MySQL Database (Tabel surat_pengajuans)`

**Deskripsi & Ekspektasi:**
Fitur pintar pada proses persetujuan surat (`approve`) oleh Sekretaris/Admin. Ketika tombol setujui diklik, sistem backend tidak hanya mengubah status dokumen menjadi `disetujui`, melainkan menghitung jumlah surat sejenis yang telah disetujui sebelumnya untuk mendapatkan nomor urut baru. Sistem kemudian mengonversi bulan berjalan menjadi format angka Romawi (misal: `VI` untuk Juni) dan menyusun string kode gabungan resmi dengan format `[NomorUrut]/[KodeJenisSurat]/[BulanRomawi]/[Tahun]`. Ekspektasinya, penomoran arsip surat kampus keluar akan berjalan konsisten, rapi, dan terhindar dari nomor ganda (*human error*).

---

## Fitur 10 — Penolakan Surat Disertai Alasan (Rejection Feedback)

**Role Penanggung Jawab:** `Backend & Frontend`

**Sumber Data:** `Internal System — MySQL Database (Tabel surat_pengajuans)`

**Deskripsi & Ekspektasi:**
Fitur validasi dua arah antara Sekretaris/Admin dan Mahasiswa. Jika pengajuan draf surat dinilai salah atau tidak sesuai kriteria, Sekretaris dapat mengeklik tombol "Tolak" yang akan memunculkan kolom input catatan alasan penolakan (`catatan_sekretaris`). Backend mewajibkan kolom catatan ini diisi (`required`) sebelum mengubah status surat menjadi `ditolak`. Ekspektasinya, mahasiswa dapat melihat alasan spesifik penolakan pada halaman riwayat mereka untuk kemudian melakukan perbaikan draf secara akurat.

---

## Fitur 11 — Render & Unduh Dokumen PDF Resmi (PDF Exporter)

**Role Penanggung Jawab:** `Backend & DevOps`

**Sumber Data:** `Internal System — Laravel PDF Engine View`

**Deskripsi & Ekspektasi:**
Fitur konversi draf digital menjadi berkas cetak fisik resmi berformat `.pdf` menggunakan pustaka *Barryvdh DomPDF*. Fitur ini menerapkan proteksi keamanan ketat, di mana dokumen hanya bisa diunduh jika statusnya sudah `disetujui` dan hanya dapat diakses oleh mahasiswa pemilik surat tersebut atau user bermutu/role `sekretaris`. Ekspektasinya, teks utama dari GitHub beserta susunan rapi baris tanda tangan akan langsung dicetak ke dalam format tata letak standar kertas surat kampus UIN saat tombol "Download PDF" ditekan.

---

## Fitur 12 — Dasbor Analitik & Grafik Statistik Surat (Dashboard Analytics)

**Role Penanggung Jawab:** `Backend & Frontend`

**Sumber Data:** `Internal System — MySQL Database Aggregation`

**Deskripsi & Ekspektasi:**
Fitur visualisasi ringkasan data performa sistem pada halaman utama (*Dashboard*). Backend Laravel mengkalkulasi metrik agregat menggunakan query penghitung status (`count()`) untuk mendapatkan total surat masuk, total pending, total disetujui, dan total ditolak. Selain itu, fungsi `selectRaw` dan `groupBy` digunakan untuk mengelompokkan jumlah akumulasi pengajuan berdasarkan nama kategori jenis suratnya. Ekspektasinya, frontend React dapat menangkap data statistik terstruktur ini untuk disajikan dalam bentuk kartu ringkasan angka cerdas dan grafik tren bagi pihak manajemen kampus.

