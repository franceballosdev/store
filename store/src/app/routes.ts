import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Wishlist } from './pages/Wishlist';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProductForm } from './pages/ProductForm';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'shop', Component: Shop },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'order-success', Component: OrderSuccess },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'wishlist', Component: Wishlist },
      { path: 'admin', Component: AdminDashboard },
      { path: 'admin/products/new', Component: ProductForm },
      { path: 'admin/products/edit/:id', Component: ProductForm },
    ],
  },
]);
