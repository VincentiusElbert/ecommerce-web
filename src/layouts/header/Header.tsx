// src/layouts/header/Header.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link dari react-router-dom
import SearchBar from "../../layouts/header/SearchBar"; // Pastikan path benar
import CategoryDropdown from "../../layouts/header/CategoryDropdown"; // Pastikan path benar
import AuthButtons from "../../layouts/header/AuthButtons"; // Pastikan path benar
import MobileMenu from "../../layouts/header/MobileMenu"; // Pastikan path benar
import { type Category } from "../../types/product"; // Pastikan path benar
import Logo from "../../assets/icon/logo.svg"; // Pastikan path ke logo.svg benar
import { api } from "../../services/api"; // Pastikan path ke api service benar
import { useCart } from "../../context/CartContext"; // Pastikan path ke CartContext benar

const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartTotalItems } = useCart(); // Ambil cartTotalItems dari konteks keranjang

  useEffect(() => {
    // Fungsi untuk mengambil kategori dari API
    const getCategories = async () => {
      try {
        const data = await api.getCategories(); // Panggil fungsi dari api.ts
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    getCategories();
  }, []); // Dependensi kosong agar hanya berjalan sekali saat komponen dimuat

  // Fungsi untuk membuka/menutup menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-2 relative">
        {/* Grup Kiri: Logo dan CategoryDropdown */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center gap-2 text-gray-800 font-bold text-xl hover:text-blue-500 transition-colors duration-300">
            <img src={Logo} alt="Commerce Logo" className="h-7 w-auto" /> {/* Sesuaikan ukuran logo */}
            <span className="hidden sm:block">Commerce</span> {/* Sembunyikan "Commerce" di layar sangat kecil */}
          </Link>
          {/* CategoryDropdown hanya tampil di desktop (md ke atas) */}
          <div className="hidden md:block">
            <CategoryDropdown categories={categories} />
          </div>
        </div>

        {/* Search Bar (Tengah) - Tampil di desktop, sembunyi di mobile */}
        <div className="hidden md:flex flex-grow justify-center px-4">
          <SearchBar className="w-full max-w-lg" />
        </div>

        {/* Grup Kanan: Cart Icon, AuthButtons (desktop), Burger Menu (mobile) */}
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="relative text-gray-800 text-2xl hover:text-blue-500 transition-colors duration-300" aria-label="Shopping Cart">
            🛒
            {/* Badge jumlah item di keranjang */}
            {cartTotalItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{cartTotalItems}</span>}
          </Link>

          {/* AuthButtons hanya tampil di desktop (md ke atas) */}
          <div className="hidden md:flex space-x-4">
            <AuthButtons />
          </div>

          {/* Burger menu untuk mobile - tampil di mobile, sembunyi di desktop */}
          <button onClick={toggleMobileMenu} className="md:hidden text-gray-800 text-2xl" aria-label="Toggle navigation">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* Pastikan MobileMenu menerima `categories` dan `onClose` */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={toggleMobileMenu}
        categories={categories} // Kirim props categories ke MobileMenu
      />
    </header>
  );
};

export default Header;
