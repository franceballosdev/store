import { Link } from 'react-router';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { Product } from '../context/CartContext';
import { useCart } from '../context/CartContext';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="group">
      <div className="bg-card border border-border overflow-hidden transition-all hover:border-grey-olive-500 relative">
        {/* Image */}
        <Link to={`/product/${product.id}`} className="block">
          <div className="aspect-square overflow-hidden bg-grey-olive-50 dark:bg-grey-olive-950">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView();
            }}
            className="absolute top-3 right-3 p-2 bg-background/90 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            title="Vista rápida"
          >
            <Eye size={18} className="text-foreground" />
          </button>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton product={product} size="sm" />
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
                    ? 'fill-grey-olive-500 text-grey-olive-500'
                    : 'text-grey-olive-200 dark:text-grey-olive-800'
                }
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm mb-1 text-foreground hover:text-grey-olive-600 transition-colors">{product.name}</h3>
          </Link>
          <p className="text-xs text-muted-foreground mb-3">{product.category}</p>

          <div className="flex items-center justify-between">
            <span className="text-lg text-foreground">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="bg-grey-olive-600 text-white p-2 hover:bg-grey-olive-700 transition-colors"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
