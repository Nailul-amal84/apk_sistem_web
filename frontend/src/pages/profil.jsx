import { useState , useEffect } from 'react';
import { getProfil, putProfil } from '../service/profile';

const Profil = ({ onProfileUpdate }) => {
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Ambil data profil segar dari server saat komponen dimuat
  useEffect(() => {
    getProfil()
      .then((data) => {
        // Jika endpoint mengembalikan direct object user atau dibungkus data
        const userObj = data.user || data;
        setName(userObj.name || '');
        setNim(userObj.nim || '');
        setEmail(userObj.email || '');
        setRole(userObj.role || '');
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!name.trim()) {
      setError('Nama Lengkap wajib diisi.');
      return;
    }

    setLoadingSubmit(true);
    try {
      const response = await putProfil(name, nim || null);
      
      setSuccessMessage(response.message);
      // Callback untuk memperbarui state user global di App.jsx secara realtime
      onProfileUpdate(response.user); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  };

  // SKELETON LOADING UNTUK FORM PROFIL
  if (loading) {
    return (
      <div className="max-w-xl bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-2xl p-6 shadow-xl space-y-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-ungu-gelap-700"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-ungu-gelap-700 rounded w-1/3"></div>
            <div className="h-3 bg-ungu-gelap-700 rounded w-1/4"></div>
          </div>
        </div>
        <div className="space-y-4 pt-4 border-t border-ungu-gelap-700/50">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-ungu-gelap-700 rounded w-1/5"></div>
              <div className="h-10 bg-ungu-gelap-700 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-2xl p-6 shadow-xl">
      
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-ungu-gelap-900 border-2 border-hijau-uin flex items-center justify-center text-putih-bersih text-2xl font-bold shadow-inner">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h1 className="text-lg font-bold text-putih-bersih">{name}</h1>
          <span className="inline-block px-2.5 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider bg-hijau-uin/20 text-hijau-zamrud border border-hijau-uin/10">
            Hak Akses: {role}
          </span>
        </div>
      </div>

      {/* NOTIFIKASI INFORMASI */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-terracotta/10 border border-terracotta text-burnt-orange text-xs flex items-center gap-2">
          <i className="ri-error-warning-line text-base"></i>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-hijau-uin/10 border border-hijau-uin text-hijau-zamrud text-xs flex items-center gap-2">
          <i className="ri-checkbox-circle-line text-base"></i>
          <span>{successMessage}</span>
        </div>
      )}

      {/* FORM PENGATURAN PROFIL */}
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        
        {/* INPUT ALAMAT EMAIL (READ ONLY) */}
        <div className="flex flex-col gap-1.5 opacity-60">
          <label className="text-xs font-semibold text-ungu-gelap-200 px-1">Alamat Email (Permanen)</label>
          <div className="relative flex items-center">
            <i className="ri-mail-line absolute left-4 text-ungu-gelap-400 text-lg"></i>
            <input 
              type="text" 
              value={email} 
              readOnly 
              className="w-full bg-ungu-gelap-950 border border-ungu-gelap-800 text-ungu-gelap-300 text-xs rounded-xl pl-11 pr-4 py-2.5 cursor-not-allowed focus:outline-none"
            />
          </div>
        </div>

        {/* INPUT NAMA LENGKAP */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-ungu-gelap-200 px-1">Nama Lengkap *</label>
          <div className="relative flex items-center">
            <i className="ri-user-line absolute left-4 text-ungu-gelap-400 text-lg"></i>
            <input 
              type="text"
              required
              placeholder="Masukkan nama lengkap baru"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-hijau-uin transition"
              disabled={loadingSubmit}
            />
          </div>
        </div>

        {/* INPUT NIM / NIP (NULLABLE) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-xs font-semibold text-ungu-gelap-200">NIM / Nomor Induk</label>
            <span className="text-[10px] text-ungu-gelap-400">(Opsional)</span>
          </div>
          <div className="relative flex items-center">
            <i className="ri-id-card-line absolute left-4 text-ungu-gelap-400 text-lg"></i>
            <input 
              type="text"
              placeholder="Masukkan nomor induk Anda"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-hijau-uin transition"
              disabled={loadingSubmit}
            />
          </div>
        </div>

        {/* TOMBOL SIMPAN */}
        <button
          type="submit"
          disabled={loadingSubmit}
          className="w-full bg-hijau-uin hover:bg-hijau-lumut text-putih-bersih font-bold py-3 rounded-xl transition shadow-md shadow-hijau-botol/20 mt-2 flex items-center justify-center gap-1.5"
        >
          {loadingSubmit ? (
            <i className="ri-loader-4-line animate-spin text-lg"></i>
          ) : (
            <>
              <i className="ri-save-line"></i>
              <span>Simpan Perubahan</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default Profil;
