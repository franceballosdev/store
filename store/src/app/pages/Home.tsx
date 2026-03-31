import { Link } from 'react-router';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useState, useEffect } from 'react';
import { Product } from '../context/CartContext';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then(res => res.json())
      .then(data => {
        setFeaturedProducts(data.slice(0, 4));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-grey-olive-100 dark:bg-grey-olive-950 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl mb-6 text-foreground">
              Descubre la Nueva Colección
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Productos premium seleccionados especialmente para ti. Calidad, estilo e innovación en cada artículo.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-grey-olive-700 text-white px-8 py-4 hover:bg-grey-olive-800 transition-colors"
            >
              Explorar Tienda
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-grey-olive-700 text-white p-3">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2 text-foreground">Envío Gratis</h3>
                <p className="text-sm text-muted-foreground">
                  En pedidos superiores a $100
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-grey-olive-700 text-white p-3">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2 text-foreground">Compra Segura</h3>
                <p className="text-sm text-muted-foreground">
                  Protección en cada transacción
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-grey-olive-700 text-white p-3">
                <Headphones size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2 text-foreground">Soporte 24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Atención al cliente siempre disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl text-foreground">Productos Destacados</h2>
            <Link
              to="/shop"
              className="text-sm text-grey-olive-600 dark:text-grey-olive-400 hover:text-grey-olive-800 dark:hover:text-grey-olive-300 transition-colors flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grey-olive-600 dark:border-grey-olive-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-grey-olive-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4">¿Listo para Comprar?</h2>
          <p className="text-xl text-grey-olive-200 mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes satisfechos y descubre nuestra exclusiva colección de productos premium.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-grey-olive-600 text-white px-8 py-4 hover:bg-grey-olive-500 transition-colors"
          >
            Ir a la Tienda
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
