import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { Filter } from 'lucide-react';

export function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<string>('featured');

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  let filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl mb-4">Nuestra Tienda</h1>
        <p className="text-gray-600">Explora nuestra colección completa de productos premium</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 pb-8 border-b border-gray-200">
        <div className="flex items-center gap-2 flex-1">
          <Filter size={20} className="text-gray-600" />
          <span className="text-sm">Categoría:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-black text-white'
                    : 'bg-white border border-gray-200 hover:border-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 text-sm focus:outline-none focus:border-black"
          >
            <option value="featured">Destacados</option>
            <option value="price-low">Precio: Menor a Mayor</option>
            <option value="price-high">Precio: Mayor a Menor</option>
            <option value="rating">Mejor Valorados</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Results Count */}
      <div className="mt-8 text-center text-sm text-gray-600">
        Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
      </div>
    </div>
  );
}
