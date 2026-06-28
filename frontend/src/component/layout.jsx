import React, { useState, useEffect } from 'react';
import { 
  RiDashboard3Line, 
  RiFileTextLine, 
  RiAddCircleLine, 
  RiHistoryLine, 
  RiFolderOpenLine, 
  RiBarChart2Line, 
  RiUser3Line, 
  RiLogoutBoxRLine,
  RiCompass3Line
} from "@remixicon/react";

const MainLayout = ({ children, currentPage, setPage, handleLogout, user }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Array of Object untuk menyimpan semua konfigurasi halaman (Menu Navigasi)
  const navigationMenu = [
    { id: 'dashboard', name: 'Dashboard', icon: RiDashboard3Line, role: ['mahasiswa', 'sekretaris'] },
    { id: 'jenis-surat', name: 'Jenis Surat', icon: RiFileTextLine, role: ['sekretaris'] },
    { id: 'buat-surat', name: 'Buat Surat', icon: RiAddCircleLine, role: ['mahasiswa'] },
    { id: 'riwayat-surat', name: 'Riwayat', icon: RiHistoryLine, role: ['mahasiswa'] },
    { id: 'semua-surat', name: 'Semua Surat', icon: RiFolderOpenLine, role: ['sekretaris'] },
    { id: 'laporan-surat', name: 'Laporan', icon: RiBarChart2Line, role: ['sekretaris'] },
    { id: 'profil', name: 'Profil', icon: RiUser3Line, role: ['mahasiswa', 'sekretaris'] },
  ];

  // Filter menu berdasarkan role user yang sedang login
  const allowedMenu = navigationMenu.filter(item => 
    !user?.role || item.role.includes(user.role)
  );

  // Efek Utama untuk Menangani Deteksi Scroll dan Ukuran Halaman
  useEffect(() => {
    const checkPageHeight = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // KUNCI UTAMA: Jika tinggi dokumen total tidak melebihi tinggi layar + batas toleransi scroll (100px),
      // berarti ini halaman pendek (tanpa scroll). Paksa menu untuk selalu terlihat.
      if (documentHeight <= windowHeight + 100) {
        setIsVisible(true);
        return true; // Menandakan halaman pendek
      }
      return false; // Menandakan halaman panjang (bisa di-scroll)
    };

    const handleScroll = () => {
      // Jalankan cek tinggi dahulu, jika halaman pendek, hentikan fungsi scroll ke bawahnya
      if (checkPageHeight()) return;

      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. Cek jika scroll sudah benar-benar mentok ke paling bawah pada halaman panjang
      if (currentScrollY + windowHeight >= documentHeight - 20) {
        setIsVisible(false); 
      } else {
        // 2. Logika biasa: scroll kebawah sembunyi, scroll keatas muncul
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    // Jalankan pengecekan instan setiap kali komponen dimuat atau saat halaman berpindah
    checkPageHeight();

    // Daftarkan event listener untuk scroll dan resize layar browser
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkPageHeight);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkPageHeight);
    };
  }, [lastScrollY, currentPage]); // <-- 'currentPage' ditambahkan di sini agar posisi dicek ulang setiap ganti halaman

  return (
    <div className="min-h-screen bg-ungu-gelap-950 font-sans text-ungu-gelap-50 pb-32">
      
      {/* HEADER TOP BAR */}
      <header className="w-full bg-ungu-gelap-900/60 border-b border-ungu-gelap-800/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-hijau-uin rounded-xl flex items-center justify-center text-putih-bersih shadow-md shadow-hijau-botol/10">
            <RiCompass3Line size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-putih-bersih tracking-wide leading-none">E-Surat UIN</h1>
            <span className="text-[10px] text-ungu-gelap-400 font-medium tracking-wider uppercase">SPA Pascasarjana</span>
          </div>
        </div>

        {/* Informasi Akun & Tombol Keluar */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-putih-bersih leading-none">{user?.name || 'Pengguna'}</p>
            <span className="text-[9px] text-hijau-zamrud font-medium capitalize bg-hijau-uin/10 px-2 py-0.5 rounded-full inline-block mt-1">
              {user?.role || 'Sesi Aktif'}
            </span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-ungu-gelap-800 hover:bg-terracotta/20 border border-ungu-gelap-700 hover:border-terracotta text-ungu-gelap-300 hover:text-burnt-orange transition-all duration-200"
            title="Keluar dari Sistem"
          >
            <RiLogoutBoxRLine size={18} />
          </button>
        </div>
      </header>

      {/* AREA KONTEN UTAMA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>

      {/* FLOATING BOTTOM NAVIGATION BAR */}
      <div className={`fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}>
        <nav className="flex items-center gap-1 sm:gap-2 bg-ungu-gelap-900/90 border border-ungu-gelap-700/60 p-2 rounded-2xl shadow-2xl backdrop-blur-xl max-w-full overflow-x-auto no-scrollbar">
          {allowedMenu.map((menu) => {
            const IconComponent = menu.icon;
            const isActive = currentPage === menu.id;

            return (
              <button
                key={menu.id}
                onClick={() => setPage(menu.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap group ${
                  isActive 
                    ? 'bg-hijau-uin text-putih-bersih shadow-lg shadow-hijau-botol/20' 
                    : 'text-ungu-gelap-300 hover:text-putih-bersih hover:bg-ungu-gelap-800/60'
                }`}
              >
                <IconComponent 
                  size={18} 
                  className={`transition-transform duration-300 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`} 
                />
                <span className={`transition-all duration-200 ${
                  isActive ? 'block' : 'hidden sm:block'
                }`}>
                  {menu.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
};

export default MainLayout;
