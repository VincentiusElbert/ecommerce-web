// src/components/Header/AuthButtons.tsx
import React from "react";
import { Link } from "react-router-dom"; // <= Pertahankan import ini
import Button from "../../components/ui/Button";

const AuthButtons: React.FC = () => {
  return (
    <>
      {/* Menggunakan Link untuk navigasi */}
      <Link
        to="/login" // Ganti dengan path halaman login kamu
      >
        <Button variant="outline">Login</Button>
      </Link>
      <Link
        to="/register" // Ganti dengan path halaman register kamu
      >
        <Button variant="primary">Register</Button>
      </Link>
    </>
  );
};

export default AuthButtons;
