import { Link } from 'react-router';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';

export function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl mb-6">
              Descubre la Nueva Colección
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Productos premium seleccionados especialmente para ti. Calidad, estilo y innovación en cada artículo.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 hover:bg-gray-800 transition-colors"
            >
              Explorar Tienda
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-black text-white p-3">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2">Envío Gratis</h3>
                <p className="text-sm text-gray-600">
                  En pedidos superiores a $100
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-black text-white p-3">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2">Compra Segura</h3>
                <p className="text-sm text-gray-600">
                  Protección en cada transacción
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-black text-white p-3">
                <Headphones size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2">Soporte 24/7</h3>
                <p className="text-sm text-gray-600">
                  Atención al cliente siempre disponible
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl">Productos Destacados</h2>
            <Link
              to="/shop"
              className="text-sm hover:text-gray-600 transition-colors flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4">¿Listo para Comprar?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes satisfechos y descubre nuestra exclusiva colección de productos premium.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 hover:bg-gray-200 transition-colors"
          >
            Ir a la Tienda
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
