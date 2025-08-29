// src/components/Header/CategoryDropdown.tsx

// 1. Import library, hook, aset, dan tipe yang dibutuhkan
import React, { useState, useRef, useEffect } from "react";
//    - React: Library utama React.
//    - useState: Hook untuk mengelola state lokal komponen (misal: `isOpen` untuk dropdown).
//    - useRef: Hook untuk membuat referensi ke elemen DOM (digunakan untuk mendeteksi klik di luar dropdown).
//    - useEffect: Hook untuk efek samping, seperti menambahkan dan membersihkan event listener.

import { useNavigate } from "react-router-dom";
//    - useNavigate: Hook dari React Router DOM untuk melakukan navigasi programatis (mengubah URL).

import { type Category } from "../../types/product";
//    - type Category: Mengimpor definisi tipe `Category` (yang adalah `string`) dari `types/product.ts`.

import CategoryIcon from "../../assets/icon/category.svg";
//    - CategoryIcon: Mengimpor aset SVG untuk ikon kategori. Pastikan jalur (`path`) ini benar
//      sesuai lokasi file `category.svg` di proyekmu.

import { useCategoryFilter } from "../../context/CategoryFilterContext";
//    - useCategoryFilter: Mengimpor custom hook `useCategoryFilter` dari `CategoryFilterContext.tsx`.
//      Hook ini akan memberikan akses ke `selectedCategory` dan `setSelectedCategory` dari konteks global.

// 2. Definisikan Props untuk Komponen CategoryDropdown (CategoryDropdownProps)
interface CategoryDropdownProps {
  categories: Category[];
  //    - categories: Properti yang wajib. Ini adalah array dari semua kategori yang akan ditampilkan
  //      dalam dropdown. Data ini diambil dari API di komponen `Header` dan diteruskan ke sini.
}

