import { useState, useEffect } from 'react';
import { getSemuaSurat, putApproveSurat, putTolakSurat } from '../service/surat';
import { TableSkeleton } from '../component/skeletonLoading';

const SemuaSurat = () => {
  const [allSurat, setAllSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal Penolakan
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [catatan, setCatatan] = useState('');

  const loadData = () => {
    getSemuaSurat().then(data => setAllSurat(data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleApprove = async (id) => {
    if(confirm("Setujui pengajuan surat ini dan terbitkan nomor otomatis?")) {
      try {
        const res = await putApproveSurat(id);
        alert(res.message);
        loadData();
      } catch(err) { alert(err.message); }
    }
  };

  const openRejectModal = (id) => {
    setSelectedId(id);
    setCatatan('');
    setShowRejectModal(true);
  };

  const handleTolakSubmit = async (e) => {
    e.preventDefault();
    if(!catatan.trim()) return;

    try {
      const res = await putTolakSurat(selectedId, catatan);
      alert(res.message);
      setShowRejectModal(false);
      loadData();
    } catch(err) { alert(err.message); }
  };

  if (loading) return <TableSkeleton rows={6} cols={5} />;

  return (
    <div className="relative">
      <h1 className="text-xl font-bold text-putih-bersih mb-6">Sekretariat — Semua Pengajuan Masuk</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-ungu-gelap-700 text-ungu-gelap-300">
              <th className="p-3">Pengusul</th>
              <th className="p-3">Rincian Surat</th>
              <th className="p-3">Status Dokumen</th>
              <th className="p-3 text-center">Aksi Validasi</th>
            </tr>
          </thead>
          <tbody>
            {allSurat.map(surat => (
              <tr key={surat.id} className="border-b border-ungu-gelap-700/40 hover:bg-ungu-gelap-700/20">
                <td className="p-3">
                  <p className="text-putih-bersih font-semibold">{surat.user?.name}</p>
                  <p className="text-[11px] text-ungu-gelap-300">{surat.user?.email}</p>
                </td>
                <td className="p-3">
                  <p className="text-kuning-emas text-xs font-mono font-bold">[{surat.jenis_surat?.kode || '?'}] {surat.jenis_surat?.nama_surat}</p>
                  <p className="text-putih-bersih mt-0.5 font-medium">{surat.perihal}</p>
                </td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                    surat.status === 'disetujui' ? 'bg-hijau-uin/20 text-hijau-zamrud' :
                    surat.status === 'ditolak' ? 'bg-terracotta/20 text-burnt-orange' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>{surat.status}</span>
                </td>
                <td className="p-3 text-center flex items-center justify-center gap-2 h-full">
                  {surat.status === 'pending' ? (
                    <>
                      <button onClick={() => handleApprove(surat.id)} className="bg-hijau-uin hover:bg-hijau-lumut text-putih-bersih px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-0.5"><i className="ri-check-line"></i> Setujui</button>
                      <button onClick={() => openRejectModal(surat.id)} className="bg-terracotta hover:bg-burnt-orange text-putih-bersih px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-0.5"><i className="ri-close-line"></i> Tolak</button>
                    </>
                  ) : <span className="text-xs text-ungu-gelap-400 italic">Selesai diproses</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POP-UP MODAL FORM CATATAN PENOLAKAN SURAT */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-ungu-gelap-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <form onSubmit={handleTolakSubmit} className="w-full max-w-sm bg-ungu-gelap-800 border border-ungu-gelap-700 p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-putih-bersih"><i className="ri-error-warning-line text-terracotta mr-1"></i> Berikan Catatan Penolakan</h3>
            <textarea 
              required 
              rows="4" 
              placeholder="Tulis alasan penolakan dokumen disini (Wajib)..." 
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-xs rounded-xl p-3 focus:outline-none focus:border-terracotta"
            ></textarea>
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button type="button" onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-ungu-gelap-200 hover:bg-ungu-gelap-700 rounded-lg transition">Batal</button>
              <button type="submit" className="px-4 py-2 bg-terracotta hover:bg-burnt-orange text-putih-bersih rounded-lg transition">Kirim Tolak</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default SemuaSurat;
