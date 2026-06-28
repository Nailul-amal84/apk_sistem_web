import  { useState, useEffect } from 'react';
import { getTemplateSuratAll } from '../service/surat';
import { 
  RiFileTextLine, 
  RiSearchLine, 
  RiSendPlaneLine, 
  RiEyeLine, 
  RiCloseLine 
} from "@remixicon/react";

const TemplateSurat = ({ setPage }) => {
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Untuk Modal Detail View

  useEffect(() => {
    getTemplateSuratAll()
      .then(res => {
        // Antisipasi jika response berbentuk array langsung atau dibungkus res.data
        const data = res.data || res || [];
        setTemplates(data);
      })
      .catch(err => {
        console.error("Gagal memuat daftar template:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter pencarian berdasarkan nama surat atau kode surat
  const filteredTemplates = templates.filter(item => 
    item.nama_surat.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.kode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGunakanTemplate = (kode) => {
    // Alihkan langsung ke halaman buat-surat dengan membawa parameter state jika dibutuhkan
    // Atau simpan kode ke localStorage agar komponen BuatSurat bisa langsung membacanya
    localStorage.setItem('selected_template_code', kode);
    setPage('buat-surat');
  };

  return (
    <div className="w-full min-h-screen pb-12">
      {/* HEADER UTAMA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-putih-bersih mb-1 tracking-wide">
            Daftar Template Surat Resmi UIN
          </h1>
          <p className="text-xs text-ungu-gelap-300">
            Lihat dan pilih draf surat yang tersedia untuk melakukan pengajuan secara cepat.
          </p>
        </div>

        {/* BAR PENCARIAN */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-ungu-gelap-400">
            <RiSearchLine size={18} />
          </span>
          <input
            type="text"
            placeholder="Cari nama atau kode surat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-xs rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-hijau-uin transition-colors placeholder-ungu-gelap-400"
          />
        </div>
      </div>

      {/* SKELETON LOADING STATE */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-ungu-gelap-800/40 border border-ungu-gelap-700/50 rounded-2xl p-5 h-48 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-4 bg-ungu-gelap-700 rounded-md"></div>
                <div className="w-full h-6 bg-ungu-gelap-700 rounded-md"></div>
                <div className="w-3/4 h-4 bg-ungu-gelap-700 rounded-md"></div>
              </div>
              <div className="w-1/3 h-8 bg-ungu-gelap-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        /* KONDISI DATA TIDAK DITEMUKAN */
        <div className="text-center py-16 bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-2xl">
          <p className="text-sm text-ungu-gelap-300">Template surat tidak ditemukan.</p>
        </div>
      ) : (
        /* LAYOUT CARD UTAMA */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((item) => (
            <div 
              key={item.kode} 
              className="bg-ungu-gelap-800 border border-ungu-gelap-700 hover:border-ungu-gelap-600 rounded-2xl p-5 shadow-lg flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1"
            >
              <div>
                {/* Lencana Kode & Ikon */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-hijau-uin/10 text-hijau-zamrud flex items-center justify-center shadow-inner">
                    <RiFileTextLine size={20} />
                  </div>
                  <span className="text-[10px] font-bold bg-ungu-gelap-950 border border-ungu-gelap-700 text-kuning-emas px-2.5 py-1 rounded-full tracking-wider">
                    {item.kode}
                  </span>
                </div>

                {/* Judul & Preview Singkat */}
                <h3 className="text-sm font-bold text-putih-bersih group-hover:text-kuning-emas transition-colors mb-2 leading-snug truncate-2-lines min-h-[40px]">
                  {item.nama_surat}
                </h3>
                <p className="text-[11px] text-ungu-gelap-300 line-clamp-3 mb-5 leading-relaxed">
                  {item.template}
                </p>
              </div>

              {/* Tombol Aksi Bawah */}
              <div className="flex items-center gap-2 pt-4 border-t border-ungu-gelap-700/60">
                <button
                  type="button"
                  onClick={() => setSelectedTemplate(item)}
                  className="flex-1 flex items-center justify-center gap-1 bg-ungu-gelap-900 border border-ungu-gelap-700 hover:bg-ungu-gelap-700/50 text-ungu-gelap-200 text-xs font-medium py-2.5 rounded-xl transition"
                >
                  <RiEyeLine size={14} /> Detail
                </button>
                <button
                  type="button"
                  onClick={() => handleGunakanTemplate(item.kode)}
                  className="flex-1 flex items-center justify-center gap-1 bg-hijau-uin hover:bg-hijau-lumut text-putih-bersih text-xs font-semibold py-2.5 rounded-xl transition shadow-md shadow-hijau-botol/10"
                >
                  Gunakan <RiSendPlaneLine size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
       * MODAL POPUP PREVIEW DETAIL TEMPLATE
       * ========================================================================= */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Tombol Tutup */}
            <button 
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-4 right-4 p-1.5 text-ungu-gelap-400 hover:text-putih-bersih rounded-lg bg-ungu-gelap-900/60 transition"
            >
              <RiCloseLine size={18} />
            </button>

            {/* Konten Modal */}
            <div className="mb-4">
              <span className="text-[10px] font-bold bg-ungu-gelap-950 text-kuning-emas border border-ungu-gelap-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {selectedTemplate.kode}
              </span>
              <h2 className="text-base font-bold text-putih-bersih mt-2.5 leading-tight">
                {selectedTemplate.nama_surat}
              </h2>
            </div>

            {/* Area Isi Teks Dokumen */}
            <div className="bg-ungu-gelap-950/60 border border-ungu-gelap-700 rounded-xl p-4 max-h-60 overflow-y-auto mb-6 text-xs text-ungu-gelap-100 leading-relaxed whitespace-pre-line no-scrollbar font-mono">
              {selectedTemplate.template}
            </div>

            {/* Tombol Eksekusi Akhir */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedTemplate(null)}
                className="flex-1 bg-ungu-gelap-900 border border-ungu-gelap-700 text-ungu-gelap-200 text-xs font-semibold py-3 rounded-xl hover:bg-ungu-gelap-700 transition"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => {
                  handleGunakanTemplate(selectedTemplate.kode);
                  setSelectedTemplate(null);
                }}
                className="flex-1 bg-hijau-uin hover:bg-hijau-lumut text-putih-bersih text-xs font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
              >
                Gunakan Draf Ini <RiSendPlaneLine size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSurat;
