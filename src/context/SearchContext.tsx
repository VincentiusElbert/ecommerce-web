// src/context/SearchContext.tsx

// 1. Import library dan tipe yang dibutuhkan
import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
//    - React: Library utama React.
//    - createContext: Untuk membuat objek Context.
//    - useContext: Hook untuk mengkonsumsi nilai dari Context.
//    - useState: Hook untuk mengelola state lokal di komponen fungsional.
//    - useEffect: Hook untuk efek samping, seperti fetching data.
//    - useMemo: Hook untuk mengoptimasi kinerja, mencegah perhitungan ulang yang tidak perlu.
//    - type ReactNode: Tipe dari React untuk properti `children` (konten di dalam komponen React).

import { type Product } from "../types/product";
//    - type Product: Mengimpor definisi tipe `Product` dari file `product.ts` di folder `types`.
//      Ini memastikan kita bekerja dengan struktur data produk yang konsisten dan type-safe.

import { api } from "../services/api";
//    - api: Mengimpor objek `api` dari `services/api.ts`. Objek ini berisi semua fungsi
//      untuk berinteraksi dengan API eksternal (misalnya `api.getAllProducts()`).

// 2. Definisikan Tipe untuk Konteks (SearchContextType)
interface SearchContextType {
  // - Ini adalah 'kontrak' atau 'blueprint' dari nilai yang akan disediakan oleh konteks ini.
  //   Setiap komponen yang menggunakan `useSearch()` akan menerima objek dengan properti-properti ini.

  searchTerm: string;
  //    - searchTerm: Properti `string` yang akan menyimpan kata kunci pencarian yang dimasukkan pengguna.

  setSearchTerm: (term: string) => void;
  //    - setSearchTerm: Sebuah fungsi yang menerima `string` (`term`) dan tidak mengembalikan apa-apa (`void`).
  //      Fungsi ini digunakan untuk memperbarui `searchTerm` di dalam konteks.

  filteredProducts: Product[];
  //    - filteredProducts: Sebuah array dari objek `Product`. Ini adalah hasil akhir dari proses filtering
  //      berdasarkan `searchTerm` yang akan disediakan kepada konsumen konteks.

  searchLoading: boolean;
  //    - searchLoading: Sebuah `boolean` yang menunjukkan apakah proses fetching data produk (atau filtering)
  //      sedang berlangsung. Berguna untuk menampilkan loading spinner.

  searchError: string | null;
  //    - searchError: Sebuah `string` atau `null`. Jika ada kesalahan saat fetching data, pesan error akan disimpan di sini.
  //      Jika tidak ada error, nilainya `null`.
}

// 3. Buat Objek Konteks (SearchContext)
const SearchContext = createContext<SearchContextType | undefined>(undefined);
//    - createContext: Membuat objek konteks itu sendiri.
//    - <SearchContextType | undefined>: Menentukan tipe nilai yang bisa disimpan dalam konteks ini.
//      `undefined` digunakan sebagai nilai default awal, dan juga menandakan bahwa `useContext`
//      bisa mengembalikan `undefined` jika hook digunakan di luar `SearchProvider`.

// 4. Definisikan Props untuk Komponen Provider (SearchProviderProps)
interface SearchProviderProps {
  children: ReactNode;
  //    - children: Properti `ReactNode` yang wajib. Ini adalah komponen-komponen React yang
  //      akan dibungkus oleh `SearchProvider` dan akan memiliki akses ke nilai konteks.
}

