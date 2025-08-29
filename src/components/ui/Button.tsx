// src/components/common/Button.tsx
import React, { type ButtonHTMLAttributes, type ReactNode } from "react";

// Definisikan tipe untuk prop 'variant'
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

// Definisikan tipe untuk props komponen Button
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Konten di dalam tombol (teks, ikon, dll.)
  variant?: ButtonVariant; // Varian warna tombol, opsional
  className?: string; // Kelas CSS tambahan dari Tailwind atau lainnya
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary", // Default variant adalah 'primary'
  className = "", // Default className kosong
  ...props // Sisa props yang diterima oleh elemen <button> standar (onClick, disabled, type, dll.)
}) => {
  // Fungsi helper untuk mendapatkan kelas Tailwind berdasarkan variant
  const getVariantClasses = (buttonVariant: ButtonVariant) => {
    switch (buttonVariant) {
      case "primary":
        return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
      case "secondary":
        return "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";
      case "outline":
        return "bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500";
      case "ghost":
        return "bg-transparent text-gray-800 hover:bg-gray-100 focus:ring-gray-300";
      case "danger":
        return "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"; // Fallback
    }
  };

  // Kelas dasar yang selalu ada pada tombol
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75";

  // Gabungkan kelas dasar, kelas varian, dan kelas tambahan dari props
  const combinedClasses = `${baseClasses} ${getVariantClasses(variant)} ${className}`;

  return (
    <button
      className={combinedClasses}
      {...props} // Sebarkan semua props lainnya ke elemen button
    >
      {children}
    </button>
  );
};

export default Button;
