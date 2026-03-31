import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export function ProductForm() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    rating: '5',
    stock: '100',
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Electrónica', 'Ropa', 'Accesorios', 'Hogar'];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/login');
      return;
    }

    if (isEditing) {
      fetchProduct();
    }
  }, [isAuthenticated, user, navigate, id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const product = await res.json();
        setFormData({
          name: product.name,
          price: product.price.toString(),
          image: product.image,
          category: product.category,
          description: product.description,
          rating: product.rating.toString(),
          stock: product.stock.toString(),
          featured: product.featured === 1,
        });
      } else {
        setError('Producto no encontrado');
      }
    } catch (err) {
      setError('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const token = localStorage.getItem('token');
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      stock: parseInt(formData.stock),
      featured: formData.featured,
    };

    try {
      const url = isEditing ? `/api/products/${id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (res.ok) {
        navigate('/admin');
      } else {
        const data = await res.json();
        setError(data.error || 'Error al guardar el producto');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-grey-olive-50 dark:bg-grey-olive-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grey-olive-600 dark:border-grey-olive-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-olive-50 dark:bg-grey-olive-950 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin"
            className="flex items-center gap-2 text-grey-olive-600 dark:text-grey-olive-400 hover:text-grey-olive-800 dark:hover:text-grey-olive-300 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver
          </Link>
          <h1 className="text-3xl font-light text-foreground">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 text-red-600 p-4 mb-6 border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card shadow-sm p-8 space-y-6 border border-border">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Nombre del producto *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
              placeholder="Ej: Auriculares Premium"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Precio *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                placeholder="199.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
                placeholder="100"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Categoría *
            </label>
            <select
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              URL de la imagen *
            </label>
            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
              placeholder="Describe el producto..."
            />
          </div>

          {/* Rating & Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background text-foreground"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-grey-olive-600"
                />
                <span className="text-sm font-medium text-muted-foreground">Producto destacado</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          {formData.image && (
            <div className="border-t border-border pt-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Vista previa:</p>
              <img
                src={formData.image}
                alt="Preview"
                className="w-32 h-32 object-cover border border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128';
                }}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-border">
            <Link
              to="/admin"
              className="px-6 py-3 border border-border text-foreground hover:bg-grey-olive-50 dark:hover:bg-grey-olive-950 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-grey-olive-700 text-white hover:bg-grey-olive-800 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {saving ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
