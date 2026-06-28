import { 
  RiDashboard3Line, 
  RiMailOpenLine, 
  RiFileTextLine, 
  RiShieldUserLine, 
  RiDraftLine, 
  RiUserSettingsLine, 
  RiArrowRightLine 
} from "@remixicon/react";

const Dashboard = ({ user, setPage }) => {
  return (
    <div className="relative w-full min-h-[75vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      
    
      {/* Efek Cahaya Pendar (Ambient Glow) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-hijau-uin/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <RiMailOpenLine size={72} className="absolute top-6 left-12 text-ungu-gelap-700/10 rotate-12 pointer-events-none select-none hidden sm:block" />
      <RiFileTextLine size={84} className="absolute bottom-10 right-16 text-ungu-gelap-700/10 -rotate-12 pointer-events-none select-none hidden sm:block" />
      <RiShieldUserLine size={60} className="absolute top-1/3 right-12 text-ungu-gelap-700/5 rotate-45 pointer-events-none select-none hidden md:block" />
      <RiDraftLine size={60} className="absolute bottom-1/3 left-16 text-ungu-gelap-700/5 -rotate-45 pointer-events-none select-none hidden md:block" />


    
      <div className="relative max-w-md w-full bg-ungu-gelap-800/60 border border-ungu-gelap-700/80 p-8 rounded-2xl shadow-2xl backdrop-blur-md space-y-6 text-center animate-fadeIn z-10">
        
        {/* Ikon Sambutan Utama */}
        <div className="w-16 h-16 bg-hijau-uin/15 text-hijau-zamrud rounded-full flex items-center justify-center mx-auto shadow-inner border border-hijau-uin/30 animate-pulse">
          <RiDashboard3Line size={28} />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-putih-bersih tracking-wide">
            Selamat Datang, <span className="text-hijau-zamrud">{user?.name || 'Pengguna'}</span>!
          </h1>
          <p className="text-xs text-ungu-gelap-300 leading-relaxed">
            Sistem Informasi Layanan Pengajuan Surat Elektronik UIN Ar-Raniry Banda Aceh.
          </p>
        </div>

        <div className="h-[1px] w-full bg-ungu-gelap-700/50"></div>

        {/* Bagian Tengah: Ajakan Mengarah ke Profil */}
        <div className="space-y-4">
          <p className="text-xs text-ungu-gelap-200 leading-relaxed px-2">
            Sebelum memulai pengajuan dokumen baru, pastikan data identitas Anda sudah diisi dengan benar.
          </p>
          
          <button
            onClick={() => setPage('profil')}
            className="group inline-flex items-center gap-2 bg-ungu-gelap-900/80 hover:bg-ungu-gelap-950 text-putih-bersih font-semibold text-xs px-5 py-3 rounded-xl border border-ungu-gelap-700 hover:border-hijau-uin transition-all duration-300 shadow-lg"
          >
            <RiUserSettingsLine size={16} className="text-kuning-emas group-hover:text-hijau-zamrud transition-colors" />
            <span>Periksa Data di Halaman Profil</span>
            <i className="inline-flex group-hover:translate-x-1 transition-transform">
              <RiArrowRightLine size={14} className="text-ungu-gelap-400" />
            </i>
          </button>
        </div>

      </div>

      <p className="relative text-[10px] text-ungu-gelap-400 mt-8 tracking-wider uppercase z-10 select-none">
        &copy; {new Date().getFullYear()} UIN Ar-Raniry Banda Aceh
      </p>

    </div>
  );
};

export default Dashboard;
