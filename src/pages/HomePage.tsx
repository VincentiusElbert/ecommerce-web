// src/pages/HomePage.tsx

// 1. Import library dan tipe yang dibutuhkan
import React, { useState, useEffect, useMemo } from "react";
//    - React: Library utama React.
//    - useState: Hook untuk mengelola state lokal komponen (misal: `products`, `loading`).
//    - useEffect: Hook untuk efek samping, seperti fetching data dari API.
//    - useMemo: Hook untuk mengoptimasi kinerja, mencegah perhitungan ulang yang tidak perlu
//               (digunakan untuk memfilter produk).

import { type Product } from "../types/product";
//    - type Product: Mengimpor definisi tipe `Product` dari `types/product.ts`.
//      Ini memastikan kita bekerja dengan struktur data produk yang konsisten dan type-safe.

import { api } from "../services/api";
//    - api: Mengimpor objek `api` dari `services/api.ts`. Objek ini berisi semua fungsi
//      untuk berinteraksi dengan API eksternal (misalnya `api.getAllProducts()`).

import ProductCard from "../components/ProductCard";
//    - ProductCard: Mengimpor komponen `ProductCard` yang sudah kita buat. Ini digunakan untuk
//      merender setiap produk dalam daftar.

import Button from "../components/ui/Button";
//    - Button: Mengimpor komponen `Button` yang sudah kita buat (diasumsikan berada di `ui` folder).

import { useSearch } from "../context/SearchContext";
//    - useSearch: Mengimpor custom hook `useSearch` dari `SearchContext.tsx`.
//      Hook ini akan memberikan akses ke `searchTerm` dari konteks global, yang akan
//      digunakan untuk memfilter produk di halaman ini.

