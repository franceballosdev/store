import { useState, useEffect } from 'react';
import { SearchAndFilter } from '../components/SearchAndFilter';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FiltersSkeleton } from '../components/Skeleton';
import { Product } from '../context/CartContext';
import { API_BASE_URL } from '../config/api';

export function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todos']);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        const uniqueCategories = ['Todos', ...Array.from(new Set(data.map(p => p.category)))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

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

  const breadcrumbItems = [
    { label: 'Tienda' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl mb-4 text-foreground">Nuestra Tienda</h1>
        <p className="text-muted-foreground">Explora nuestra colección completa de productos premium</p>
      </div>

      {/* Search and Filter */}
      {loading ? (
        <FiltersSkeleton />
      ) : (
        <SearchAndFilter products={products} />
      )}
    </div>
  );
}
