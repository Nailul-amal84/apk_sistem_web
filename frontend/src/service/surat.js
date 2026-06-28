import api from "../util/api";

/**

 * Sesuai dengan route Laravel: Route::get('/jenis-surat')
 * Controller: JenisSuratController@index
 */
export const getJenisSurat = async () => {
  try {
    // Memanggil API instance yang sudah dikonfigurasi baseURL-nya
    const response = await api.get('/jenis-surat');
    
    // Mengembalikan data array of objects langsung dari database Laravel
    return response.data; 
  } catch (error) {
    // Menangkap pesan error dari server untuk mempermudah debugging
    console.error("Error pada getJenisSurat service:", error.response?.data || error.message);
    
    // Melempar error agar bisa ditangkap oleh blok .catch() di komponen UI
    throw error;
  }
};

/**
 * Mengambil seluruh dataset template surat dari backend Laravel
 * Endpoint: /template
 */
export const getTemplateSuratAll = async () => {
  try {
    // Memanggil API instance menuju endpoint baru /template
    const response = await api.get('/template');
    
    // Mengembalikan data hasil fetch dari service Laravel
    return response.data; 
  } catch (error) {
    console.error("Error pada getTemplateSuratAll service:", error.response?.data || error.message);
    throw error;
  }
};



// Mengajukan surat baru (POST /surat)
export const postBuatSurat = async (dataSurat) => {
  try {
    const response = await api.post('/surat', dataSurat);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Gagal mengirim pengajuan surat.");
  }
};

//Mengambil riwayat surat milik user aktif (GET /surat/riwayat)
export const getRiwayatSurat = async () => {
  try {
    const response = await api.get('/surat/riwayat');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Gagal memuat riwayat surat.");
  }
};

// Mengunduh file PDF Surat yang disetujui (GET /surat/{id}/download)
export const downloadPdfSurat = async (id, nomorSurat) => {
  try {
    const response = await api.get(`/surat/${id}/download`, {
      responseType: 'blob' // Wajib untuk penanganan file biner/PDF
    });
    
    // Proses download file otomatis di sisi client
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Format nama file: mengganti karakter '/' menjadi '-' agar aman di OS
    const namaFile = nomorSurat ? nomorSurat.replace(/\//g, '-') : `Surat-${id}`;
    link.setAttribute('download', `Surat-${namaFile}.pdf`);
    
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error("Gagal mengunduh berkas PDF. Pastikan surat sudah disetujui.");
  }
};

//  Khusus Sekretaris: Melihat semua pengajuan masuk (GET /surat/semua)
export const getSemuaSurat = async () => {
  try {
    const response = await api.get('/surat/semua');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Gagal memuat semua pengajuan.");
  }
};

// 5. Khusus Sekretaris: Menyetujui surat (PUT /surat/{id}/approve)
export const putApproveSurat = async (id) => {
  try {
    const response = await api.put(`/surat/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Gagal menyetujui surat.");
  }
};

//  Khusus Sekretaris: Menolak surat dengan catatan (PUT /surat/{id}/tolak)
export const putTolakSurat = async (id, catatan) => {
  try {
    const response = await api.put(`/surat/${id}/tolak`, { catatan_sekretaris: catatan });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Gagal memproses penolakan.");
  }
};

//Khusus Sekretaris: Mendapatkan data ringkasan grafik laporan (GET /surat/laporan)
export const getLaporanSurat = async () => {
  try {
    const response = await api.get('/surat/laporan');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Gagal memuat laporan grafik.");
  }
};
