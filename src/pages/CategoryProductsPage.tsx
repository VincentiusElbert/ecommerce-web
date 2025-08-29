// src/pages/CategoryProductsPage.tsx

// 1. Import library, hook, dan tipe yang dibutuhkan
import React, { useState, useEffect, useMemo } from "react";
//    - React: Library utama React.
//    - useState: Hook untuk mengelola state lokal komponen (misal: `allProducts`, `loading`).
//    - useEffect: Hook untuk efek samping, seperti fetching data dari API.
//    - useMemo: Hook untuk mengoptimasi kinerja, mencegah perhitungan ulang yang tidak perlu
//               (digunakan untuk memfilter produk).

import { useParams, Link } from "react-router-dom";
//    - useParams: Hook dari React Router DOM untuk mengambil parameter dari URL (misal: `categoryName`).
//    - Link: Komponen dari React Router DOM untuk navigasi (digunakan di breadcrumbs).

import { type Product } from "../types/product";
//    - type Product: Mengimpor definisi tipe `Product` dari `types/product.ts`.

import { api } from "../services/api";
//    - api: Mengimpor objek `api` dari `services/api.ts` untuk interaksi dengan API.

import ProductCard from "../components/ProductCard";
//    - ProductCard: Mengimpor komponen `ProductCard` untuk merender setiap produk.

import { useSearch } from "../context/SearchContext";
//    - useSearch: Mengimpor custom hook `useSearch` dari `SearchContext.tsx`.
//      Digunakan untuk mendapatkan `searchTerm` dari konteks global.

import { useCategoryFilter } from "../context/CategoryFilterContext";
//    - useCategoryFilter: Mengimpor custom hook `useCategoryFilter` dari `CategoryFilterContext.tsx`.
//      Digunakan untuk mendapatkan `selectedCategory` dan `setSelectedCategory` dari konteks global.

