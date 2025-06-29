import { Skeleton } from "@/components/ui/skeleton"

interface ProductsGridSkeletonProps {
  count?: number
}

export function ProductsGridSkeleton({ count = 12 }: ProductsGridSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4">
          {/* Product Image Skeleton */}
          <Skeleton className="aspect-square rounded-2xl" />
          
          {/* Product Info Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
} 