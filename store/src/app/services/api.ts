import { Product, CartItem } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || '';

const SESSION_ID = localStorage.getItem('sessionId') || 
  Math.random().toString(36).substring(2, 15);
localStorage.setItem('sessionId', SESSION_ID);

const headers = {
  'Content-Type': 'application/json',
  'X-Session-Id': SESSION_ID,
};

export const api = {
  // Products
  getProducts: async (category?: string, featured?: boolean): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured) params.append('featured', 'true');
    const res = await fetch(`${API_URL}/api/products?${params}`);
    return res.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/products/${id}`);
    return res.json();
  },

  createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(product),
    });
    return res.json();
  },

  // Cart
  getCart: async (): Promise<CartItem[]> => {
    const res = await fetch(`${API_URL}/api/cart`, { headers });
    return res.json();
  },

  addToCart: async (productId: number, quantity = 1): Promise<void> => {
    await fetch(`${API_URL}/api/cart`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateCartItem: async (itemId: number, quantity: number): Promise<void> => {
    await fetch(`${API_URL}/api/cart/${itemId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (itemId: number): Promise<void> => {
    await fetch(`${API_URL}/api/cart/${itemId}`, {
      method: 'DELETE',
      headers,
    });
  },

  clearCart: async (): Promise<void> => {
    await fetch(`${API_URL}/api/cart`, {
      method: 'DELETE',
      headers,
    });
  },

  // Orders
  createOrder: async (order: {
    customerName: string;
    email: string;
    phone?: string;
    address: string;
    items: { product_id: number; quantity: number; price: number }[];
    total: number;
  }): Promise<{ orderId: number }> => {
    const res = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(order),
    });
    return res.json();
  },

  getOrders: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/api/orders`);
    return res.json();
  },
};
