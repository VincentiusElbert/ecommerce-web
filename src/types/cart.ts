// src/types/cart.ts
import { type Product } from "./product"; // Import tipe Product dari product.ts

// Tipe untuk satu item di keranjang belanja
export interface CartItem extends Product {
  quantity: number; // Tambahan properti kuantitas
}

// Tipe untuk nilai yang akan disediakan oleh CartContext
export interface CartContextType {
  cartItems: CartItem[]; // Array dari item di keranjang
  addToCart: (product: Product, quantity?: number) => void; // Fungsi untuk menambahkan produk
  removeFromCart: (productId: number) => void; // Fungsi untuk menghapus produk
  updateQuantity: (productId: number, quantity: number) => void; // Fungsi untuk update kuantitas
  clearCart: () => void; // Fungsi untuk mengosongkan keranjang
  cartTotalItems: number; // Total jumlah item unik di keranjang
  cartTotalPrice: number; // Total harga semua item di keranjang
}
