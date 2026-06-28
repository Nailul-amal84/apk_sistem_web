import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'
import Register from './pages/register'
import Login from './pages/login'

import { getProfil } from './service/profile'

import MainLayout from './layout'
import Sidebar from './component/sidebar'

import  Profil  from "./pages/profil";
import Dashboard from './pages/dashboard'
import RiwayatSurat from './pages/riwayatSurat'
import LaporanSurat from './pages/LaporanSurat'
import JenisSurat from './pages/jenisSurat'
import SemuaSurat from './pages/semuaSurat'
import BuatSurat from './pages/buatSurat'
import TemplateSurat from './pages/templateSurat'

function App() {

// simpan curent halaman saat inni
  const [page ,setPage] = useState("dashboard")
// State user untuk menyimpan data setelah berhasil login/register
  const [user, setUser] = useState(null);

// State untuk menunggu proses pengecekan token saat aplikasi pertama dimuat / di-refresh
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Cek Token saat pertama kali aplikasi dibuka (Menghindari Kick saat Refresh)
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Jika ada token, verifikasi ke Laravel untuk mengambil data user terbaru
      getProfil()
        .then((data) => {
          const userObj = data.user || data;
          setUser(userObj);
          setPage('dashboard'); // Jika token valid, langsung ke dashboard
        })
        .catch(() => {
          // Jika token kedaluwarsa atau tidak valid, bersihkan
          localStorage.removeItem('token');
          setUser(null);
          setPage('login');
        })
        .finally(() => {
          setIsLoadingAuth(false); // Selesai memverifikasi
        });
    } else {
      setIsLoadingAuth(false); // Tidak ada token, langsung buka halaman login
    }
  }, []);

 
  // Callback fungsi ketika login di halaman Login.jsx berhasil
  const handleLoginSuccess = (userData) => {
    setUser(userData); // Mengisi state user dengan data dari Laravel
    setPage('dashboard'); // Arahkan default ke halaman dashboard
  };
  // Fungsi penanganan logout aplikasi
  const handleLogout = () => {
    if(confirm("Apakah anda yakin ingin keluar?")) {
      localStorage.removeItem('token');
      setUser(null); // Menghapus data user mengembalikan tampilan otomatis ke layar Login
    }
  };
// TAMPILAN LOADING LOADING UTAMA (Saat aplikasi sedang mengecek token di background)
  if (isLoadingAuth) {
    return (
      <div className="w-full h-screen bg-ungu-gelap-950 flex flex-col items-center justify-center text-putih-bersih">
        <i className="ri-loader-4-line animate-spin text-4xl text-hijau-zamrud mb-2"></i>
        <p className="text-xs text-ungu-gelap-300 tracking-wide font-medium">Memverifikasi Sesi Autentikasi...</p>
      </div>
    );
  }

// GERBANG AUTENTIKASI: Jika user BELUM login
if (!user) {
    if (page === 'register') {
      return (
        <Register 
          onRegisterSuccess={handleLoginSuccess} 
          switchToLogin={() => setPage('login')} 
        />
      );
    }
    
    // Default fallback jika page bukan 'register', tampilkan halaman Login
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        switchToRegister={() => setPage('register')} 
      />
    );
  }


 // APLIKASI UTAMA: Jika user SUDAH login
return (
  <div className="w-full min-h-screen flex bg-ungu-gelap-950 text-ungu-gelap-50 overflow-x-hidden">
    
    {/* Sidebar Komponen */}
    <Sidebar currentPage={page} setPage={setPage} handleLogout={handleLogout} user={user}/>
    
    {/* Konten Halaman Utama */}
    <main className="flex-1 min-w-0 h-screen overflow-y-auto px-4 py-6 md:px-10 lg:py-8 pt-20 lg:pt-8">
      <div className="max-w-7xl mx-auto">
        
        {page === 'dashboard' && <Dashboard user={user} setPage={setPage} />}
        {page === "jenis-surat" && <JenisSurat/>}
        {page === 'buat-surat' && <BuatSurat setPage={setPage} />}
        {page === 'template-surat' && <TemplateSurat setPage={setPage} />}
        {page === 'riwayat-surat' && <RiwayatSurat />}
        {page === 'semua-surat' && <SemuaSurat />}
        {page === 'laporan-surat' && <LaporanSurat />}    
        {page === 'profil' && <Profil onProfileUpdate={(updatedUser) => setUser(updatedUser)} />}



  {/* halaman ini bisa di hapus jika tidak butuh , karena untuk di gunkan sementara nailul */}
{/* Halaman Auth */}
        {page === 'login' && <Login setPage={setPage} setUser={setUser} />}
        {page === 'register' && <Register setPage={setPage} />}

      </div>
    </main>

  </div>
);
 }

export default App
