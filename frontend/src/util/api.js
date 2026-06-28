import axios from 'axios';

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Sesuaikan dengan URL backend Laravel Anda
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Wajib jika Anda menggunakan Laravel Sanctum berbasis Cookie (SPA Authentication)
  // withCredentials: true, 
  

  withCredentials : false, // nailul jika mau aktifkan kritensial , nantik pastikan allowed_origins ke url forntend di config/cors.php

});

// Interceptor untuk otomatis menyisipkan Bearer Token (Jika Anda menggunakan Token, bukan Cookie)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Ambil token dari localStorage jika ada
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
