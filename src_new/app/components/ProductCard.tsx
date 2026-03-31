import { Link } from 'react-router';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white border border-gray-200 overflow-hidden transition-all hover:border-black">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(product.rating)
                    ? 'fill-black text-black'
                    : 'text-gray-300'
                }
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">({product.rating})</span>
          </div>

          <h3 className="text-sm mb-1">{product.name}</h3>
          <p className="text-xs text-gray-600 mb-3">{product.category}</p>

          <div className="flex items-center justify-between">
            <span className="text-lg">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="bg-black text-white p-2 hover:bg-gray-800 transition-colors"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
