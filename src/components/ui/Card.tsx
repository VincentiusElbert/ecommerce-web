// src/components/common/Card.tsx
import React, { type ReactNode, type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode; // Konten di dalam card
  className?: string; // Kelas CSS tambahan dari Tailwind atau lainnya
}

const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
