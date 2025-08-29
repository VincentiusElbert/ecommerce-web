// src/pages/ProductDetailPage.tsx

// 1. Import library, hook, dan tipe yang dibutuhkan
import React, { useState, useEffect } from "react";
//    - React: Library utama React.
//    - useState: Hook untuk mengelola state lokal komponen (misal: `product`, `loading`, `quantity`).
//    - useEffect: Hook untuk efek samping, seperti fetching data dari API.

import { useParams, Link } from "react-router-dom";
//    - useParams: Hook dari React Router DOM untuk mengambil parameter dari URL (misal: `productId`).
//    - Link: Komponen dari React Router DOM untuk navigasi (digunakan di breadcrumbs).

import { type Product } from "../types/product";
//    - type Product: Mengimpor definisi tipe `Product` dari `types/product.ts`.

import { api } from "../services/api";
//    - api: Mengimpor objek `api` dari `services/api.ts` untuk interaksi dengan API.

import ProductCard from "../components/ProductCard";
//    - ProductCard: Mengimpor komponen `ProductCard` untuk merender "Related Products".

import Button from "../components/ui/Button";
//    - Button: Mengimpor komponen `Button` yang sudah kita buat (diasumsikan berada di `ui` folder).

import { useCart } from "../context/CartContext";
//    - useCart: Mengimpor custom hook `useCart` dari `CartContext.tsx`.
//      Hook ini akan memberikan akses ke fungsi `addToCart` untuk menambahkan produk ke keranjang.

