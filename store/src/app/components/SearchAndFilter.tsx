import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  stock: number;
}

interface SearchAndFilterProps {
  products: Product[];
}

export function SearchAndFilter({ products }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'name'>('name');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['Todos', ...new Set(products.map(p => p.category))];
    return cats;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      const matchesStock = !inStockOnly || product.stock > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, minRating, inStockOnly, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setInStockOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'Todos' || priceRange[0] > 0 || priceRange[1] < 1000 || minRating > 0 || inStockOnly;

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-border focus:outline-none focus:border-grey-olive-500 bg-background"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border transition-colors ${
            showFilters ? 'bg-grey-olive-100 dark:bg-grey-olive-900 border-grey-olive-500' : 'border-border hover:border-grey-olive-500'
          }`}
        >
          <SlidersHorizontal size={18} />
          Filtros
        </button>

        {/* Category Pills */}
        {categories.slice(0, 5).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-grey-olive-700 text-white'
                : 'bg-card border border-border hover:border-grey-olive-500'
            }`}
          >
            {category}
          </button>
        ))}

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="ml-auto px-4 py-2 border border-border bg-card focus:outline-none focus:border-grey-olive-500"
        >
          <option value="name">Ordenar por Nombre</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="rating">Mejor Valorados</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-grey-olive-600 dark:text-grey-olive-400 hover:text-grey-olive-800 dark:hover:text-grey-olive-300 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-grey-olive-50 dark:bg-grey-olive-950 p-4 mb-6 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">Rango de Precio</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-24 px-3 py-2 border border-border bg-background text-sm"
                  placeholder="Min"
                />
                <span>-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-24 px-3 py-2 border border-border bg-background text-sm"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Calificación Mínima</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    className={`px-3 py-2 text-sm transition-colors ${
                      minRating === rating
                        ? 'bg-grey-olive-700 text-white'
                        : 'bg-card border border-border hover:border-grey-olive-500'
                    }`}
                  >
                    {rating === 0 ? 'Todos' : `${rating}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* All Categories */}
            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-border bg-card focus:outline-none focus:border-grey-olive-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Disponibilidad</label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-grey-olive-700"
                />
                <span className="text-sm">Solo con stock disponible</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-4">
        {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} encontrados
      </p>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron productos con los filtros seleccionados</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-grey-olive-600 dark:text-grey-olive-400 hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard 
                product={product} 
                onQuickView={() => setQuickViewProduct(product)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