// 2. Komponen Fungsional HomePage
const HomePage: React.FC = () => {
  // - Ini adalah komponen React fungsional yang akan merender halaman utama toko online.

  // Menggunakan useSearch hook untuk mendapatkan searchTerm dari konteks global
  const { searchTerm } = useSearch();
  //    - searchTerm: Mengambil nilai kata kunci pencarian yang sedang aktif dari `SearchContext`.
  //      HomePage akan 'mendengarkan' perubahan pada `searchTerm` ini secara otomatis.

  // 3. State Lokal Komponen
  const [products, setProducts] = useState<Product[]>([]);
  //    - products: State yang akan menyimpan *semua* produk yang diambil dari API. Ini adalah
  //      data mentah sebelum difilter oleh pencarian. Defaultnya array kosong.

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  //    - featuredProducts: State untuk menyimpan produk-produk unggulan (misalnya 3 produk teratas)
  //      yang akan ditampilkan di bagian banner/hero section. Defaultnya array kosong.

  const [loading, setLoading] = useState<boolean>(true);
  //    - loading: State boolean untuk menunjukkan apakah data `products` sedang dimuat dari API.
  //      Defaultnya `true` karena fetching dimulai segera.

  const [error, setError] = useState<string | null>(null);
  //    - error: State untuk menyimpan pesan error jika fetching data gagal. Defaultnya `null`.

  // 4. Efek Samping: Fetching Semua Produk (useEffect)
  useEffect(() => {
    // - Hook `useEffect` digunakan untuk menjalankan efek samping setelah render komponen.
    //   Di sini, efeknya adalah memanggil API untuk mendapatkan semua produk saat komponen pertama kali di-mount.

    const fetchProducts = async () => {
      // Fungsi asinkron untuk mengambil data produk dari API.
      try {
        setLoading(true); // Set loading ke true sebelum fetching dimulai
        const allProducts = await api.getAllProducts(); // Panggil fungsi API untuk mendapatkan semua produk
        setProducts(allProducts); // Simpan data produk yang berhasil diambil ke state `products`

        // Filter atau ambil 3 produk terbaik untuk banner (misal berdasarkan rating tertinggi)
        // Kita sorting dari `allProducts` yang baru saja diambil.
        const sortedProducts = [...allProducts].sort((a, b) => b.rating.rate - a.rating.rate);
        //    - [...allProducts]: Membuat salinan array agar tidak mengubah array `allProducts` asli saat sorting.
        //    - .sort((a, b) => b.rating.rate - a.rating.rate): Mengurutkan produk dari rating tertinggi ke terendah.
        setFeaturedProducts(sortedProducts.slice(0, 3)); // Ambil 3 produk pertama dari hasil sort untuk banner.
      } catch (err) {
        // Tangani error jika fetching gagal
        if (err instanceof Error) {
          setError(err.message); // Jika error adalah instance dari Error, ambil pesannya
        } else {
          setError("An unknown error occurred"); // Jika error tidak dikenal, berikan pesan default
        }
      } finally {
        // Pastikan loading menjadi false setelah fetching selesai, terlepas dari hasilnya
        setLoading(false);
      }
    };

    fetchProducts(); // Panggil fungsi fetching segera setelah komponen mount
  }, []); // Array dependensi kosong `[]` berarti `useEffect` ini hanya akan berjalan sekali
  // setelah komponen `HomePage` pertama kali di-mount (mirip `componentDidMount`).

  // 5. Memoized Calculation: Filtering Produk (useMemo)
  const filteredProducts = useMemo(() => {
    // - Hook `useMemo` digunakan untuk mengoptimasi perhitungan daftar produk yang ditampilkan.
    //   Fungsi di dalamnya hanya akan dijalankan ulang jika ada perubahan pada dependensi yang ditentukan.
    //   Ini penting untuk kinerja, agar proses filtering tidak diulang setiap kali komponen `HomePage` render ulang
    //   (misalnya karena state lain berubah), kecuali jika `products` atau `searchTerm` berubah.

    if (!searchTerm) {
      // Jika `searchTerm` kosong (tidak ada input pencarian),
      return products; // kembalikan semua produk mentah yang sudah diambil dari API.
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    // Ubah `searchTerm` menjadi huruf kecil untuk pencarian yang tidak peka huruf besar/kecil.

    return products.filter(
      (product) =>
        // Gunakan metode `filter` pada array `products`.
        // Untuk setiap `product`, cek apakah judul, deskripsi, atau kategori produk
        // mengandung `lowerCaseSearchTerm`.
        product.title.toLowerCase().includes(lowerCaseSearchTerm) || product.description.toLowerCase().includes(lowerCaseSearchTerm) || product.category.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [products, searchTerm]); // Array dependensi `[products, searchTerm]` berarti
  // `filteredProducts` akan dihitung ulang hanya jika
  // `products` (data produk mentah) atau `searchTerm` (dari `SearchContext`) berubah.

  // 6. Conditional Rendering: Loading, Error, atau Konten
  if (loading) {
    // Jika `loading` true, tampilkan pesan loading
    return <div className="flex justify-center items-center h-64 text-xl text-gray-600">Loading products...</div>;
  }

  if (error) {
    // Jika ada `error`, tampilkan pesan error
    return <div className="flex justify-center items-center h-64 text-xl text-red-600">Error: {error}</div>;
  }

  // Jika tidak loading dan tidak ada error, render konten utama halaman
  return (
    <div className="py-8">
      {/* --- Bagian Banner/Hero Section (Promo Ramadhan) --- */}
      {/* Ini adalah bagian visual yang menarik di bagian atas halaman, menampilkan promo dan produk unggulan. */}
      {/* Kelas Tailwind seperti `bg-gradient-to-br`, `rounded-xl`, `shadow-2xl` untuk desain estetik. */}
      {/* `relative` dan `z-` untuk penempatan layer elemen. */}
      {/* `flex flex-col md:flex-row` untuk responsivitas (kolom di mobile, baris di desktop). */}
      <div className="relative bg-gradient-to-br from-blue-500 to-neutral-700 rounded-xl p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden">
        {/* Overlay dekoratif (misal pattern dots, atau efek transparansi) */}
        <div className="absolute inset-0 bg-pattern-dots opacity-20 z-0"></div> {/* `bg-pattern-dots` perlu didefinisikan di `tailwind.config.js` */}
        <div className="absolute inset-0 bg-black opacity-10 z-0"></div> {/* Lapisan hitam transparan tipis */}
        {/* Konten Teks Promo (Judul, Deskripsi, Diskon, Tombol) */}
        <div className="relative z-10 text-center md:text-left mb-8 md:mb-0 md:w-1/2">
          {/* Judul Promo */}
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg animate-fade-in-down">PROMO RAMADHAN</h2>
          {/* Deskripsi Promo */}
          <p className="text-lg md:text-2xl opacity-95 mb-6 drop-shadow-md animate-fade-in">Dapatkan diskon menarik di bulan penuh berkah!</p>
          {/* Badge Diskon dan Voucher */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mt-6">
            <div className="bg-yellow-400 text-purple-900 rounded-full px-5 py-2 font-bold text-lg shadow-xl animate-scale-up">Discount 20%</div>
            <div className="bg-yellow-400 text-purple-900 rounded-full px-5 py-2 font-bold text-lg shadow-xl animate-scale-up delay-150">Voucher Shopping 💰1000</div>
          </div>
          {/* Tombol Aksi Promo */}
          <Button variant="primary" className="mt-8 px-8 py-3 text-xl shadow-lg hover:shadow-xl animate-fade-in-up delay-300">
            Klaim Sekarang & Free Shipping!
          </Button>
        </div>
        {/* Produk Unggulan di Sisi Kanan Banner */}
        {/* Menampilkan produk pertama dari `featuredProducts` yang diurutkan berdasarkan rating */}
        <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-full h-auto max-w-sm md:max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg overflow-hidden border border-white/20">
            {featuredProducts.length > 0 ? (
              // Jika ada produk unggulan, tampilkan detail produk pertama
              <>
                <img src={featuredProducts[0].image} alt={featuredProducts[0].title} className="max-h-52 w-full object-contain mx-auto mb-4 drop-shadow-xl animate-fade-in-right" />
                <h3 className="text-lg font-bold line-clamp-2 text-white text-center mb-2 animate-fade-in-right delay-100">{featuredProducts[0].title}</h3>
                <p className="text-2xl font-extrabold text-yellow-300 text-center animate-fade-in-right delay-200">${featuredProducts[0].price.toFixed(2)}</p>
                <span className="absolute top-2 right-2 bg-red-500 text-white text-md font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg transform rotate-3 shadow-md">BEST DEAL!</span>
              </>
            ) : (
              // Jika tidak ada produk unggulan
              <div className="text-center text-white">No featured products available.</div>
            )}
          </div>
        </div>
      </div>
      {/* --- Akhir Bagian Banner/Hero Section --- */}

      {/* Judul Produk / Hasil Pencarian */}
      {/* Judul ini dinamis, akan berubah jika ada pencarian aktif */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-left px-4">{searchTerm ? `Search Results for "${searchTerm}"` : "Featured Products"}</h2>

      {/* Grid untuk menampilkan Produk */}
      {/* Conditional rendering untuk pesan "no products found" */}
      {filteredProducts.length === 0 && searchTerm ? (
        // Jika tidak ada produk yang cocok dengan pencarian
        <div className="flex justify-center items-center h-48 text-xl text-gray-500">No products found for "{searchTerm}".</div>
      ) : (
        // Jika ada produk yang cocok atau tidak ada pencarian, tampilkan grid produk
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

export default HomePage; // Mengekspor komponen HomePage.