// 3. Komponen Fungsional CategoryDropdown
const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories }) => {
  // - Ini adalah komponen React fungsional yang merender tombol dropdown kategori.

  // State untuk mengelola apakah dropdown terbuka atau tertutup
  const [isOpen, setIsOpen] = useState(false);
  //    - isOpen: Boolean untuk mengontrol visibilitas dropdown menu. Defaultnya `false` (tertutup).

  // Ref untuk elemen DOM dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  //    - dropdownRef: Membuat ref yang akan dilekatkan ke elemen `div` pembungkus utama dropdown.
  //      Ini memungkinkan kita untuk mengakses elemen DOM tersebut secara langsung, yang penting
  //      untuk mendeteksi klik di luar area dropdown.

  // Menggunakan hook dari konteks untuk manajemen filter kategori
  const { setSelectedCategory } = useCategoryFilter();
  //    - setSelectedCategory: Mengambil fungsi ini dari `useCategoryFilter` hook.
  //      Fungsi ini akan digunakan untuk memperbarui kategori yang dipilih di `CategoryFilterContext`.

  // Menggunakan hook dari React Router DOM untuk navigasi
  const navigate = useNavigate();
  //    - navigate: Mendapatkan fungsi `Maps` dari `useNavigate`. Fungsi ini akan digunakan
  //      untuk mengubah URL secara programatis (misalnya, saat user memilih kategori, kita navigasi
  //      ke halaman `/products/category/nama-kategori`).

  // 4. Fungsi Handler untuk Tombol Toggle Dropdown
  const handleToggle = () => setIsOpen(!isOpen);
  //    - Fungsi sederhana yang membalik nilai `isOpen`. Jika `isOpen` true jadi false, dan sebaliknya.
  //      Ini akan membuka atau menutup dropdown.

  // 5. Fungsi Handler untuk Klik Item Kategori
  const handleCategoryClick = (category: Category) => {
    //    - category: Menerima `Category` (nama kategori) yang diklik oleh pengguna.
    setSelectedCategory(category); // Update kategori terpilih di konteks
    //    - Memanggil `setSelectedCategory` dari `CategoryFilterContext` untuk mengatur kategori yang sedang aktif
    //      secara global di aplikasi.
    navigate(`/products/category/${category}`); // Navigasi ke halaman kategori
    //    - Menggunakan `Maps` untuk mengubah URL ke rute detail kategori yang sesuai.
    //      Misalnya, jika `category` adalah "electronics", URL akan menjadi `/products/category/electronics`.
    setIsOpen(false); // Tutup dropdown
    //    - Setelah kategori dipilih dan navigasi terjadi, dropdown akan ditutup.
  };

  // 6. Efek Samping: Mendeteksi Klik di Luar Dropdown (useEffect)
  useEffect(() => {
    // - Hook `useEffect` digunakan untuk menjalankan efek samping. Di sini, efeknya adalah
    //   menambahkan dan membersihkan event listener untuk mendeteksi klik di luar dropdown.

    const handleClickOutside = (event: MouseEvent) => {
      // Fungsi ini akan dipanggil setiap kali ada klik di mana saja di dokumen.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        //    - dropdownRef.current: Mengakses elemen DOM yang diacu oleh ref.
        //    - !dropdownRef.current.contains(event.target as Node): Memeriksa apakah elemen yang diklik (`event.target`)
        //      BUKAN bagian dari dropdown (yaitu, klik terjadi di luar dropdown).
        setIsOpen(false); // Jika klik di luar, tutup dropdown.
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    //    - Menambahkan event listener `mousedown` ke seluruh dokumen. Ini akan mendengarkan
    //      setiap kali tombol mouse ditekan.

    return () => {
      // Ini adalah fungsi 'cleanup' yang akan dijalankan saat komponen di-unmount
      // atau sebelum `useEffect` dijalankan kembali (misalnya, jika dependensi berubah).
      document.removeEventListener("mousedown", handleClickOutside);
      //    - Sangat penting untuk menghapus event listener ini untuk mencegah memory leaks
      //      dan perilaku yang tidak diinginkan.
    };
  }, []); // Array dependensi kosong `[]` berarti `useEffect` ini hanya akan berjalan sekali
  // setelah komponen pertama kali di-mount (mirip `componentDidMount` dan `componentWillUnmount` digabung).

  // 7. Struktur JSX untuk Rendering CategoryDropdown
  return (
    // Pembungkus utama dropdown dengan ref
    <div className="relative" ref={dropdownRef}>
      {/* Tombol yang memicu buka/tutup dropdown */}
      <button
        onClick={handleToggle} // Memanggil `handleToggle` saat tombol diklik
        className="flex items-center gap-2 px-4 py-2 border-2 border-neutral-300 rounded-full h-11 text-gray-800 bg-white hover:bg-neutral-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {/* Ikon Kategori */}
        <img src={CategoryIcon} alt="Category Icon" className="w-5 h-5" />
        {/* Teks "Category" */}
        <span className="text-sm font-semibold">Category</span>
        {/* Ikon Panah (berputar saat dropdown terbuka) */}
        <svg className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {/* Dropdown Menu (kondisional rendering dan animasi) */}
      <div
        className={`absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 transform transition-all duration-300 ease-out 
          ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
      >
        {/* `absolute`: Posisinya relatif terhadap parent `div` yang `relative`. */}
        {/* `left-0 mt-2`: Posisikan di kiri bawah tombol, dengan margin atas. */}
        {/* `w-48`: Lebar tetap untuk dropdown. */}
        {/* `bg-white rounded-lg shadow-lg`: Gaya visual dropdown (putih, sudut, bayangan). */}
        {/* `z-20`: Menjamin dropdown muncul di atas elemen lain. */}
        {/* `transform transition-all duration-300 ease-out`: Kelas untuk animasi halus. */}
        {/* `isOpen ? ... : ...`: Kondisi untuk animasi:
            - `opacity-100 scale-100`: Jika terbuka, tampilkan penuh dan ukuran normal.
            - `opacity-0 scale-95 pointer-events-none`: Jika tertutup, sembunyikan, sedikit kecilkan,
              dan `pointer-events-none` agar tidak bisa diklik saat tersembunyi. */}

        <div className="py-1">
          {categories.length > 0 ? (
            // Jika ada kategori, lakukan iterasi dan tampilkan sebagai tombol
            categories.map((category) => (
              <button // Menggunakan <button> karena kita memanggil fungsi onClick kustom
                key={category} // `key` penting untuk kinerja daftar React
                onClick={() => handleCategoryClick(category)} // Panggil fungsi saat tombol kategori diklik
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-neutral-100 hover:text-blue-600 capitalize text-sm transition-colors duration-150"
              >
                {/* Menampilkan nama kategori, mengganti hyphen (-) dengan spasi */}
                {category.replace(/-/g, " ")}
              </button>
            ))
          ) : (
            // Jika tidak ada kategori yang diterima
            <p className="px-4 py-2 text-gray-500 text-sm">No categories found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown; // Mengekspor komponen CategoryDropdown.
