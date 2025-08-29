// src/context/CartContext.tsx

// 1. Import library dan tipe yang dibutuhkan
import React, { createContext, useContext, useState, useMemo, type ReactNode } from "react";
//    - React: Library utama React.
//    - createContext: Untuk membuat objek Context.
//    - useContext: Hook untuk mengkonsumsi nilai dari Context.
//    - useState: Hook untuk mengelola state lokal di komponen fungsional.
//    - useMemo: Hook untuk mengoptimasi kinerja, mencegah perhitungan ulang yang tidak perlu
//               (digunakan untuk menghitung total item dan harga).
//    - type ReactNode: Tipe dari React untuk properti `children` (konten di dalam komponen React).

import { type CartItem, type CartContextType } from "../types/cart";
//    - type CartItem: Mengimpor definisi tipe `CartItem` dari `types/cart.ts`.
//      `CartItem` adalah `Product` ditambah properti `quantity`.
//    - type CartContextType: Mengimpor definisi tipe `CartContextType` dari `types/cart.ts`.
//      Ini adalah 'kontrak' dari nilai yang akan disediakan oleh konteks keranjang.

import { type Product } from "../types/product";
//    - type Product: Mengimpor definisi tipe `Product` dari `types/product.ts`.
//      Digunakan sebagai tipe dasar untuk `addToCart` dan `CartItem`.

// 2. Buat Objek Konteks (CartContext)
const CartContext = createContext<CartContextType | undefined>(undefined);
//    - createContext: Membuat objek konteks keranjang belanja itu sendiri.
//    - <CartContextType | undefined>: Menentukan tipe nilai yang bisa disimpan dalam konteks ini.
//      `undefined` sebagai nilai default awal, dan juga untuk penanganan error di `useCart` hook.

// 3. Definisikan Props untuk Komponen Provider (CartProviderProps)
interface CartProviderProps {
  children: ReactNode;
  //    - children: Properti `ReactNode` yang wajib. Ini adalah komponen-komponen React yang
  //      akan dibungkus oleh `CartProvider` dan akan memiliki akses ke nilai konteks keranjang.
}

