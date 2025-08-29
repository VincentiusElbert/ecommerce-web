// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './layouts/header/Header'; // PATH DIUBAH DI SINI!
import HomePage from './pages/HomePage';
import { SearchProvider } from './context/SearchContext';
import ProductDetailPage from './pages/ProductDetailPage';
import { CategoryFilterProvider } from './context/CategoryFilterContext';
// import ProductsPage from "./pages/ProductsPage";
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage";
import CategoryProductsPage from './pages/CategoryProductsPage';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';

function App() {
  return (
    <Router>
      <SearchProvider>
        <CategoryFilterProvider>
          <CartProvider>
            <Header />
            <main className='container mx-auto p-4 mt-4'>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route
                  path='/products/:productId'
                  element={<ProductDetailPage />}
                />
                <Route
                  path='/products/category/:categoryName'
                  element={<CategoryProductsPage />}
                />
                <Route path='/Cart' element={<CartPage />} />
              </Routes>
            </main>
          </CartProvider>
        </CategoryFilterProvider>
      </SearchProvider>
    </Router>
  );
}

export default App;
