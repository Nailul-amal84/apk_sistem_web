import { useState } from 'react';
import { postRegister } from '../service/auth';
import { 
  RiUserAddLine, 
  RiUserLine, 
  RiIdCardLine, 
  RiMailLine, 
  RiLock2Line, 
  RiLoader4Line, 
  RiCheckboxCircleLine, 
  RiErrorWarningLine 
} from "@remixicon/react";

const Register = ({ onRegisterSuccess, switchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Nama, Email, dan Password wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const data = await postRegister(name, email, password, nim || null);
      alert(data.message);
      onRegisterSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-ungu-gelap-950 font-sans text-ungu-gelap-50 px-4 overflow-y-auto py-8">
      
      <div className="w-full max-w-md bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-2xl p-8 shadow-2xl my-auto">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-hijau-uin flex items-center justify-center text-putih-bersih shadow-lg shadow-hijau-botol/30 mb-3">
            <RiUserAddLine size={24} />
          </div>
          <h2 className="text-2xl font-bold text-putih-bersih">Buat Akun Baru</h2>
          <p className="text-xs text-ungu-gelap-300 mt-1">Silakan lengkapi formulir pendaftaran</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-terracotta/10 border border-terracotta text-burnt-orange text-xs flex items-center gap-2 animate-pulse">
            <RiErrorWarningLine size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* INPUT NAMA LENGKAP */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200 px-1">Nama Lengkap</label>
            <div className="relative flex items-center">
              <RiUserLine size={18} className="absolute left-4 text-ungu-gelap-400" />
              <input 
                type="text"
                placeholder="Masukkan nama lengkap Anda"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-hijau-uin transition-colors duration-200"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-ungu-gelap-200">NIM / NIP</label>
              <span className="text-[10px] text-ungu-gelap-400">(Opsional)</span>
            </div>
            <div className="relative flex items-center">
              <RiIdCardLine size={18} className="absolute left-4 text-ungu-gelap-400" />
              <input 
                type="text"
                placeholder="Contoh: 1217050001"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-hijau-uin transition-colors duration-200"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200 px-1">Alamat Email</label>
            <div className="relative flex items-center">
              <RiMailLine size={18} className="absolute left-4 text-ungu-gelap-400" />
              <input 
                type="email"
                placeholder="nama@uin.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-hijau-uin transition-colors duration-200"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200 px-1">Password (Min. 6 Karakter)</label>
            <div className="relative flex items-center">
              <RiLock2Line size={18} className="absolute left-4 text-ungu-gelap-400" />
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-sm rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-hijau-uin transition-colors duration-200"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hijau-uin hover:bg-hijau-lumut disabled:bg-ungu-gelap-700 text-putih-bersih font-bold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-hijau-botol/20 mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RiLoader4Line size={18} className="animate-spin" />
                <span>Mendaftarkan...</span>
              </>
            ) : (
              <>
                <span>Daftar Akun</span>
                <RiCheckboxCircleLine size={18} />
              </>
            )}
          </button>

        </form>

        {/* LINK PERPINDAHAN KE LOGIN */}
        <div className="mt-6 text-center border-t border-ungu-gelap-700/50 pt-4">
          <p className="text-xs text-ungu-gelap-300">
            Sudah punya akun?{' '}
            <button 
              onClick={switchToLogin}
              className="text-kuning-emas hover:underline font-semibold focus:outline-none"
            >
              Masuk di sini
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
