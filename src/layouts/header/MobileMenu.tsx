// src/components/Header/MobileMenu.tsx
import React from "react";
import { NavLink, Link } from "react-router-dom"; // Tambahkan Link
import SearchBar from "./SearchBar";
import { type Category } from "../../types/product"; // Import Category
import AuthButtons from "./AuthButtons"; // Import AuthButtons

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[]; // Tambahkan prop categories
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, categories }) => {
  if (!isOpen) return null;

  return (
    // Atur posisi dan style agar menu muncul di bawah header
    <nav className="md:hidden bg-gray-800 py-4 absolute w-full top-full left-0 z-40 shadow-xl">
      <ul className="flex flex-col items-center space-y-4 text-white">
        {/* Search Bar di Mobile Menu */}
        <li className="w-full px-4">
          <SearchBar className="w-full bg-gray-700 placeholder-gray-400 text-white focus:ring-blue-500" />
        </li>

        {/* Category Dropdown di Mobile Menu */}
        <li className="w-full px-4">
          <h3 className="text-gray-400 font-semibold text-sm mb-2 text-left w-full">Categories</h3>
          <div className="flex flex-col space-y-2">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category}
                  to={`/products/category/${category}`}
                  className="block px-4 py-2 text-white hover:bg-gray-700 capitalize rounded-md transition-colors duration-150 text-left"
                  onClick={onClose} // Tutup menu setelah klik
                >
                  {category.replace(/-/g, " ")}
                </Link>
              ))
            ) : (
              <p className="px-4 py-2 text-gray-500 text-sm text-left">No categories found.</p>
            )}
          </div>
        </li>

        {/* Navigasi Utama di Mobile */}
        <li>
          <NavLink to="/" className="block text-lg hover:text-blue-400" onClick={onClose}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className="block text-lg hover:text-blue-400" onClick={onClose}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="block text-lg hover:text-blue-400" onClick={onClose}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="block text-lg hover:text-blue-400" onClick={onClose}>
            Contact
          </NavLink>
        </li>

        {/* Auth Buttons di Mobile Menu */}
        <li className="flex flex-col space-y-2 mt-4">
          {/* Menggunakan useNavigate di AuthButtons atau membungkusnya */}
          <AuthButtons />
        </li>
      </ul>
    </nav>
  );
};

export default MobileMenu;
