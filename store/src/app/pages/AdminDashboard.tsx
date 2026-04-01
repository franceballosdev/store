import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, Search, ArrowLeft, Package, ShoppingBag, Users, TrendingUp, FileText, LayoutDashboard } from 'lucide-react';
import { Product } from '../context/CartContext';
import { API_BASE_URL } from '../config/api';

interface DashboardStats {
  sales: {
    total_orders: number;
    total_revenue: number;
    net_revenue: number;
  };
  users: {
    total_users: number;
  };
  topProducts: {
    id: number;
    name: string;
    image: string;
    total_sold: number;
    total_revenue: number;
  }[];
  salesByDay: {
    date: string;
    orders: number;
    revenue: number;
  }[];
  recentOrders: {
    id: number;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }[];
}

interface Order {
  id: number;
  customer_name: string;
  email: string;
  total: number;
  status: string;
  created_at: string;
  items: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface PageContent {
  id: number;
  slug: string;
  title: string;
  updated_at: string;
}

type Tab = 'dashboard' | 'products' | 'orders' | 'content';

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Dashboard state
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Content state
  const [pages, setPages] = useState<PageContent[]>([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<{slug: string, title: string, content: string} | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    if (activeTab === 'dashboard') fetchStats();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'content') fetchPages();
  }, [isAuthenticated, user, navigate, activeTab]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchPages = async () => {
    setPagesLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/pages`);
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setPagesLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        setDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setOrders(orders.filter(o => o.id !== orderId));
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/pages/${editingPage.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: editingPage.title, content: editingPage.content })
      });

      if (res.ok) {
        setEditingPage(null);
        fetchPages();
      }
    } catch (error) {
      console.error('Error saving page:', error);
    }
  };

  const handleLoadPage = async (slug: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/pages/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setEditingPage({ slug: data.slug, title: data.title, content: data.content });
      }
    } catch (error) {
      console.error('Error loading page:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado'
  };

  if (statsLoading && activeTab === 'dashboard') {
    return (
      <div className="min-h-screen bg-grey-olive-50 dark:bg-grey-olive-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grey-olive-600 dark:border-grey-olive-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-olive-50 dark:bg-grey-olive-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-grey-olive-600 dark:text-grey-olive-400 hover:text-grey-olive-800 dark:hover:text-grey-olive-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver a la tienda
            </Link>
          </div>
          <h1 className="text-3xl font-light text-foreground">Panel de Administración</h1>
          <div className="w-32"></div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
            { id: 'content', label: 'Contenido', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as Tab)}
              className={`flex items-center gap-2 px-4 py-3 transition-colors ${
                activeTab === id
                  ? 'text-grey-olive-700 border-b-2 border-grey-olive-700'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card p-6 shadow-sm border border-border">
                <div className="flex items-center gap-4">
                  <div className="bg-grey-olive-700 text-white p-3">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pedidos</p>
                    <p className="text-2xl font-light text-foreground">{stats.sales.total_orders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 shadow-sm border border-border">
                <div className="flex items-center gap-4">
                  <div className="bg-green-600 text-white p-3">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ingresos Netos</p>
                    <p className="text-2xl font-light text-foreground">${stats.sales.net_revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 shadow-sm border border-border">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white p-3">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Usuarios</p>
                    <p className="text-2xl font-light text-foreground">{stats.users.total_users}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-6 shadow-sm border border-border">
                <div className="flex items-center gap-4">
                  <div className="bg-grey-olive-600 text-white p-3">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Productos</p>
                    <p className="text-2xl font-light text-foreground">{products.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Products */}
              <div className="bg-card p-6 shadow-sm border border-border">
                <h3 className="text-lg font-medium mb-4">Productos Más Vendidos</h3>
                {stats.topProducts.length === 0 ? (
                  <p className="text-muted-foreground">No hay ventas registradas</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center gap-4">
                        <span className="w-6 h-6 bg-grey-olive-100 dark:bg-grey-olive-900 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.total_sold} vendidos</p>
                        </div>
                        <p className="font-medium">${product.total_revenue.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-card p-6 shadow-sm border border-border">
                <h3 className="text-lg font-medium mb-4">Pedidos Recientes</h3>
                {stats.recentOrders.length === 0 ? (
                  <p className="text-muted-foreground">No hay pedidos recientes</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-grey-olive-50 dark:bg-grey-olive-950 rounded">
                        <div>
                          <p className="font-medium text-sm">#{order.id} - {order.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <span className={`text-xs px-2 py-1 rounded ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sales Chart */}
            {stats.salesByDay.length > 0 && (
              <div className="bg-card p-6 shadow-sm border border-border">
                <h3 className="text-lg font-medium mb-4">Ventas Últimos 30 Días</h3>
                <div className="h-64 flex items-end gap-1">
                  {stats.salesByDay.map((day) => {
                    const maxRevenue = Math.max(...stats.salesByDay.map(d => d.revenue));
                    const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full bg-grey-olive-500 rounded-t"
                          style={{ height: `${height}%` }}
                          title={`${day.date}: $${day.revenue.toFixed(2)}`}
                        />
                        <span className="text-xs text-muted-foreground rotate-45 origin-left">
                          {new Date(day.date).getDate()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-olive-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                />
              </div>
              <Link
                to="/admin/products/new"
                className="flex items-center gap-2 bg-grey-olive-700 text-white px-4 py-2 hover:bg-grey-olive-800 transition-colors"
              >
                <Plus size={18} />
                Nuevo Producto
              </Link>
            </div>

            <div className="bg-card shadow-sm overflow-hidden border border-border">
              <table className="w-full">
                <thead className="bg-grey-olive-50 dark:bg-grey-olive-950">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Destacado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-grey-olive-50 dark:hover:bg-grey-olive-950">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-xs">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {product.stock}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.featured
                              ? 'bg-grey-olive-700 text-white'
                              : 'bg-grey-olive-100 dark:bg-grey-olive-900 text-grey-olive-700 dark:text-grey-olive-400'
                          }`}
                        >
                          {product.featured ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="p-2 text-grey-olive-600 dark:text-grey-olive-400 hover:text-grey-olive-800 dark:hover:text-grey-olive-300 hover:bg-grey-olive-100 dark:hover:bg-grey-olive-950 transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </Link>
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700"
                              >
                                Sí
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1 bg-grey-olive-200 dark:bg-grey-olive-800 text-grey-olive-700 dark:text-grey-olive-400 text-xs hover:bg-grey-olive-300 dark:hover:bg-grey-olive-700"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 text-grey-olive-600 dark:text-grey-olive-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No se encontraron productos
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-border bg-background"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="processing">Procesando</option>
                <option value="shipped">Enviado</option>
                <option value="delivered">Entregado</option>
                <option value="cancelled">Cancelado</option>
                <option value="refunded">Reembolsado</option>
              </select>
            </div>

            <div className="bg-card shadow-sm overflow-hidden border border-border">
              <table className="w-full">
                <thead className="bg-grey-olive-50 dark:bg-grey-olive-950">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Pedido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-grey-olive-700 dark:text-grey-olive-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-grey-olive-50 dark:hover:bg-grey-olive-950">
                      <td className="px-6 py-4">
                        <p className="font-medium">#{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.items?.length || 0} productos</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-sm text-muted-foreground">{order.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`text-sm px-2 py-1 rounded ${statusColors[order.status]}`}
                        >
                          {Object.entries(statusLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-grey-olive-600 dark:text-grey-olive-400 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            {!editingPage ? (
              <div className="bg-card shadow-sm border border-border">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-medium">Páginas del Sitio</h3>
                  <p className="text-sm text-muted-foreground">Edita el contenido de las páginas estáticas</p>
                </div>
                <div className="divide-y divide-border">
                  {pages.length === 0 ? (
                    <div className="p-6 text-center text-muted-foreground">
                      No hay páginas creadas. Crea páginas para "Nosotros", "Contacto", etc.
                    </div>
                  ) : (
                    pages.map((page) => (
                      <div key={page.id} className="flex items-center justify-between p-6 hover:bg-grey-olive-50 dark:hover:bg-grey-olive-950">
                        <div>
                          <p className="font-medium">{page.title}</p>
                          <p className="text-sm text-muted-foreground">/{page.slug}</p>
                          <p className="text-xs text-muted-foreground">Actualizado: {new Date(page.updated_at).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleLoadPage(page.slug)}
                          className="flex items-center gap-2 px-4 py-2 bg-grey-olive-700 text-white hover:bg-grey-olive-800"
                        >
                          <Edit size={18} />
                          Editar
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-6 border-t border-border">
                  <button
                    onClick={() => setEditingPage({ slug: '', title: '', content: '' })}
                    className="flex items-center gap-2 px-4 py-2 border border-border hover:bg-grey-olive-50 dark:hover:bg-grey-olive-950"
                  >
                    <Plus size={18} />
                    Crear Nueva Página
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">{editingPage.slug ? 'Editar Página' : 'Nueva Página'}</h3>
                  <button
                    onClick={() => setEditingPage(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancelar
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">URL (slug)</label>
                    <input
                      type="text"
                      value={editingPage.slug}
                      onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                      placeholder="about"
                      className="w-full px-4 py-2 border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Título</label>
                    <input
                      type="text"
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                      placeholder="Sobre Nosotros"
                      className="w-full px-4 py-2 border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Contenido</label>
                    <textarea
                      value={editingPage.content}
                      onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                      rows={15}
                      placeholder="Escribe el contenido de la página aquí..."
                      className="w-full px-4 py-2 border border-border bg-background font-mono text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setEditingPage(null)}
                      className="px-4 py-2 border border-border hover:bg-grey-olive-50 dark:hover:bg-grey-olive-950"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSavePage}
                      className="px-4 py-2 bg-grey-olive-700 text-white hover:bg-grey-olive-800"
                    >
                      Guardar Página
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
