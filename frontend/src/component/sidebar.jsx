import React, { useState } from 'react';
// IMPORT IKON TERMASUK IKON BARU UNTUK LOGIN & REGISTER
import { 
  RiDashboard2Line, 
  RiMailAddLine, 
  RiHistoryLine, 
  RiInboxArchiveLine, 
  RiFileChartLine, 
  RiUserSettingsLine,
  RiMailSendLine,
  RiShuffleLine,
  RiLogoutBoxRLine,
  RiMenu2Line,
  RiCloseLine,
  RiLoginBoxLine,    
  RiUserAddLine,     
  RiFileSettingsLine
} from "@remixicon/react";

const Sidebar = ({ currentPage, setPage, handleLogout, user }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Ditambahkan halaman login dan register dengan properti hideInNav: true
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: RiDashboard2Line, role: 'all' },
    { id: 'buat-surat', name: 'Pengajuan Surat', icon: RiMailAddLine, role: 'all' },
    { id: 'riwayat-surat', name: 'Riwayat Surat', icon: RiHistoryLine, role: 'all' },
    { id: 'semua-surat', name: 'Semua Pengajuan', icon: RiInboxArchiveLine, role: 'sekretaris' },
    { id: 'laporan-surat', name: 'Laporan Grafik', icon: RiFileChartLine, role: 'sekretaris' },
    { id: 'profil', name: 'Profil Saya', icon: RiUserSettingsLine, role: 'all' },
{ id: 'template-surat', name: 'Template Surat', icon: RiFileSettingsLine  ,role : "all" }, // iniin haaman yang mengambil /template
    { id: 'login', name: 'Halaman Login', icon: RiLoginBoxLine, role: 'all', hideInNav: true },
    { id: 'register', name: 'Halaman Register', icon: RiUserAddLine, role: 'all', hideInNav: true },
  ];

  const userRole = user?.role || 'user';
  
  // 1. Array untuk Semua Menu yang diizinkan berdasarkan Role (Dipakai untuk Quick Switcher)
  const allowedMenus = menuItems.filter(item => item.role === 'all' || item.role === userRole);

  // 2. Array Khusus Navigasi Utama (Menyaring menu yang memiliki properti hideInNav)
  const mainNavigationMenus = allowedMenus.filter(item => !item.hideInNav);

  const getMenuClass = (pageName) => {
    const baseClass = "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left mb-1 text-sm group";
    if (currentPage === pageName) {
      return `${baseClass} bg-ungu-gelap-600 text-kuning-emas border-l-4 border-hijau-uin shadow-lg`;
    }
    return `${baseClass} text-ungu-gelap-200 hover:bg-ungu-gelap-700 hover:text-putih-bersih`;
  };

  const handleMenuSelect = (id) => {
    setPage(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* HEADER NAVBAR MOBILE */}
      <header className="lg:hidden w-full bg-ungu-gelap-800 border-b border-ungu-gelap-700 h-16 fixed top-0 left-0 right-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-ungu-gelap-100 hover:text-putih-bersih rounded-lg hover:bg-ungu-gelap-700 transition-colors"
          >
            <RiMenu2Line size={24} />
          </button>
          <span className="font-bold text-sm tracking-wide text-putih-bersih">
            E-Surat <span className="text-kuning-emas">UIN</span>
          </span>
        </div>
        
        <span className="text-[10px] bg-hijau-uin/20 text-hijau-zamrud px-2.5 py-1 rounded-full font-semibold capitalize">
          {userRole}
        </span>
      </header>

      {/* BACKDROP OVERLAY MOBILE */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* NAVIGATION PANEL */}
      <aside className={`
        w-64 h-screen fixed lg:sticky top-0 left-0 bg-ungu-gelap-800 border-r border-ungu-gelap-700 p-5 flex flex-col justify-between flex-shrink-0 z-50 transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="flex flex-col overflow-y-auto no-scrollbar flex-1">
          <div className="flex items-center justify-between px-2 py-3 mb-6 border-b border-ungu-gelap-700 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-hijau-uin flex items-center justify-center font-bold text-putih-bersih shadow-md shadow-hijau-botol/20">
                <RiMailSendLine size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-wide text-putih-bersih leading-tight">
                  E-Surat <span className="text-kuning-emas">UIN</span>
                </span>
                <span className="text-[10px] text-ungu-gelap-300 font-medium tracking-wider uppercase">Persuratan SPA</span>
              </div>
            </div>

            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 text-ungu-gelap-400 hover:text-putih-bersih rounded-lg bg-ungu-gelap-900/40"
            >
              <RiCloseLine size={18} />
            </button>
          </div>

          {/* KONTEN NAVIGASI UTAMA (Sembunyikan Login & Register) */}
          <nav className="flex-1">
            <p className="px-3 text-[10px] font-bold text-ungu-gelap-400 tracking-wider uppercase mb-3">Navigasi Sistem</p>
            {mainNavigationMenus.map((menu) => {
              const IconComponent = menu.icon;
              return (
                <button 
                  key={menu.id} 
                  className={getMenuClass(menu.id)} 
                  onClick={() => handleMenuSelect(menu.id)}
                >
                  <IconComponent size={18} className="transition-transform duration-200 group-hover:scale-110" />
                  <span>{menu.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-ungu-gelap-700 flex flex-col gap-4">
          
          {/* QUICK SWITCH PAGE (Tampilkan Semua termasuk Login & Register) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-ungu-gelap-300 tracking-wider uppercase px-1 flex items-center gap-1">
              <RiShuffleLine size={12} /> Quick Switch Page
            </label>
            <select 
              value={currentPage} 
              onChange={(e) => handleMenuSelect(e.target.value)}
              className="w-full bg-ungu-gelap-950 border border-ungu-gelap-700 text-ungu-gelap-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-hijau-uin cursor-pointer font-medium"
            >
              {allowedMenus.map((menu) => (
                <option key={menu.id} value={menu.id} className="bg-ungu-gelap-800 text-putih-bersih">
                  {menu.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-xl bg-ungu-gelap-950/40 border border-ungu-gelap-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-hijau-botol flex items-center justify-center font-bold text-soft-ochre text-sm capitalize">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-putih-bersih truncate">{user?.name || 'Ahmad Fauzi'}</p>
              <p className="text-[10px] text-ungu-gelap-300 truncate capitalize">{userRole}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-terracotta hover:bg-terracotta/10 transition-colors duration-200 text-left"
          >
            <RiLogoutBoxRLine size={16} />
            <span>Keluar Aplikasi</span>
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;