// 2. Komponen Fungsional CategoryProductsPage
const CategoryProductsPage: React.FC = () => {
  // - Ini adalah komponen React fungsional yang merender halaman produk berdasarkan kategori.

  // Mengambil parameter `categoryName` dari URL
  const { categoryName } = useParams<{ categoryName: string }>();
  //    - `categoryName`: Akan berisi nilai dari bagian URL `/products/category/`**`nama-kategori`**.
  //      Contoh: Jika URL adalah `/products/category/electronics`, maka `categoryName` akan menjadi "electronics".

  // Mengambil `searchTerm` dari SearchContext
  const { searchTerm } = useSearch();

  // Mengambil `selectedCategory` dan `setSelectedCategory` dari CategoryFilterContext
  const { selectedCategory, setSelectedCategory } = useCategoryFilter();

  // 3. State Lokal Komponen
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  //    - allProducts: State yang akan menyimpan *semua* produk yang diambil dari API. Kita perlu
  //      mengambil semua produk terlebih dahulu karena Fakestore API tidak memiliki endpoint
  //      langsung untuk `getProductsByCategory`.

  const [loading, setLoading] = useState<boolean>(true);
  //    - loading: State boolean untuk menunjukkan apakah data produk sedang dimuat.

  const [error, setError] = useState<string | null>(null);
  //    - error: State untuk menyimpan pesan error jika fetching data gagal.

  // 4. Efek Samping: Sinkronisasi URL dengan Konteks Kategori (useEffect)
  useEffect(() => {
    // - `useEffect` ini berfungsi untuk memastikan `selectedCategory` di konteks global
    //   selalu sinkron dengan `categoryName` yang ada di URL.
    // - Penting jika pengguna langsung mengetik URL kategori di browser atau menggunakan breadcrumbs,
    //   bukan dari dropdown.

    if (categoryName && categoryName !== selectedCategory) {
      //    - Jika `categoryName` dari URL ada DAN berbeda dari `selectedCategory` di konteks,
      setSelectedCategory(categoryName); // maka update `selectedCategory` di konteks.
    }
  }, [categoryName, selectedCategory, setSelectedCategory]); // Dependensi: `categoryName` dari URL,
  // `selectedCategory` dari state, dan `setSelectedCategory` (fungsi dari konteks).

  // 5. Efek Samping: Fetching Semua Produk (useEffect)
  useEffect(() => {
    // - `useEffect` ini bertanggung jawab untuk mengambil semua data produk dari API.
    //   Ini akan dijalankan setiap kali `categoryName` dari URL berubah, memastikan
    //   data produk mentah selalu tersedia untuk difilter.

    const fetchProducts = async () => {
      try {
        setLoading(true); // Mulai loading
        setError(null); // Reset error
        // Karena Fakestore API tidak punya endpoint khusus `getProductsByCategory`,
        // kita ambil semua produk dulu. Jika ada API yang support, bisa pakai itu.
        const allFetchedProducts = await api.getAllProducts();
        setAllProducts(allFetchedProducts); // Simpan semua produk yang diambil
      } catch (err) {
        // Tangani error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching products.");
        }
      } finally {
        setLoading(false); // Selesai loading
      }
    };

    fetchProducts(); // Panggil fungsi fetching
  }, [categoryName]); // Dependensi: `categoryName`. Re-fetch jika kategori URL berubah.

  // 6. Memoized Calculation: Filtering Produk Ganda (useMemo)
  const filteredProducts = useMemo(() => {
    // - `useMemo` ini adalah inti dari fungsionalitas halaman ini. Dia melakukan
    //   filtering produk dalam DUA TAHAP: pertama berdasarkan kategori dari URL,
    //   kedua berdasarkan `searchTerm` dari konteks global.
    // - Perhitungan ini hanya akan dijalankan ulang jika `allProducts`, `categoryName`,
    //   atau `searchTerm` berubah, untuk optimasi kinerja.

    let productsToDisplay = allProducts; // Mulai dengan semua produk yang sudah diambil.

    // Tahap 1: Filter berdasarkan kategori dari URL parameter
    if (categoryName) {
      productsToDisplay = productsToDisplay.filter((product) => product.category === categoryName);
      //    - Jika `categoryName` ada, filter produk yang kategori-nya cocok dengan `categoryName` dari URL.
    }

    // Tahap 2: Kemudian filter berdasarkan `searchTerm` dari `SearchContext`
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      productsToDisplay = productsToDisplay.filter(
        (product) => product.title.toLowerCase().includes(lowerCaseSearchTerm) || product.description.toLowerCase().includes(lowerCaseSearchTerm) || product.category.toLowerCase().includes(lowerCaseSearchTerm)
      );
      //    - Jika `searchTerm` ada, filter lagi hasil dari Tahap 1 berdasarkan `searchTerm`
      //      (mencocokkan judul, deskripsi, atau kategori).
    }

    return productsToDisplay; // Mengembalikan array produk yang sudah difilter ganda.
  }, [allProducts, categoryName, searchTerm]); // Dependensi: perubahan pada data produk mentah,
  // kategori dari URL, atau kata kunci pencarian.

  // 7. Conditional Rendering: Loading, Error, atau Konten
  if (loading) {
    // Jika `loading` true, tampilkan pesan loading
    return <div className="flex justify-center items-center h-64 text-xl text-gray-600">Loading category products...</div>;
  }

  if (error) {
    // Jika ada `error`, tampilkan pesan error
    return <div className="flex justify-center items-center h-64 text-xl text-red-600">Error: {error}</div>;
  }

  // Jika tidak loading dan tidak ada error, render konten utama halaman
  return (
    <div className="py-8">
      {/* Breadcrumbs */}
      {/* Menunjukkan jalur navigasi: Home > Products > Nama Kategori */}
      <nav className="text-sm text-gray-600 mb-6 px-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /
        <Link to="/products" className="hover:underline ml-1">
          Products
        </Link>{" "}
        /<span className="ml-1 font-semibold text-gray-800 capitalize line-clamp-1">{categoryName?.replace(/-/g, " ")}</span>
        {/* `categoryName?.replace(/-/g, " ")`: Menampilkan nama kategori dengan spasi, dan `capitalize` dari Tailwind */}
      </nav>

      {/* Judul Halaman Produk Kategori */}
      {/* Judul ini dinamis, akan berubah jika ada pencarian aktif di dalam kategori ini */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-left px-4 capitalize">
        {searchTerm ? `Search results in "${categoryName?.replace(/-/g, " ")}"` : `${categoryName?.replace(/-/g, " ")}`}
        {/* Jika ada `searchTerm`, judulnya "Search results in 'Kategori'" */}
        {/* Jika tidak, judulnya hanya "Nama Kategori" */}
      </h2>

      {/* Grid untuk menampilkan Produk */}
      {/* Conditional rendering untuk pesan "no products found" */}
      {filteredProducts.length === 0 ? (
        // Jika tidak ada produk yang cocok (setelah filter kategori dan search)
        <div className="flex justify-center items-center h-48 text-xl text-gray-500">No products found in this category matching your search.</div>
      ) : (
        // Jika ada produk yang cocok, tampilkan grid produk
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6 px-4">
          {/* Melakukan iterasi pada `filteredProducts` dan merender `ProductCard` untuk setiap produk */}
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProductsPage; // Mengekspor komponen CategoryProductsPage.