// 5. Komponen Provider (SearchProvider)
export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  // - Ini adalah komponen utama yang akan "menyediakan" nilai konteks.
  //   Semua state dan logika yang relevan dengan pencarian akan dikelola di sini.

  // State untuk mengelola input pencarian pengguna
  const [searchTerm, setSearchTerm] = useState<string>("");
  //    - searchTerm: State yang akan menampung teks pencarian dari `SearchBar`. Defaultnya string kosong.

  // State untuk menyimpan semua produk mentah yang diambil dari API
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  //    - allProducts: State yang akan menampung *semua* data produk yang berhasil
  //      diambil dari Fakestore API. Ini adalah data 'mentah' sebelum difilter.

  // State untuk status loading (saat fetching `allProducts`)
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  //    - searchLoading: State boolean untuk menunjukkan apakah data `allProducts` sedang dimuat.
  //      Defaultnya `true` karena fetching dimulai segera.

  // State untuk pesan error (saat fetching `allProducts`)
  const [searchError, setSearchError] = useState<string | null>(null);
  //    - searchError: State untuk menyimpan pesan error jika fetching data gagal. Defaultnya `null`.

  // 6. Efek Samping: Fetching Semua Produk (useEffect)
  useEffect(() => {
    // - Hook `useEffect` digunakan untuk menjalankan efek samping (side effects)
    //   setelah render pertama kali dan setiap kali dependensi berubah.
    //   Di sini, efeknya adalah memanggil API untuk mendapatkan semua produk.

    const fetchAllProductsData = async () => {
      // Fungsi asinkron untuk mengambil data produk dari API.
      try {
        setSearchLoading(true); // Set loading ke true sebelum fetching dimulai
        const data = await api.getAllProducts(); // Panggil fungsi API untuk mendapatkan semua produk
        setAllProducts(data); // Simpan data produk yang berhasil diambil ke state `allProducts`
        setSearchError(null); // Pastikan tidak ada error jika fetching berhasil
      } catch (err) {
        // Tangani error jika fetching gagal
        if (err instanceof Error) {
          // Jika error adalah instance dari Error, ambil pesannya
          setSearchError(err.message);
        } else {
          // Jika error tidak dikenal, berikan pesan default
          setSearchError("An unknown error occurred during product fetch.");
        }
      } finally {
        // Pastikan loading menjadi false setelah fetching selesai, terlepas dari hasilnya
        setSearchLoading(false);
      }
    };

    fetchAllProductsData(); // Panggil fungsi fetching segera setelah komponen mount
  }, []); // Array dependensi kosong `[]` berarti `useEffect` ini hanya akan berjalan sekali
  // setelah komponen `SearchProvider` pertama kali di-mount (mirip `componentDidMount`).

  // 7. Memoized Calculation: Filtering Produk (useMemo)
  const filteredProducts = useMemo(() => {
    // - Hook `useMemo` digunakan untuk mengoptimasi perhitungan. Fungsi di dalamnya hanya
    //   akan dijalankan ulang jika ada perubahan pada dependensi yang ditentukan.
    // - Ini penting karena proses filtering bisa jadi berat jika `allProducts` sangat besar.
    //   Kita tidak ingin filter dijalankan setiap kali komponen render, hanya jika `allProducts`
    //   atau `searchTerm` berubah.

    if (!searchTerm) {
      // Jika `searchTerm` kosong (tidak ada input pencarian),
      return allProducts; // kembalikan semua produk mentah.
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    // Ubah `searchTerm` menjadi huruf kecil untuk pencarian yang tidak peka huruf besar/kecil.

    return allProducts.filter(
      (product) =>
        // Gunakan metode `filter` pada array `allProducts`.
        // Untuk setiap `product`, cek apakah judul, deskripsi, atau kategori produk
        // mengandung `lowerCaseSearchTerm`.
        product.title.toLowerCase().includes(lowerCaseSearchTerm) || product.description.toLowerCase().includes(lowerCaseSearchTerm) || product.category.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [allProducts, searchTerm]); // Array dependensi `[allProducts, searchTerm]` berarti
  // `filteredProducts` akan dihitung ulang hanya jika
  // `allProducts` (data produk mentah) atau `searchTerm` berubah.

  // 8. Nilai Konteks yang Disediakan
  const contextValue = {
    // Ini adalah objek yang akan menjadi `value` dari `SearchContext.Provider`.
    // Properti-properti ini harus sesuai dengan `SearchContextType` yang didefinisikan di atas.

    searchTerm, // Menyediakan `searchTerm`
    setSearchTerm, // Menyediakan fungsi untuk mengubah `searchTerm`
    filteredProducts, // Menyediakan hasil produk yang sudah difilter
    searchLoading, // Menyediakan status loading
    searchError, // Menyediakan status error
  };

  // 9. Merender Provider Konteks
  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
  //    - SearchContext.Provider: Komponen ini "membungkus" komponen `children`.
  //    - value={contextValue}: Semua komponen anak yang dibungkus oleh provider ini
  //      (dan juga cucu, cicit, dst.) dapat mengakses `contextValue` ini
  //      menggunakan hook `useContext(SearchContext)` atau `useSearch()`.
}; // Akhir dari komponen SearchProvider

// 10. Custom Hook untuk Penggunaan Konteks (useSearch)
export const useSearch = () => {
  // - Ini adalah custom hook yang berfungsi sebagai shortcut yang rapi untuk `useContext`.
  //   Daripada memanggil `useContext(SearchContext)` dan menangani `undefined` setiap kali,
  //   kita bisa memanggil `useSearch()`.

  const context = useContext(SearchContext);
  //    - Menggunakan `useContext` untuk mengambil nilai dari `SearchContext`.

  if (context === undefined) {
    // - Ini adalah pengecekan penting untuk error handling.
    //   Jika `useSearch` dipanggil dari komponen yang tidak berada di dalam `SearchProvider` (misalnya di luar `App.tsx`),
    //   maka `context` akan `undefined`.
    throw new Error("useSearch must be used within a SearchProvider");
    //    - Dalam kasus ini, kita melempar error yang jelas agar developer tahu masalahnya.
  }
  return context; // Mengembalikan nilai konteks (objek SearchContextType).
};
