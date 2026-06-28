import api from "../util/api";
// Mengambil data profil yang sedang login (GET /profil)
export const getProfil = async () => {
  try {
    const response = await api.get('/profil');
    return response.data; // Mengembalikan data user langsung
  } catch (error) {
    throw error.response?.data || new Error("Gagal memuat data profil.");
  }
};

// Memperbarui data profil (PUT /profil)
export const putProfil = async (name, nim) => {
  try {
    const response = await api.put('/profil', { name, nim });
    return response.data; // Mengembalikan objek { message, user }
  } catch (error) {
    const errors = error.response?.data?.errors;
    if (errors) {
      const firstErrorKey = Object.keys(errors)[0];
      throw new Error(errors[firstErrorKey][0]);
    }
    throw error.response?.data || new Error("Gagal memperbarui profil.");
  }
};
