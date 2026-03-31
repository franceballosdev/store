import { useParams, Link } from 'react-router';
import { Star, ShoppingCart, ArrowLeft, Truck, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductReviews } from '../components/ProductReviews';
import { WishlistButton } from '../components/WishlistButton';
import { ProductDetailSkeleton } from '../components/Skeleton';

export function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Fetch product details
    fetch(`/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(productData => {
        setProduct(productData);
        
        // Fetch related products from same category
        return fetch(`/api/products?category=${productData.category}`);
      })
      .then(res => res.json())
      .then(allProducts => {
        const related = allProducts
          .filter((p: Product) => p.category === product?.category && p.id !== Number(id))
          .slice(0, 4);
        setRelatedProducts(related);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product:', err);
        setLoading(false);
      });
  }, [id, product?.category]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

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

  const breadcrumbItems = product
    ? [
        { label: 'Tienda', path: '/shop' },
        { label: product.category, path: `/shop?category=${product.category}` },
        { label: product.name },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />
      {/* Back Button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-grey-olive-600 dark:text-grey-olive-400 hover:text-grey-olive-800 dark:hover:text-grey-olive-300 mb-8"
      >
        <ArrowLeft size={16} />
        Volver a la tienda
      </Link>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image */}
        <div className="bg-grey-olive-50 dark:bg-grey-olive-950">
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
                    ? 'fill-grey-olive-500 text-grey-olive-500'
                    : 'text-grey-olive-200 dark:text-grey-olive-800'
                }
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">({product.rating} estrellas)</span>
          </div>

          <h1 className="text-4xl mb-4 text-foreground">{product.name}</h1>
          <p className="text-sm text-muted-foreground mb-6">{product.category}</p>

          <p className="text-3xl mb-8 text-grey-olive-600 dark:text-grey-olive-400">${product.price.toFixed(2)}</p>

          <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-grey-olive-700 text-white py-4 px-6 hover:bg-grey-olive-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Agregar al Carrito
            </button>
            <WishlistButton product={product} size="lg" />
          </div>

          {/* Features */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-grey-olive-600 dark:text-grey-olive-400" />
              <div>
                <p className="text-sm text-foreground">Envío gratis en pedidos +$100</p>
                <p className="text-xs text-muted-foreground">Entrega en 3-5 días hábiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-grey-olive-600 dark:text-grey-olive-400" />
              <div>
                <p className="text-sm text-foreground">Devolución gratis en 30 días</p>
                <p className="text-xs text-muted-foreground">Sin preguntas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl mb-8 text-foreground">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Product Reviews */}
      {product && <ProductReviews productId={product.id} />}
    </div>
  );
}
