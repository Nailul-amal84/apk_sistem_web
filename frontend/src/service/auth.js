import api from "../util/api";

export const postLogin = async (email, password) => {
  try {
    
    // await api.get('/sanctum/csrf-cookie', { withCredentials: true });

    // 2. Kirim data login ke endpoint API Laravel Anda (misal: /login)
    const response = await api.post('/login', { email, password });
    
    // 3. Jika backend  menggunakan sistem Token (API Token), simpan tokennya
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data; // Mengembalikan data user & status dari backend
  } catch (error) {
    // Lempar error spesifik pesan dari Laravel agar bisa ditampilkan di form UI
    const message = error.response?.data?.message || "Email atau password salah.";
    throw new Error(message);
  }
};


export const postRegister = async (name, email, password, nim) => {
  try {
    // 1. Inisialisasi CSRF cookie untuk keamanan Sanctum
    // await api.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
    //
    //// nailul jika mau aktifkan kritensial , nantik pastikan allowed_origins ke url forntend di config/cors.php
    // 2. Kirim data registrasi ke endpoint Laravel (misal: /register)
    const response = await api.post('/register', { name, email, password, nim });
    
    // 3. Simpan token ke localStorage jika disertakan di response
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data; // Mengembalikan objek { message, user, token }
  } catch (error) {
    // Menangkap pesan error validasi terperinci dari Laravel
    const errors = error.response?.data?.errors;
    if (errors) {
      // Mengambil error pertama yang muncul dari validasi Laravel
      const firstErrorKey = Object.keys(errors)[0];
      throw new Error(errors[firstErrorKey][0]);
    }
    throw new Error(error.response?.data?.message || "Registrasi gagal, periksa kembali data Anda.");
  }
};
