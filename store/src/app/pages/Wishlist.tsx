import { Link } from 'react-router';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function Wishlist() {
  const { wishlist, removeFromWishlist, wishlistCount } = useWishlist();
  const { addToCart } = useCart();

  const breadcrumbItems = [
    { label: 'Favoritos' },
  ];

  if (wishlistCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto text-grey-olive-300 mb-4" />
          <h2 className="text-3xl mb-4 text-foreground">Tu lista de favoritos está vacía</h2>
          <p className="text-muted-foreground mb-8">
            Guarda tus productos favoritos para verlos más tarde
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
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-4xl mb-4 text-foreground">Mis Favoritos</h1>
        <p className="text-muted-foreground">
          {wishlistCount} {wishlistCount === 1 ? 'producto' : 'productos'} guardados
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="bg-card border border-border overflow-hidden group">
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

            {/* Content */}
            <div className="p-4">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-sm mb-1 text-foreground hover:text-grey-olive-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground mb-3">{product.category}</p>

              <p className="text-lg text-foreground mb-4">${product.price.toFixed(2)}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-grey-olive-700 text-white py-2 hover:bg-grey-olive-800 transition-colors"
                >
                  <ShoppingCart size={16} />
                  Agregar
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="p-2 border border-border text-grey-olive-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  title="Eliminar de favoritos"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
