// src/components/Header/HeaderNav.tsx
import React from "react";
import { NavLink } from "react-router-dom";

interface HeaderNavProps {
  onLinkClick?: () => void; // Untuk menutup menu mobile setelah klik
  className?: string; // Untuk kelas tambahan dari Tailwind
}

const HeaderNav: React.FC<HeaderNavProps> = ({ onLinkClick, className }) => {
  const baseLinkClasses = "text-lg hover:text-blue-400 transition-colors duration-300";
  const activeLinkClasses = "text-blue-400 font-semibold";

  return (
    <nav className={className}>
      <ul className="flex space-x-6">
        <li>
          <NavLink to="/" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`} onClick={onLinkClick}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/products" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`} onClick={onLinkClick}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`} onClick={onLinkClick}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`} onClick={onLinkClick}>
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderNav;
