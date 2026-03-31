import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface WishlistButtonProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    rating: number;
  };
  size?: 'sm' | 'md' | 'lg';
}

export function WishlistButton({ product, size = 'md' }: WishlistButtonProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isActive = isInWishlist(product.id);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={`${sizeClasses[size]} flex items-center justify-center transition-all duration-200 ${
        isActive
          ? 'bg-red-50 dark:bg-red-950 text-red-500 border border-red-200 dark:border-red-800'
          : 'bg-card border border-border hover:border-grey-olive-500 text-muted-foreground hover:text-foreground'
      }`}
      title={isActive ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart
        size={iconSizes[size]}
        className={isActive ? 'fill-current' : ''}
      />
    </button>
  );
}
