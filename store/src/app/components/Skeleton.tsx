interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-grey-olive-200 dark:bg-grey-olive-800 rounded ${className}`}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-card border border-border overflow-hidden">
      {/* Image placeholder */}
      <div className="aspect-square bg-grey-olive-200 dark:bg-grey-olive-800 animate-pulse" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <Skeleton className="h-4 w-20" />
        
        {/* Title */}
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        
        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full" />
          ))}
        </div>
        
        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-10 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

// Product Grid Skeleton
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-background min-h-screen">
      {/* Breadcrumbs */}
      <div className="flex gap-2 mb-8">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Back Button */}
      <Skeleton className="h-4 w-32 mb-8" />

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Image placeholder */}
        <div className="aspect-square bg-grey-olive-200 dark:bg-grey-olive-800 animate-pulse" />

        {/* Info */}
        <div className="space-y-6">
          {/* Rating */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 rounded-full" />
            ))}
          </div>

          {/* Title */}
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />

          {/* Category */}
          <Skeleton className="h-4 w-24" />

          {/* Price */}
          <Skeleton className="h-8 w-28" />

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-14 flex-1 rounded" />
            <Skeleton className="h-14 w-14 rounded" />
          </div>

          {/* Features */}
          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mb-16">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Filters Skeleton
export function FiltersSkeleton() {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <Skeleton className="h-12 w-full rounded" />
      
      {/* Filter toggle */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded" />
        <Skeleton className="h-10 w-32 rounded" />
      </div>
      
      {/* Filter panel */}
      <div className="bg-grey-olive-50 dark:bg-grey-olive-950 p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </div>
      </div>
      
      {/* Product count */}
      <Skeleton className="h-4 w-32" />
      
      {/* Products grid */}
      <ProductGridSkeleton count={8} />
    </div>
  );
}
