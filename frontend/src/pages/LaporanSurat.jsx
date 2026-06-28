import React, { useState, useEffect } from 'react';
import { CardSkeleton } from '../component/skeletonLoading';
import { getLaporanSurat } from '../service/surat';

const LaporanSurat = () => {
  const [dataReport, setDataReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLaporanSurat().then(data => setDataReport(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-6"><CardSkeleton count={4}/><div className="h-32 bg-ungu-gelap-800 rounded-xl animate-pulse"></div></div>;

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h1 className="text-xl font-bold text-putih-bersih">Laporan Grafik & Kinerja Persuratan</h1>
        <p className="text-xs text-ungu-gelap-300 mt-0.5">Analisis data akumulasi statistik berkas pengajuan</p>
      </div>

      {/* METRIK KARTU ATAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-xl">
          <p className="text-xs font-medium text-ungu-gelap-300">Total Berkas Masuk</p>
          <p className="text-2xl font-black text-putih-bersih mt-1">{dataReport?.total} Berkas</p>
        </div>
        <div className="p-4 bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-xl border-l-4 border-l-amber-500">
          <p className="text-xs font-medium text-ungu-gelap-300">Menunggu Review</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{dataReport?.pending} Berkas</p>
        </div>
        <div className="p-4 bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-xl border-l-4 border-l-hijau-uin">
          <p className="text-xs font-medium text-ungu-gelap-300">Disetujui / Terbit</p>
          <p className="text-2xl font-black text-hijau-zamrud mt-1">{dataReport?.disetujui} Berkas</p>
        </div>
        <div className="p-4 bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-xl border-l-4 border-l-terracotta">
          <p className="text-xs font-medium text-ungu-gelap-300">Ditolak / Dikembalikan</p>
          <p className="text-2xl font-black text-burnt-orange mt-1">{dataReport?.ditolak} Berkas</p>
        </div>
      </div>

      {/* GRAFIK PROGRESS BREAKDOWN JENIS SURAT */}
      <div className="p-5 bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-xl">
        <h3 className="text-sm font-bold text-putih-bersih mb-4">Volume Berkas Berdasarkan Klasifikasi Jenis Surat</h3>
        <div className="space-y-4">
          {dataReport?.per_jenis?.map((item, index) => {
            // Hitung persentase porsi volume data
            const persentase = dataReport.total > 0 ? Math.round((item.jumlah / dataReport.total) * 100) : 0;
            return (
              <div key={index} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-putih-bersih font-medium">{item.nama_surat}</span>
                  <span className="text-kuning-emas font-semibold font-mono">{item.jumlah} Berkas ({persentase}%)</span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-ungu-gelap-950 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-hijau-uin h-full transition-all duration-500" style={{ width: `${persentase}%` }}></div>
                </div>
              </div>
            );
          })}
          {dataReport?.per_jenis?.length === 0 && <p className="text-xs text-center text-ungu-gelap-400 py-4">Belum ada distribusi data.</p>}
        </div>
      </div>
    </div>
  );
};

export default LaporanSurat;