// 2. Komponen Fungsional ProductDetailPage
const ProductDetailPage: React.FC = () => {
  // - Ini adalah komponen React fungsional yang merender halaman detail dari satu produk.

  // Mengambil parameter `productId` dari URL
  const { productId } = useParams<{ productId: string }>();
  //    - `productId`: Akan berisi nilai dari bagian URL `/products/`**`id-produk`**.
  //      Contoh: Jika URL adalah `/products/1`, maka `productId` akan menjadi "1".

  // 3. State Lokal Komponen
  const [product, setProduct] = useState<Product | null>(null);
  //    - product: State untuk menyimpan detail dari satu produk yang sedang dilihat. Defaultnya `null`.

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  //    - relatedProducts: State untuk menyimpan daftar produk-produk terkait. Defaultnya array kosong.

  const [loading, setLoading] = useState<boolean>(true);
  //    - loading: State boolean untuk menunjukkan apakah data produk sedang dimuat.

  const [error, setError] = useState<string | null>(null);
  //    - error: State untuk menyimpan pesan error jika fetching data gagal.

  const [quantity, setQuantity] = useState<number>(1);
  //    - quantity: State untuk menyimpan jumlah kuantitas produk yang ingin ditambahkan ke keranjang. Defaultnya 1.

  // Menggunakan hook dari konteks keranjang
  const { addToCart } = useCart();
  //    - addToCart: Mengambil fungsi `addToCart` dari `CartContext` untuk menambahkan produk ke keranjang.

  // 4. Efek Samping: Fetching Detail Produk dan Produk Terkait (useEffect)
  useEffect(() => {
    // - Hook `useEffect` ini bertanggung jawab untuk mengambil data detail produk dan produk terkait dari API.
    // - Ini akan dijalankan setiap kali `productId` di URL berubah, memastikan
    //   halaman menampilkan detail produk yang benar.

    const fetchProductDetails = async () => {
      // Fungsi asinkron untuk mengambil data dari API.
      if (!productId) {
        // Cek jika `productId` tidak ada di URL (misal: URL salah diketik).
        setError("Product ID is missing."); // Set error
        setLoading(false); // Selesai loading
        return; // Hentikan eksekusi fungsi
      }

      try {
        setLoading(true); // Mulai loading
        setError(null); // Reset error

        // Ambil detail produk berdasarkan ID
        const fetchedProduct = await api.getProductById(Number(productId));
        //    - `api.getProductById`: Memanggil fungsi dari API service.
        //    - `Number(productId)`: Mengkonversi `productId` dari string (dari URL) menjadi number,
        //      karena ID produk di API adalah number.
        setProduct(fetchedProduct); // Simpan detail produk yang berhasil diambil
        setQuantity(1); // Reset kuantitas ke 1 setiap kali produk baru dimuat

        // Ambil produk terkait (misalnya produk dari kategori yang sama, tapi tidak termasuk produk saat ini)
        const allProducts = await api.getAllProducts();
        //    - Karena Fakestore API tidak punya endpoint langsung untuk produk terkait,
        //      kita ambil semua produk dulu.
        const filteredRelated = allProducts
          .filter((p) => p.category === fetchedProduct.category && p.id !== fetchedProduct.id) // Filter: kategori sama dan ID tidak sama dengan produk yang sedang dilihat
          .slice(0, 5); // Ambil maks 5 produk terkait
        setRelatedProducts(filteredRelated); // Simpan produk terkait
      } catch (err) {
        // Tangani error jika fetching gagal
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching product details.");
        }
      } finally {
        setLoading(false); // Pastikan loading menjadi false setelah fetching selesai
      }
    };

    fetchProductDetails(); // Panggil fungsi fetching segera setelah komponen mount atau `productId` berubah
  }, [productId]); // Array dependensi `[productId]` berarti `useEffect` ini akan berjalan
  // setiap kali nilai `productId` di URL berubah.

  // 5. Fungsi Handler untuk Tombol "Add to Cart"
  const handleAddToCart = () => {
    if (product) {
      // Pastikan ada detail produk yang valid sebelum menambahkan ke keranjang
      addToCart(product, quantity); // Panggil fungsi `addToCart` dari `CartContext`, sertakan produk dan kuantitas
      alert(`${quantity} x ${product.title} added to cart!`); // Berikan feedback sederhana ke pengguna
    }
  };

  // 6. Fungsi Handler untuk Mengubah Kuantitas
  const handleQuantityChange = (change: number) => {
    //    - change: Bisa +1 atau -1.
    setQuantity((prevQty) => Math.max(1, prevQty + change));
    //    - Menggunakan functional update untuk `setQuantity`.
    //    - `Math.max(1, ...)`: Memastikan kuantitas tidak pernah kurang dari 1.
  };

  // 7. Conditional Rendering: Loading, Error, Product Not Found, atau Konten Utama
  if (loading) {
    // Jika `loading` true, tampilkan pesan loading
    return <div className="flex justify-center items-center h-screen-minus-header text-xl text-gray-600">Loading product details...</div>;
  }

  if (error) {
    // Jika ada `error`, tampilkan pesan error
    return <div className="flex justify-center items-center h-screen-minus-header text-xl text-red-600">Error: {error}</div>;
  }

  if (!product) {
    // Jika `product` null (setelah loading selesai dan tidak ada error), berarti produk tidak ditemukan
    return <div className="flex justify-center items-center h-screen-minus-header text-xl text-gray-600">Product not found.</div>;
  }

  // Jika tidak loading, tidak ada error, dan produk ditemukan, render konten detail produk
  return (
    <div className="py-8">
      {/* Breadcrumbs */}
      {/* Menunjukkan jalur navigasi: Home > Products > Kategori Produk > Nama Produk */}
      <nav className="text-sm text-gray-600 mb-6 px-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>{" "}
        /
        <Link to="/products" className="hover:underline ml-1">
          Products
        </Link>{" "}
        /
        <Link to={`/products/category/${product.category}`} className="hover:underline ml-1 capitalize">
          {product.category.replace(/-/g, " ")} {/* Link ke halaman kategori produk */}
        </Link>{" "}
        /<span className="ml-1 font-semibold text-gray-800 line-clamp-1">{product.title}</span>
        {/* Nama produk saat ini (diberi kelas `line-clamp-1` agar tidak terlalu panjang) */}
      </nav>

      {/* Bagian Detail Produk Utama */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-md mb-12">
        {/* `flex flex-col md:flex-row`: Tata letak kolom di mobile, baris di desktop */}
        {/* `gap-8`: Jarak antar kolom/baris */}
        {/* `bg-white p-6 rounded-lg shadow-md mb-12`: Gaya visual container detail */}

        {/* Gambar Produk */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          {/* `w-full md:w-1/2`: Lebar 100% di mobile, 50% di desktop */}
          <img src={product.image} alt={product.title} className="max-h-96 max-w-full object-contain" />
          {/* `max-h-96`: Tinggi maksimum gambar. `object-contain`: Memastikan gambar tidak terpotong */}
        </div>

        {/* Info Produk (Nama, Kategori, Rating, Harga, Deskripsi) */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          {/* Judul Produk */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
          {/* Kategori Produk */}
          <p className="text-xl text-gray-700 capitalize mb-2">{product.category.replace(/-/g, " ")}</p>
          {/* Rating Produk */}
          <div className="flex items-center text-md text-gray-600 mb-4">
            ⭐ {product.rating.rate}
            <span className="ml-1 text-sm">({product.rating.count} reviews)</span>
          </div>
          {/* Harga Produk */}
          <p className="text-4xl font-extrabold text-blue-600 mb-6">${product.price.toFixed(2)}</p>

          {/* Judul Deskripsi */}
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
          {/* Isi Deskripsi */}
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          {/* Quantity selector dan buttons */}
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-gray-800 text-lg">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-md">
              {/* Tombol Kurang Kuantitas */}
              <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                -
              </button>
              {/* Input Kuantitas (read-only) */}
              <input type="text" value={quantity} readOnly className="w-12 text-center border-x border-gray-300 py-1 focus:outline-none" />
              {/* Tombol Tambah Kuantitas */}
              <button onClick={() => handleQuantityChange(1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                +
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            {/* Tombol "Add to Cart" */}
            <Button variant="secondary" className="flex-1" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            {/* Tombol "Buy Now" (aksi belum diimplementasikan) */}
            <Button variant="primary" className="flex-1">
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      {/* Bagian Related Products */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-left px-4">Related Products</h2>
      {relatedProducts.length > 0 ? (
        // Jika ada produk terkait, tampilkan dalam grid
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-6 px-4">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} /> // Menggunakan ProductCard untuk produk terkait
          ))}
        </div>
      ) : (
        // Jika tidak ada produk terkait
        <div className="text-center text-gray-500">No related products found.</div>
      )}
    </div>
  );
};

export default ProductDetailPage; // Mengekspor komponen ProductDetailPage.
