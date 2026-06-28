import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../component/skeletonLoading';
import { getRiwayatSurat , downloadPdfSurat } from '../service/surat';


const RiwayatSurat = () => {
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    getRiwayatSurat().then(data => setSuratList(data || [])).finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id, nomorSurat) => {
    setDownloadingId(id);
    try {
      await downloadPdfSurat(id, nomorSurat);
    } catch (err) {
      alert(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <TableSkeleton rows={5} cols={4} />;
  if (suratList.length === 0) return <div className="text-center text-ungu-gelap-300 py-12"><i className="ri-mail-open-line text-4xl block mb-2"></i>Belum ada pengajuan surat.</div>;

  return (
    <div>
      <h1 className="text-xl font-bold text-putih-bersih mb-6">Riwayat Pengajuan Surat Anda</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-ungu-gelap-700 text-ungu-gelap-300">
              <th className="p-3 w-12">No</th>
              <th className="p-3">Nomor / Jenis Surat</th>
              <th className="p-3">Perihal & Tujuan</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {suratList.map((surat, i) => (
              <tr key={surat.id} className="border-b border-ungu-gelap-700/40 hover:bg-ungu-gelap-700/20">
                <td className="p-3 font-mono text-ungu-gelap-300">{i + 1}</td>
                <td className="p-3">
                  <p className="text-putih-bersih font-semibold">{surat.nomor_surat || 'Belum Terbit'}</p>
                  <p className="text-[11px] text-kuning-emas mt-0.5">{surat.jenis_surat?.nama_surat}</p>
                </td>
                <td className="p-3">
                  <p className="text-putih-bersih font-medium">{surat.perihal}</p>
                  <p className="text-[11px] text-ungu-gelap-300">Tujuan: {surat.tujuan}</p>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                    surat.status === 'disetujui' ? 'bg-hijau-uin/20 text-hijau-zamrud' :
                    surat.status === 'ditolak' ? 'bg-terracotta/20 text-burnt-orange' : 'bg-ungu-gelap-950 text-ungu-gelap-300'
                  }`}>
                    {surat.status}
                  </span>
                  {surat.catatan_sekretaris && <p className="text-[10px] text-terracotta mt-1 max-w-xs italic">Ket: {surat.catatan_sekretaris}</p>}
                </td>
                <td className="p-3 text-center">
                  <button 
                    disabled={surat.status !== 'disetujui' || downloadingId === surat.id}
                    onClick={() => handleDownload(surat.id, surat.nomor_surat)}
                    className="px-3 py-1.5 bg-ungu-gelap-900 hover:bg-ungu-gelap-950 disabled:opacity-30 disabled:hover:bg-ungu-gelap-900 text-xs font-bold rounded-lg text-putih-bersih border border-ungu-gelap-700 transition"
                  >
                    {downloadingId === surat.id ? <i className="ri-loader-4-line animate-spin"></i> : <><i className="ri-download-cloud-2-line mr-1"></i> PDF</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiwayatSurat;
