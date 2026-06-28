import { useState, useEffect } from 'react';
import { getJenisSurat , postBuatSurat ,getTemplateSuratAll} from '../service/surat';

const BuatSurat = ({ setPage }) => {
  const [jenisSuratList, setJenisSuratList] = useState([]);
const [templateList, setTemplateList] = useState([]); // State baru untuk menyimpan list template dari GitHub
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  
  // State Input Form Utama
  const [formData, setFormData] = useState({
    jenis_surat_id: '',
    lampiran: '',
    tujuan: '',
    kota: 'Banda Aceh',
    perihal: '',
    tanggal_acara: '',
    isi_surat: '',
    atas_nama: '',
  });

  // State Input Tanda Tangan (Mulai dari 1 row default)
  const [tandaTangan, setTandaTangan] = useState([
    { nama: '', jabatan: '' }
  ]);

// 1. Fetch daftar Jenis Surat DAN semua Template saat halaman pertama kali dimuat
  useEffect(() => {
    // Ambil opsi pilihan dropdown dari database
    getJenisSurat()
      .then(data => setJenisSuratList(data || []))
      .catch(() => {});

    // Ambil isi teks template draf dari GitHub melalui endpoint /template
    getTemplateSuratAll()
      .then(res => {
        // Sesuaikan dengan struktur response API Laravel Anda (misal res.data jika dibungkus)
        setTemplateList(res.data || res || []);
      })
      .catch(() => {});
  }, []);


//  Otomatis isi kolom teks utama (isi_surat) ketika user memilih jenis surat di dropdown
  useEffect(() => {
    if (!formData.jenis_surat_id) return;

    // Cari tahu kode dari jenis_surat_id yang dipilih (misal: SRT01)
    const kodeTerpilih = jenisSuratList.find(j => j.id === Number(formData.jenis_surat_id))?.kode;

    if (kodeTerpilih && templateList.length > 0) {
      // Cari draf template yang kodenya cocok di dalam list template GitHub
      const cocok = templateList.find(t => t.kode.toUpperCase() === kodeTerpilih.toUpperCase());
      
      if (cocok) {
        // Set otomatis isi teks utama surat dengan template dari GitHub
        setFormData(prev => ({ ...prev, isi_surat: cocok.template }));
      }
    }
  }, [formData.jenis_surat_id, jenisSuratList, templateList]);

  const handleAddTtd = () => {
    if (tandaTangan.length < 4) {
      setTandaTangan([...tandaTangan, { nama: '', jabatan: '' }]);
    }
  };

  const handleRemoveTtd = (index) => {
    if (tandaTangan.length > 1) {
      setTandaTangan(tandaTangan.filter((_, i) => i !== index));
    }
  };

  const handleTtdChange = (index, field, value) => {
    const updated = [...tandaTangan];
    updated[index][field] = value;
    setTandaTangan(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    
    try {
      const payload = { ...formData, tanda_tangan: tandaTangan };
      const res = await postBuatSurat(payload);
      alert(res.message);
      setPage('riwayat-surat'); // Alihkan ke riwayat setelah sukses mengirim
    } catch (err) {
      alert(err.message || "Isian form belum lengkap atau tidak valid.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="max-w-3xl bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-2xl p-6 shadow-xl">
      <h1 className="text-xl font-bold text-putih-bersih mb-1">Formulir Pengajuan Surat</h1>
      <p className="text-xs text-ungu-gelap-300 mb-6">Silakan lengkapi seluruh rincian informasi draft surat di bawah ini</p>

      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200">Jenis Surat *</label>
            <select 
              required
              value={formData.jenis_surat_id}
              onChange={(e) => setFormData({...formData, jenis_surat_id: e.target.value})}
              className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl p-3 focus:outline-none focus:border-hijau-uin"
            >
              <option value="">-- Pilih Jenis Surat --</option>
              {jenisSuratList.map(j => <option key={j.id} value={j.id}>[{j.kode}] {j.nama_surat}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200">Perihal *</label>
            <input required type="text" placeholder="Contoh: Permohonan Izin Kuliah" value={formData.perihal} onChange={(e) => setFormData({...formData, perihal: e.target.value})} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl p-3 focus:outline-none focus:border-hijau-uin"/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200">Tujuan Surat *</label>
            <input required type="text" placeholder="Contoh: Dekan Fakultas Tarbiyah" value={formData.tujuan} onChange={(e) => setFormData({...formData, tujuan: e.target.value})} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl p-3 focus:outline-none focus:border-hijau-uin"/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200">Kota Surat</label>
            <input type="text" placeholder="Banda Aceh" value={formData.kota} onChange={(e) => setFormData({...formData, kota: e.target.value})} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl p-3 focus:outline-none focus:border-hijau-uin"/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200">Tanggal Acara</label>
            <input type="date" value={formData.tanggal_acara} onChange={(e) => setFormData({...formData, tanggal_acara: e.target.value})} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl p-3 focus:outline-none focus:border-hijau-uin text-ungu-gelap-200"/>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200">Lampiran</label>
            <input type="text" placeholder="Contoh: 1 Berkas lembar" value={formData.lampiran} onChange={(e) => setFormData({...formData, lampiran: e.target.value})} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl p-3 focus:outline-none focus:border-hijau-uin"/>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200">Atas Nama (A.n)</label>
            <input type="text" placeholder="Contoh: Kepala Tata Usaha" value={formData.atas_nama} onChange={(e) => setFormData({...formData, atas_nama: e.target.value})} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl p-3 focus:outline-none focus:border-hijau-uin"/>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-ungu-gelap-200">Isi Utama Surat *</label>
          <textarea required rows="5" placeholder="Tuliskan isi redaksi surat secara lengkap disini..." value={formData.isi_surat} onChange={(e) => setFormData({...formData, isi_surat: e.target.value})} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl p-3 focus:outline-none focus:border-hijau-uin leading-relaxed"></textarea>
        </div>

        {/* RE-RENDER DATA PENANDATANGAN DINAMIS */}
        <div className="pt-4 border-t border-ungu-gelap-700">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-kuning-emas">Struktur Tanda Tangan (Max 4)</label>
            {tandaTangan.length < 4 && (
              <button type="button" onClick={handleAddTtd} className="text-xs bg-hijau-uin/20 text-hijau-zamrud px-3 py-1.5 rounded-lg hover:bg-hijau-uin/30 font-semibold transition">
                <i className="ri-add-line mr-0.5"></i> Tambah Pejabat
              </button>
            )}
          </div>

          <div className="space-y-3">
            {tandaTangan.map((ttd, index) => (
              <div key={index} className="flex gap-3 items-end bg-ungu-gelap-900/40 p-3 rounded-xl border border-ungu-gelap-700/50">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-ungu-gelap-300 font-medium">Nama Pejabat {index+1} *</span>
                    <input required type="text" placeholder="Nama Lengkap & Gelar" value={ttd.name} onChange={(e) => handleTtdChange(index, 'nama', e.target.value)} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-xs rounded-lg p-2.5 focus:outline-none"/>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-ungu-gelap-300 font-medium">Jabatan Pejabat {index+1} *</span>
                    <input required type="text" placeholder="Contoh: Direktur Pascasarjana" value={ttd.jabatan} onChange={(e) => handleTtdChange(index, 'jabatan', e.target.value)} className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-xs rounded-lg p-2.5 focus:outline-none"/>
                  </div>
                </div>
                {tandaTangan.length > 1 && (
                  <button type="button" onClick={() => handleRemoveTtd(index)} className="p-2.5 bg-terracotta/10 text-terracotta hover:bg-terracotta/20 rounded-lg text-sm transition">
                    <i className="ri-delete-bin-line"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loadingSubmit}
          className="w-full bg-hijau-uin hover:bg-hijau-lumut text-putih-bersih font-bold py-3.5 rounded-xl transition shadow-md shadow-hijau-botol/20 mt-4 flex items-center justify-center gap-1"
        >
          {loadingSubmit ? <i className="ri-loader-4-line animate-spin text-lg"></i> : <><i className="ri-send-plane-line"></i> Kirim Pengajuan Surat</>}
        </button>
      </form>
    </div>
  );
};

export default BuatSurat;