// 4. Komponen Provider (CartProvider)
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // - Ini adalah komponen utama yang akan "menyediakan" nilai konteks keranjang.
  //   Semua state dan logika untuk mengelola keranjang belanja akan dikelola di sini.

  // State untuk menyimpan daftar item di keranjang
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  //    - cartItems: Sebuah array dari objek `CartItem`. Ini adalah representasi
  //      dari semua produk yang ada di keranjang belanja pengguna. Defaultnya array kosong.

  // 5. Fungsi untuk Menambahkan Produk ke Keranjang (addToCart)
  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    //    - product: Objek `Product` yang ingin ditambahkan.
    //    - quantityToAdd: Jumlah kuantitas yang ingin ditambahkan. Defaultnya 1.
    setCartItems((prevItems) => {
      // Menggunakan functional update untuk `setCartItems` agar selalu bekerja dengan state terbaru.
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);
      //    - Cari apakah produk yang ingin ditambahkan sudah ada di keranjang (`prevItems`).

      if (existingItemIndex > -1) {
        // Jika produk sudah ada di keranjang (`existingItemIndex` bukan -1)
        //    - Jika produk sudah ada, update kuantitasnya
        const updatedItems = [...prevItems]; // Buat salinan (shallow copy) dari array item sebelumnya
        updatedItems[existingItemIndex] = {
          // Update item yang sudah ada
          ...updatedItems[existingItemIndex], // Salin semua properti item yang sudah ada
          quantity: updatedItems[existingItemIndex].quantity + quantityToAdd, // Tambahkan kuantitasnya
        };
        return updatedItems; // Kembalikan array item yang sudah diupdate
      } else {
        // Jika produk belum ada di keranjang
        //    - Tambahkan sebagai item baru ke keranjang
        return [...prevItems, { ...product, quantity: quantityToAdd }];
        //    - Buat salinan array sebelumnya, lalu tambahkan objek `CartItem` baru
        //      (`Product` ditambah `quantity`) ke dalamnya.
      }
    });
  };

  // 6. Fungsi untuk Menghapus Produk dari Keranjang (removeFromCart)
  const removeFromCart = (productId: number) => {
    //    - productId: ID produk yang ingin dihapus dari keranjang.
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    //    - Menggunakan metode `filter` untuk membuat array baru yang hanya berisi item
    //      yang `id`-nya TIDAK sama dengan `productId` yang ingin dihapus.
  };

  // 7. Fungsi untuk Memperbarui Kuantitas Produk di Keranjang (updateQuantity)
  const updateQuantity = (productId: number, quantity: number) => {
    //    - productId: ID produk yang kuantitasnya ingin diupdate.
    //    - quantity: Kuantitas baru yang diinginkan.
    setCartItems((prevItems) => {
      // Pastikan kuantitas tidak kurang dari 1 (misal, tidak bisa jadi 0 atau negatif)
      const newQuantity = Math.max(1, quantity);
      return prevItems.map(
        (item) =>
          // Gunakan metode `map` untuk membuat array baru
          item.id === productId ? { ...item, quantity: newQuantity } : item
        //    - Jika `item.id` cocok, buat salinan `item` tersebut dan update `quantity`-nya.
        //    - Jika tidak cocok, kembalikan `item` aslinya tanpa perubahan.
      );
    });
  };

  // 8. Fungsi untuk Mengosongkan Keranjang (clearCart)
  const clearCart = () => {
    setCartItems([]);
    //    - Set state `cartItems` menjadi array kosong, sehingga keranjang bersih.
  };

  // 9. Perhitungan Memoized: Total Item dan Total Harga (useMemo)
  const { totalItems, totalPrice } = useMemo(() => {
    // - Hook `useMemo` digunakan untuk mengoptimasi perhitungan total item dan total harga.
    //   Perhitungan ini hanya akan dijalankan ulang jika `cartItems` berubah,
    //   mencegah perhitungan yang tidak perlu setiap kali komponen `CartProvider` di-render.

    let count = 0; // Inisialisasi hitungan total kuantitas
    let price = 0; // Inisialisasi total harga

    cartItems.forEach((item) => {
      // Loop melalui setiap item di `cartItems`
      count += item.quantity; // Menghitung total kuantitas dari semua item
      price += item.price * item.quantity; // Menghitung total harga (harga item * kuantitas)
    });
    return { totalItems: count, totalPrice: price };
    // Mengembalikan objek yang berisi `totalItems` dan `totalPrice`.
  }, [cartItems]); // Array dependensi `[cartItems]` berarti `useMemo` ini hanya akan dihitung ulang
  // jika array `cartItems` itu sendiri berubah.

  // 10. Nilai Konteks yang Disediakan
  const contextValue: CartContextType = {
    // Ini adalah objek yang akan menjadi `value` dari `CartContext.Provider`.
    // Properti-properti ini harus sesuai dengan `CartContextType` yang didefinisikan di `types/cart.ts`.

    cartItems, // Menyediakan daftar item di keranjang
    addToCart, // Menyediakan fungsi untuk menambah item
    removeFromCart, // Menyediakan fungsi untuk menghapus item
    updateQuantity, // Menyediakan fungsi untuk update kuantitas
    clearCart, // Menyediakan fungsi untuk mengosongkan keranjang
    cartTotalItems: totalItems, // Menyediakan total kuantitas item (dari useMemo)
    cartTotalPrice: totalPrice, // Menyediakan total harga (dari useMemo)
  };

  // 11. Merender Provider Konteks
  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
  //    - CartContext.Provider: Komponen ini "membungkus" komponen `children`.
  //    - value={contextValue}: Semua komponen anak yang dibungkus oleh provider ini
  //      dapat mengakses `contextValue` ini menggunakan hook `useContext(CartContext)` atau `useCart()`.
}; // Akhir dari komponen CartProvider

// 12. Custom Hook untuk Penggunaan Konteks (useCart)
export const useCart = () => {
  // - Ini adalah custom hook yang berfungsi sebagai shortcut yang rapi untuk `useContext`.
  //   Daripada memanggil `useContext(CartContext)` dan menangani `undefined` setiap kali,
  //   kita bisa memanggil `useCart()`.

  const context = useContext(CartContext);
  //    - Menggunakan `useContext` untuk mengambil nilai dari `CartContext`.

  if (context === undefined) {
    // - Ini adalah pengecekan penting untuk error handling.
    //   Jika `useCart` dipanggil dari komponen yang tidak berada di dalam `CartProvider`,
    //   maka `context` akan `undefined`.
    throw new Error("useCart must be used within a CartProvider");
    //    - Dalam kasus ini, kita melempar error yang jelas agar developer tahu masalahnya.
  }
  return context; // Mengembalikan nilai konteks (objek CartContextType).
};
