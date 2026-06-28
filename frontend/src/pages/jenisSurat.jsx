import  { useState, useEffect } from 'react';
import { getJenisSurat } from '../service/surat';
import { TableSkeleton } from '../component/skeletonLoading';

const JenisSurat = () => {
  const [jenisSuratList, setJenisSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data dari server Laravel
  const fetchData = () => {
    setLoading(true);
    setError(null);
    
    getJenisSurat()
      .then((data) => {
        setJenisSuratList(data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Gagal mengambil data jenis surat dari server.");
        setLoading(false);
      });
  };

  // Jalankan fungsi fetchData saat halaman pertama kali dibuka
  useEffect(() => {
    fetchData();
  }, []);

  // 1. TAMPILAN JIKA SEDANG LOADING (MENGGUNAKAN SKELETON)
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton Judul */}
        <div className="h-7 bg-ungu-gelap-700 rounded w-1/4 animate-pulse mb-6"></div>
        {/* Skeleton Tabel dengan 3 Kolom */}
        <TableSkeleton rows={4} cols={3} />
      </div>
    );
  }

  // 2. TAMPILAN JIKA TERJADI ERROR KONEKSI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mb-4 text-3xl">
          <i className="ri-error-warning-line"></i>
        </div>
        <h3 className="text-lg font-bold text-putih-bersih">Koneksi Gagal</h3>
        <p className="text-sm text-ungu-gelap-300 mt-1 max-w-sm">{error}</p>
        <button 
          onClick={fetchData} 
          className="mt-4 px-4 py-2 bg-ungu-gelap-700 hover:bg-ungu-gelap-600 text-xs font-semibold rounded-xl text-putih-bersih transition flex items-center gap-1"
        >
          <i className="ri-refresh-line"></i> Coba Lagi
        </button>
      </div>
    );
  }

  // 3. TAMPILAN JIKA DATA DI DATABASE MASIH KOSONG (EMPTY STATE)
  if (jenisSuratList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16">
        <div className="w-16 h-16 rounded-full bg-ungu-gelap-700 text-ungu-gelap-300 flex items-center justify-center mb-4 text-3xl">
          <i className="ri-file-list-3-line"></i>
        </div>
        <h3 className="text-lg font-bold text-putih-bersih">Data Master Kosong</h3>
        <p className="text-sm text-ungu-gelap-300 mt-1 max-w-xs">
          Belum ada data jenis surat yang dikonfigurasi di database backend.
        </p>
      </div>
    );
  }

  // 4. TAMPILAN UTAMA JIKA DATA BERHASIL DIDAPATKAN
  return (
    <div>
      {/* JUDUL HALAMAN */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-putih-bersih">Daftar Jenis Surat</h1>
          <p className="text-xs text-ungu-gelap-300 mt-0.5">Referensi jenis surat yang tersedia untuk diajukan</p>
        </div>
        {/* Indikator Total Data */}
        <span className="text-xs font-semibold bg-hijau-uin/10 text-hijau-zamrud border border-hijau-uin/20 px-3 py-1 rounded-full">
          Total: {jenisSuratList.length} Referensi
        </span>
      </div>

      {/* TABEL DATA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-ungu-gelap-700 text-ungu-gelap-300 text-sm">
              <th className="p-3 w-16">No</th>
              <th className="p-3 w-32">Kode Surat</th>
              <th className="p-3">Nama/Perihal Jenis Surat</th>
            </tr>
          </thead>
          <tbody>
            {jenisSuratList.map((item, index) => (
              <tr 
                key={item.id} 
                className="border-b border-ungu-gelap-700/50 hover:bg-ungu-gelap-700/30 text-sm transition-colors duration-150"
              >
                {/* Nomor Urut */}
                <td className="p-3 text-ungu-gelap-300 font-mono">{index + 1}</td>
                
                {/* Kolom Kode Surat */}
                <td className="p-3">
                  <span className="px-2.5 py-1 rounded-lg bg-ungu-gelap-900 border border-ungu-gelap-700 text-kuning-emas font-mono font-bold text-xs tracking-wider">
                    {item.kode}
                  </span>
                </td>
                
                {/* Kolom Nama Surat */}
                <td className="p-3 text-putih-bersih font-medium">
                  {item.nama_surat}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JenisSurat;
