import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useAuth } from './AuthContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  wishlistCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { token } = useAuth();

  // Fetch wishlist from API when authenticated
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const items = await res.json();
          setWishlist(items);
        }
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const addToWishlist = useCallback(async (product: Product) => {
    if (!token) {
      showToast('Inicia sesión para guardar favoritos', 'warning');
      return;
    }

    // Optimistic update
    setWishlist((prev) => {
      if (prev.find((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });

      if (res.ok || res.status === 409) {
        showToast(`${product.name} agregado a favoritos`, 'success');
      } else {
        // Revert on error
        setWishlist((prev) => prev.filter((item) => item.id !== product.id));
        showToast('Error al agregar a favoritos', 'error');
      }
    } catch (err) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast('Error de conexión', 'error');
    }
  }, [token, showToast]);

  const removeFromWishlist = useCallback(async (productId: number) => {
    if (!token) return;

    const product = wishlist.find((item) => item.id === productId);
    
    // Optimistic update
    setWishlist((prev) => prev.filter((item) => item.id !== productId));

    try {
      const res = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        if (product) {
          showToast(`${product.name} eliminado de favoritos`, 'info');
        }
      } else {
        // Revert on error
        if (product) {
          setWishlist((prev) => [...prev, product]);
        }
        showToast('Error al eliminar de favoritos', 'error');
      }
    } catch (err) {
      if (product) {
        setWishlist((prev) => [...prev, product]);
      }
      showToast('Error de conexión', 'error');
    }
  }, [token, wishlist, showToast]);

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.some((item) => item.id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback(async (product: Product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: wishlist.length,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
