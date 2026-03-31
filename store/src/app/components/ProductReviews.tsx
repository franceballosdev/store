import { useState, useEffect } from 'react';
import { Star, User, Calendar } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const { token, isAuthenticated, user } = useAuth();

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviews(data.reviews);
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      showToast('Inicia sesión para dejar una reseña', 'warning');
      return;
    }

    if (!newReview.comment.trim()) {
      showToast('Por favor escribe un comentario', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment
        })
      });

      if (res.ok) {
        const data = await res.json();
        
        // Add new review to list
        const review: Review = {
          id: data.id || Date.now(),
          product_id: productId,
          user_id: user?.id || 0,
          user_name: user?.name || 'Usuario',
          rating: newReview.rating,
          comment: newReview.comment,
          created_at: new Date().toISOString()
        };
        
        setReviews([review, ...reviews]);
        setNewReview({ rating: 5, comment: '' });
        showToast('¡Reseña enviada exitosamente!', 'success');
        
        // Refresh stats
        const statsRes = await fetch(`/api/products/${productId}/reviews`);
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats);
        }
      } else {
        const error = await res.json();
        showToast(error.error || 'Error al enviar reseña', 'error');
      }
    } catch (err) {
      showToast('Error de conexión', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = stats?.average_rating || 0;
  const totalReviews = stats?.total_reviews || 0;

  const ratingDistribution = [
    { stars: 5, count: stats?.five_star || 0 },
    { stars: 4, count: stats?.four_star || 0 },
    { stars: 3, count: stats?.three_star || 0 },
    { stars: 2, count: stats?.two_star || 0 },
    { stars: 1, count: stats?.one_star || 0 }
  ];

  return (
    <div className="mt-12 border-t border-border pt-8">
      <h2 className="text-2xl mb-6">Reseñas de Clientes</h2>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-grey-olive-50 dark:bg-grey-olive-950 p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(averageRating)
                        ? 'fill-grey-olive-500 text-grey-olive-500'
                        : 'text-grey-olive-200 dark:text-grey-olive-800'
                    }
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          {ratingDistribution.map(({ stars, count }) => {
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2 text-sm mb-1">
                <span className="w-3">{stars}</span>
                <Star size={14} className="text-grey-olive-500" />
                <div className="flex-1 h-2 bg-grey-olive-100 dark:bg-grey-olive-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-grey-olive-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-muted-foreground">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Add Review Form */}
        <div className="border border-border p-6">
          <h3 className="text-lg mb-4">Escribir una Reseña</h3>
            {!isAuthenticated ? (
              <p className="text-center text-muted-foreground">
                <a href="/login" className="text-grey-olive-600 hover:underline">Inicia sesión</a> para dejar una reseña
              </p>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Calificación</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating })}
                        className="transition-colors"
                      >
                        <Star
                          size={24}
                          className={
                            rating <= newReview.rating
                              ? 'fill-grey-olive-500 text-grey-olive-500'
                              : 'text-grey-olive-200 dark:text-grey-olive-800'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Tu reseña</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-border focus:outline-none focus:border-grey-olive-500 bg-background"
                    placeholder="¿Qué te pareció el producto?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-grey-olive-700 text-white py-2 hover:bg-grey-olive-800 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                </button>
              </form>
            )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center text-muted-foreground py-8">Cargando reseñas...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Sé el primero en dejar una reseña
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-grey-olive-100 dark:bg-grey-olive-900 rounded-full flex items-center justify-center">
                    <User size={20} className="text-grey-olive-600 dark:text-grey-olive-400" />
                  </div>
                  <div>
                    <p className="font-medium">{review.user_name}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? 'fill-grey-olive-500 text-grey-olive-500'
                              : 'text-grey-olive-200 dark:text-grey-olive-800'
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar size={14} />
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
