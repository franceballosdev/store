import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Menu, X, Search, User, LogOut, Sun, Moon, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';

export function Header() {
  const { getCartCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl text-grey-olive-800 dark:text-grey-olive-200 font-semibold">STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors">
              Inicio
            </Link>
            <Link to="/shop" className="text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors">
              Tienda
            </Link>
            <Link to="/about" className="text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors">
              Nosotros
            </Link>
            <Link to="/contact" className="text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors"
              title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors hidden md:block"
              title="Buscar productos"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors"
              title="Favoritos"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden md:block text-sm text-grey-olive-600 dark:text-grey-olive-400 hover:text-grey-olive-800 dark:hover:text-grey-olive-300 transition-colors mr-2"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm text-muted-foreground hidden lg:block">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors"
                title="Iniciar sesión"
              >
                <User size={20} />
              </Link>
            )}

            <Link to="/cart" className="relative text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 transition-colors">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-grey-olive-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              className="md:hidden text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-border bg-background">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={() => {
                toggleTheme();
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            </button>
            <Link
              to="/"
              className="block text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/shop"
              className="block text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Tienda
            </Link>
            <Link
              to="/about"
              className="block text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              to="/wishlist"
              className="block text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Favoritos ({wishlistCount})
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Crear Cuenta
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block text-sm text-foreground hover:text-grey-olive-600 dark:hover:text-grey-olive-400 text-left"
              >
                Cerrar Sesión
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
