// src/context/CategoryFilterContext.tsx

// 1. Import library dan tipe yang dibutuhkan
import React, { createContext, useContext, useState, type ReactNode } from "react";
//    - React: Library utama React.
//    - createContext: Untuk membuat objek Context.
//    - useContext: Hook untuk mengkonsumsi nilai dari Context.
//    - useState: Hook untuk mengelola state lokal di komponen fungsional.
//    - type ReactNode: Tipe dari React untuk properti `children` (konten di dalam komponen React).

import { type Category } from "../types/product";
//    - type Category: Mengimpor definisi tipe `Category` (yang kita definisikan sebagai `string`)
//      dari file `product.ts` di folder `types`. Ini memastikan kita bekerja dengan tipe kategori yang konsisten.

// 2. Definisikan Tipe untuk Konteks (CategoryFilterContextType)
interface CategoryFilterContextType {
  // - Ini adalah 'kontrak' atau 'blueprint' dari nilai yang akan disediakan oleh konteks kategori ini.
  //   Setiap komponen yang menggunakan `useCategoryFilter()` akan menerima objek dengan properti-properti ini.

  selectedCategory: Category | null;
  //    - selectedCategory: Properti yang akan menyimpan kategori yang sedang dipilih oleh pengguna.
  //      Tipe `Category` (yang adalah `string`) atau `null` jika belum ada kategori yang dipilih.

  setSelectedCategory: (category: Category | null) => void;
  //    - setSelectedCategory: Sebuah fungsi yang menerima `Category` atau `null` sebagai argumen
  //      dan tidak mengembalikan apa-apa (`void`). Fungsi ini digunakan untuk memperbarui `selectedCategory`
  //      di dalam konteks.
}

// 3. Buat Objek Konteks (CategoryFilterContext)
const CategoryFilterContext = createContext<CategoryFilterContextType | undefined>(undefined);
//    - createContext: Membuat objek konteks kategori itu sendiri.
//    - <CategoryFilterContextType | undefined>: Menentukan tipe nilai yang bisa disimpan dalam konteks ini.
//      `undefined` digunakan sebagai nilai default awal, dan juga menandakan bahwa `useContext`
//      bisa mengembalikan `undefined` jika hook digunakan di luar `CategoryFilterProvider`.

// 4. Definisikan Props untuk Komponen Provider (CategoryFilterProviderProps)
interface CategoryFilterProviderProps {
  children: ReactNode;
  //    - children: Properti `ReactNode` yang wajib. Ini adalah komponen-komponen React yang
  //      akan dibungkus oleh `CategoryFilterProvider` dan akan memiliki akses ke nilai konteks kategori.
}

// 5. Komponen Provider (CategoryFilterProvider)
export const CategoryFilterProvider: React.FC<CategoryFilterProviderProps> = ({ children }) => {
  // - Ini adalah komponen utama yang akan "menyediakan" nilai konteks kategori.
  //   Semua state dan logika yang relevan dengan filter kategori akan dikelola di sini.

  // State untuk mengelola kategori yang sedang dipilih
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  //    - selectedCategory: State yang akan menampung kategori yang aktif. Defaultnya `null`
  //      karena saat pertama kali aplikasi dimuat, mungkin belum ada kategori yang difilter.

  // 6. Nilai Konteks yang Disediakan
  const contextValue = {
    // Ini adalah objek yang akan menjadi `value` dari `CategoryFilterContext.Provider`.
    // Properti-properti ini harus sesuai dengan `CategoryFilterContextType` yang didefinisikan di atas.

    selectedCategory, // Menyediakan kategori yang sedang dipilih
    setSelectedCategory, // Menyediakan fungsi untuk mengubah kategori yang dipilih
  };

  // 7. Merender Provider Konteks
  return <CategoryFilterContext.Provider value={contextValue}>{children}</CategoryFilterContext.Provider>;
  //    - CategoryFilterContext.Provider: Komponen ini "membungkus" komponen `children`.
  //    - value={contextValue}: Semua komponen anak yang dibungkus oleh provider ini
  //      (dan juga cucu, cicit, dst.) dapat mengakses `contextValue` ini
  //      menggunakan hook `useContext(CategoryFilterContext)` atau `useCategoryFilter()`.
}; // Akhir dari komponen CategoryFilterProvider

// 8. Custom Hook untuk Penggunaan Konteks (useCategoryFilter)
export const useCategoryFilter = () => {
  // - Ini adalah custom hook yang berfungsi sebagai shortcut yang rapi untuk `useContext`.
  //   Daripada memanggil `useContext(CategoryFilterContext)` dan menangani `undefined` setiap kali,
  //   kita bisa memanggil `useCategoryFilter()`.

  const context = useContext(CategoryFilterContext);
  //    - Menggunakan `useContext` untuk mengambil nilai dari `CategoryFilterContext`.

  if (context === undefined) {
    // - Ini adalah pengecekan penting untuk error handling.
    //   Jika `useCategoryFilter` dipanggil dari komponen yang tidak berada di dalam `CategoryFilterProvider`,
    //   maka `context` akan `undefined`.
    throw new Error("useCategoryFilter must be used within a CategoryFilterProvider");
    //    - Dalam kasus ini, kita melempar error yang jelas agar developer tahu masalahnya.
  }
  return context; // Mengembalikan nilai konteks (objek CategoryFilterContextType).
};
