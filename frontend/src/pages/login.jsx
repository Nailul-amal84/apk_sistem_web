import { postLogin } from "../service/auth";
import { useState } from "react";
import { 
  RiMailSendLine, 
  RiMailLine, 
  RiLock2Line, 
  RiLoader4Line, 
  RiArrowRightLine, 
  RiErrorWarningLine 
} from "@remixicon/react";

const Login = ({ onLoginSuccess, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    setLoading(true);
    try {
      const data = await postLogin(email, password);
      onLoginSuccess(data.user); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-ungu-gelap-950 font-sans text-ungu-gelap-50 px-4">
      
      {/* CARD KOTAK LOGIN */}
      <div className="w-full max-w-md bg-ungu-gelap-800 border border-ungu-gelap-700 rounded-2xl p-8 shadow-2xl">
        
        {/* BRAND LOGO */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-hijau-uin flex items-center justify-center text-putih-bersih shadow-lg shadow-hijau-botol/30 mb-3">
            <RiMailSendLine size={24} />
          </div>
          <h2 className="text-2xl font-bold text-putih-bersih">Selamat Datang</h2>
          <p className="text-xs text-ungu-gelap-300 mt-1">
            Masuk ke Aplikasi E-Surat <span className="text-kuning-emas font-semibold">UIN</span> SPA
          </p>
        </div>

        {/* ALERT ERROR JIKA LOGIN GAGAL */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-terracotta/10 border border-terracotta text-burnt-orange text-xs flex items-center gap-2 animate-pulse">
            <RiErrorWarningLine size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM UTAMA */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* INPUT EMAIL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200 px-1">Alamat Email</label>
            <div className="relative flex items-center">
              <RiMailLine size={18} className="absolute left-4 text-ungu-gelap-400" />
              <input 
                type="email"
                placeholder="nama@uin.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-hijau-uin transition-colors duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* INPUT PASSWORD */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ungu-gelap-200 px-1">Password</label>
            <div className="relative flex items-center">
              <RiLock2Line size={18} className="absolute left-4 text-ungu-gelap-400" />
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ungu-gelap-900 border border-ungu-gelap-700 text-putih-bersih text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-hijau-uin transition-colors duration-200"
                disabled={loading}
              />
            </div>
          </div>

          {/* BUTTON SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hijau-uin hover:bg-hijau-lumut disabled:bg-ungu-gelap-700 text-putih-bersih font-bold text-sm py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-hijau-botol/20 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RiLoader4Line size={18} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <RiArrowRightLine size={18} />
              </>
            )}
          </button>

        </form>

        {/* FOOTER KARTU LOGIN */}
        <div className="mt-8 text-center border-t border-ungu-gelap-700/50 pt-4 space-y-3">
          <p className="text-xs text-ungu-gelap-300">
            Belum memiliki akun?{' '}
            <button 
              onClick={switchToRegister} 
              className="text-kuning-emas hover:underline font-semibold focus:outline-none"
            >
              Daftar di sini
            </button>
          </p>
          <p className="text-[11px] text-ungu-gelap-400 select-none">
            &copy; 2026 Pascasarjana UIN. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
