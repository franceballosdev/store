import { Link, useLocation } from 'react-router';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export function Header() {
  const { getCartCount } = useCart();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = getCartCount();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl text-black">STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm transition-colors ${
                isActive('/') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/shop"
              className={`text-sm transition-colors ${
                isActive('/shop') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Tienda
            </Link>
            <Link
              to="/about"
              className={`text-sm transition-colors ${
                isActive('/about') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Nosotros
            </Link>
            <Link
              to="/contact"
              className={`text-sm transition-colors ${
                isActive('/contact') ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              Contacto
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-black transition-colors hidden md:block">
              <Search size={20} />
            </button>
            <Link to="/cart" className="relative text-gray-600 hover:text-black transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-gray-600 hover:text-black"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-gray-200">
            <Link
              to="/"
              className="block text-sm text-gray-600 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/shop"
              className="block text-sm text-gray-600 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Tienda
            </Link>
            <Link
              to="/about"
              className="block text-sm text-gray-600 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              to="/contact"
              className="block text-sm text-gray-600 hover:text-black"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
