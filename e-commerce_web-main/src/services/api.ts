import axiosInstance from "./axios";
import { type Category, type Product } from "../types/product"; // Contoh: tipe produk
// Kalau ada tipe lain nanti tinggal tambah aja

export const api = {
  // Ambil semua produk
  getAllProducts: async (): Promise<Product[]> => {
    const res = await axiosInstance.get("/products");
    return res.data;
  },

  // Ambil produk berdasarkan ID
  getProductById: async (id: number): Promise<Product> => {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await axiosInstance.get("/products/categories");
    return res.data; // Data kategori adalah array of strings
  },

  // Contoh: Tambah produk (jika API support)
  createProduct: async (productData: Omit<Product, "id" | "rating">): Promise<Product> => {
    const res = await axiosInstance.post("/products", productData);
    return res.data;
  },

  // Update produk
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const res = await axiosInstance.put(`/products/${id}`, productData);
    return res.data;
  },

  // Hapus produk
  deleteProduct: async (id: number): Promise<Product> => {
    const res = await axiosInstance.delete(`/products/${id}`);
    return res.data;
  },
};
