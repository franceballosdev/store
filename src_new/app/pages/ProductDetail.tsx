import { useParams, Link } from 'react-router';
import { Star, ShoppingCart, ArrowLeft, Truck, RotateCcw } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl mb-4">Producto no encontrado</h2>
        <Link to="/shop" className="text-sm hover:underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8"
      >
        <ArrowLeft size={16} />
        Volver a la tienda
      </Link>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image */}
        <div className="bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={
                  i < Math.floor(product.rating)
                    ? 'fill-black text-black'
                    : 'text-gray-300'
                }
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">({product.rating} estrellas)</span>
          </div>

          <h1 className="text-4xl mb-4">{product.name}</h1>
          <p className="text-sm text-gray-600 mb-6">{product.category}</p>

          <p className="text-3xl mb-8">${product.price.toFixed(2)}</p>

          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-4 px-6 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mb-6"
          >
            <ShoppingCart size={20} />
            Agregar al Carrito
          </button>

          {/* Features */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-gray-600" />
              <div>
                <p className="text-sm">Envío gratis en pedidos +$100</p>
                <p className="text-xs text-gray-600">Entrega en 3-5 días hábiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-gray-600" />
              <div>
                <p className="text-sm">Devolución gratis en 30 días</p>
                <p className="text-xs text-gray-600">Sin preguntas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-3xl mb-8">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
