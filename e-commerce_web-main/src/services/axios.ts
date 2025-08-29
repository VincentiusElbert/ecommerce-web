// axios.ts: Membuat instance axios dengan konfigurasi global
import axios from "axios";

// Buat instance axios biar nggak perlu nulis config terus
const axiosInstance = axios.create({
  baseURL: "https://fakestoreapi.com", // Ganti kalau nanti pindah API
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // opsional, supaya ada batas waktu request
});

// Tambahkan interceptor jika perlu (nanti bisa buat auth, log, dll)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error); // teruskan error-nya
  }
);

export default axiosInstance;
