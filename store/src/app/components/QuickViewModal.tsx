import { useState } from 'react';
import { Link } from 'react-router';
import { X, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

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

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="relative bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
        >
          <X size={20} className="text-foreground" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Image */}
          <div className="aspect-square bg-grey-olive-50 dark:bg-grey-olive-950 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-grey-olive-500 text-grey-olive-500'
                      : 'text-grey-olive-200 dark:text-grey-olive-800'
                  }
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">({product.rating})</span>
            </div>

            <h2 className="text-2xl font-medium text-foreground mb-2">{product.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{product.category}</p>

            <p className="text-3xl text-grey-olive-600 dark:text-grey-olive-400 mb-4">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-muted-foreground mb-6 line-clamp-3">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-muted-foreground">Cantidad:</span>
              <div className="flex items-center border border-border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-grey-olive-50 dark:hover:bg-grey-olive-950 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 text-foreground min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-grey-olive-50 dark:hover:bg-grey-olive-950 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} disponibles
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-grey-olive-700 text-white py-3 px-6 hover:bg-grey-olive-800 transition-colors"
              >
                <ShoppingCart size={20} />
                Agregar al Carrito
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-3 border transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-500'
                    : 'border-border hover:border-grey-olive-500'
                }`}
              >
                <Star size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Link to full product page */}
            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="mt-4 text-center text-sm text-grey-olive-600 dark:text-grey-olive-400 hover:text-grey-olive-800 dark:hover:text-grey-olive-300 transition-colors"
            >
              Ver detalles completos →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
