// src/pages/CartPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import useCart
import Button from "../components/ui/Button"; // Import Button

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center text-gray-600">
        <p className="text-2xl font-semibold mb-4">Your cart is empty.</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Start shopping!
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items List */}
        <div className="flex-grow bg-white p-6 rounded-lg shadow-md">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
              <Link to={`/products/${item.id}`} className="flex-shrink-0 w-24 h-24 mr-4">
                <img src={item.image} alt={item.title} className="w-full h-full object-contain rounded-md" />
              </Link>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 text-sm capitalize">{item.category.replace(/-/g, " ")}</p>
                <p className="text-xl font-bold text-blue-600 mt-1">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
                  disabled={item.quantity <= 1} // Disable jika kuantitas 1
                >
                  -
                </button>
                <span className="text-lg font-medium text-gray-800 w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100">
                  +
                </button>
                <Button variant="danger" onClick={() => removeFromCart(item.id)} className="ml-4 px-3 py-1">
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md self-start">
          {" "}
          {/* self-start agar tidak memenuhi tinggi parent */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="flex justify-between text-lg text-gray-700 mb-2">
            <span>Total Items:</span>
            <span>{cartItems.length} unique items</span>
          </div>
          <div className="flex justify-between text-lg text-gray-700 mb-4">
            <span>Total Quantity:</span>
            <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-4 mt-4">
            <span>Total Price:</span>
            <span>${cartTotalPrice.toFixed(2)}</span>
          </div>
          <Button variant="primary" className="w-full mt-6 py-3">
            Proceed to Checkout
          </Button>
          <Button variant="outline" className="w-full mt-3 py-3" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
