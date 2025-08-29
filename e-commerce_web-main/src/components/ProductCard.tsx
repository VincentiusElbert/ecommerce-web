// src/components/ProductCard.tsx
import React from "react";
import { type Product } from "../types/product";
import Card from "./ui/Card"; // Path ini sudah kamu ubah ke 'ui', pastikan sesuai
import { Link } from "react-router-dom"; // Ini harusnya react-router-dom

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    // Membungkus seluruh Card dengan Link
    <Link to={`/products/${product.id}`} className="block h-full">
      {" "}
      {/* Tambah h-full untuk konsistensi tinggi */}
      <Card className="transform transition-transform duration-300 hover:scale-105 flex flex-col cursor-pointer">
        {/* Gambar Produk */}
        <div className="relative h-48 flex items-center justify-center p-4">
          <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
        </div>

        {/* Detail Produk */}
        <div className="p-3 text-left flex-grow flex flex-col">
          <h3 className="text-gray-800 font-medium text-base leading-tight line-clamp-3 min-h-[60px]" title={product.title}>
            {product.title}
          </h3>
          <p className="text-gray-900 font-bold text-lg mt-1 mb-1">${product.price.toFixed(2)}</p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            ⭐ {product.rating.rate}
            <span className="ml-1">({product.rating.count})</span>
          </div>
        </div>
        {/* Tombol Add to Cart dihapus sesuai permintaan */}
      </Card>
    </Link>
  );
};

export default ProductCard;
