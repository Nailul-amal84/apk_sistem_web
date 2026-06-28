
import { 
  RiFileTextLine, 
  RiDownloadLine, 
  RiEyeLine, 
  RiInformationLine 
} from "@remixicon/react";


export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full bg-ungu-gelap-800/20 border border-ungu-gelap-700/50 rounded-2xl p-6 overflow-hidden animate-pulse">
      
      {/* Header Table Skeleton */}
      <div className="flex items-center gap-4 border-b border-ungu-gelap-700 pb-4 mb-2">
        {/* Kolom Ikon Dokumen */}
        <div className="w-6 h-6 text-ungu-gelap-600 flex-shrink-0 flex items-center justify-center">
          <RiFileTextLine size={18} />
        </div>
        {/* Kolom Dinamis Sisanya */}
        {[...Array(cols - 1)].map((_, i) => (
          <div key={i} className="h-3.5 bg-ungu-gelap-700 rounded-md flex-1"></div>
        ))}
        {/* Kolom Aksi */}
        <div className="w-20 h-3.5 bg-ungu-gelap-700 rounded-md text-right hidden sm:block"></div>
      </div>

      {/* Rows Table Skeleton */}
      {[...Array(rows)].map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-ungu-gelap-700/40 py-4 last:border-0">
          
          {/* Efek Ikon File Statis di Setiap Awal Baris */}
          <div className="w-6 h-6 text-ungu-gelap-600/50 flex-shrink-0 flex items-center justify-center">
            <RiFileTextLine size={18} />
          </div>

          {/* Isi Baris Data Dinamis */}
          {[...Array(cols - 1)].map((_, c) => (
            <div key={c} className="flex-1 space-y-2">
              {/* Variasi lebar baris biar tidak kaku kotak sempurna */}
              <div 
                className="h-3.5 bg-ungu-gelap-700/60 rounded-md" 
                style={{ width: c === 0 ? '85%' : c === 1 ? '60%' : '95%' }}
              ></div>
            </div>
          ))}

          {/* Placeholder Tombol Aksi menggunakan Ikon Remix asli */}
          <div className="flex items-center gap-2 text-ungu-gelap-600/40">
            <RiEyeLine size={16} />
            <RiDownloadLine size={16} className="hidden sm:block" />
          </div>

        </div>
      ))}
    </div>
  );
};


export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="relative overflow-hidden p-6 rounded-2xl bg-ungu-gelap-800/80 border border-ungu-gelap-700/80 flex items-start justify-between gap-4">
          
          {/* Konten Teks Kiri */}
          <div className="space-y-3 flex-1">
            {/* Label Atas */}
            <div className="h-3 bg-ungu-gelap-700 rounded-md w-1/2"></div>
            {/* Angka Besar */}
            <div className="h-8 bg-ungu-gelap-700 rounded-lg w-1/3 mt-1"></div>
            {/* Deskripsi Bawah */}
            <div className="h-2.5 bg-ungu-gelap-700/60 rounded-md w-3/4"></div>
          </div>

          {/* Ikon Sudut Kanan Atas Card */}
          <div className="w-12 h-12 rounded-xl bg-ungu-gelap-900 border border-ungu-gelap-700/50 text-ungu-gelap-600 flex items-center justify-center flex-shrink-0">
            <RiInformationLine size={22} />
          </div>

        </div>
      ))}
    </div>
  );
};
