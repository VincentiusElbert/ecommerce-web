// src/components/Header/SearchBar.tsx

// 1. Import library dan aset yang dibutuhkan
import React from "react";
//    - React: Library utama React.

import SearchIcon from "../../assets/icon/search.svg";
//    - SearchIcon: Mengimpor aset SVG untuk ikon pencarian. Pastikan jalur (`path`) ini benar
//      sesuai lokasi file `search.svg` di proyekmu.

import { useSearch } from "../../context/SearchContext";
//    - useSearch: Mengimpor custom hook `useSearch` dari `SearchContext.tsx`.
//      Hook ini akan memberikan akses ke `searchTerm` dan `setSearchTerm` dari konteks global.

// 2. Definisikan Props untuk Komponen SearchBar (SearchBarProps)
interface SearchBarProps {
  // onSearch?: (searchTerm: string) => void; // <= Baris ini sudah dikomentari/dihapus.
  //    - Ini adalah catatan penting: kita tidak lagi membutuhkan prop `onSearch` di sini.
  //      Kenapa? Karena `SearchBar` sekarang akan langsung berkomunikasi dengan `SearchContext`
  //      untuk memperbarui `searchTerm` secara global, bukan lagi mengandalkan fungsi dari parent
  //      (misalnya dari `Header.tsx`). Ini menyederhanakan `SearchBar` itu sendiri.

  className?: string;
  //    - className: Properti `string` opsional yang memungkinkan kita menambahkan kelas CSS tambahan
  //      (misalnya kelas Tailwind untuk ukuran atau posisi) dari komponen parent yang menggunakan `SearchBar`.
}

// 3. Komponen Fungsional SearchBar
const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  // - Ini adalah komponen React fungsional yang akan merender input field untuk pencarian.
  //   Dia menerima `className` dari props.

  const { searchTerm, setSearchTerm } = useSearch();
  //    - useSearch(): Memanggil custom hook `useSearch` untuk mendapatkan `searchTerm` (nilai pencarian saat ini)
  //      dan `setSearchTerm` (fungsi untuk memperbarui nilai pencarian) dari `SearchContext`.
  //      Ini adalah 'jembatan' antara komponen UI ini dan state global.

  // 4. Fungsi Handler untuk Perubahan Input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //    - e: Objek event dari perubahan input HTML.
    //    - React.ChangeEvent<HTMLInputElement>: Tipe event untuk perubahan pada input HTML.

    setSearchTerm(e.target.value);
    //    - e.target.value: Mengambil nilai terbaru dari input field.
    //    - setSearchTerm(): Memanggil fungsi `setSearchTerm` yang didapat dari `useSearch` hook.
    //      Ini akan memperbarui `searchTerm` di dalam `SearchContext`,
    //      yang kemudian akan diakses oleh komponen lain (misalnya `HomePage`)
    //      untuk memicu filter produk. Ini adalah inti dari komunikasi global.
  };

  // 5. Struktur JSX untuk Rendering SearchBar
  return (
    <div className={`relative ${className}`}>
      {/* - `div` ini adalah pembungkus utama untuk input dan ikon. */}
      {/* - `relative`: Penting agar elemen `span` (ikon) di dalamnya bisa diposisikan secara `absolute`. */}
      {/* - `${className}`: Memasukkan kelas CSS tambahan yang diterima dari props. */}

      <input
        type="text" // Tipe input adalah teks.
        placeholder="Search" // Teks placeholder yang muncul saat input kosong.
        // Gunakan value dari context agar input controlled component
        value={searchTerm}
        //    - value={searchTerm}: Ini menjadikan input field sebagai 'controlled component'.
        //      Artinya, nilai input selalu diambil dan diatur oleh state `searchTerm` dari `SearchContext`.
        //      Ini memastikan UI selalu sinkron dengan state global.
        // Kelas Tailwind yang disesuaikan
        className="w-full p-2 pl-10 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-neutral-300 placeholder-gray-500"
        //    - w-full: Lebar 100% dari parent.
        //    - p-2: Padding di dalam input.
        //    - pl-10: Padding kiri yang lebih besar untuk memberi ruang ikon.
        //    - rounded-full: Bentuk kapsul/pill-shaped.
        //    - bg-white: Latar belakang putih.
        //    - text-gray-800: Warna teks yang diketik pengguna.
        //    - focus:outline-none focus:ring-2 focus:ring-blue-500: Gaya saat input dalam keadaan fokus (klik/tab).
        //      Menghilangkan outline default dan menambahkan ring biru.
        //    - border-2 border-neutral-300: Border abu-abu tipis.
        //    - placeholder-gray-500: Warna teks placeholder.
        onChange={handleInputChange}
        //    - onChange={handleInputChange}: Ketika nilai input berubah (misal, user mengetik),
        //      fungsi `handleInputChange` akan dipanggil.
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {/* - `span` ini adalah pembungkus untuk ikon pencarian. */}
        {/* - `absolute`: Posisinya diatur relatif terhadap `div` parent yang `relative`. */}
        {/* - `left-3`: Jarak 12px dari kiri. */}
        {/* - `top-1/2 -translate-y-1/2`: Menengahkan ikon secara vertikal di dalam input field. */}
        {/* - `text-gray-400`: Warna ikon. */}
        <img src={SearchIcon} alt="Search Icon" className="h-5 w-5" />
        {/* - `img`: Menampilkan ikon pencarian. */}
        {/* - `h-5 w-5`: Mengatur ukuran ikon menjadi 20x20 piksel. */}
      </span>
    </div>
  );
};

export default SearchBar; // Mengekspor komponen SearchBar untuk digunakan di komponen lain.
