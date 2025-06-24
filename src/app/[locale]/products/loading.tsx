import { ProductsGridSkeleton } from '@/components/products-grid-skeleton'

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题骨架 */}
        <div className="mb-8">
          <div className="h-8 bg-muted rounded-md w-48 mb-4 animate-pulse" />
          <div className="h-5 bg-muted rounded-md w-96 animate-pulse" />
        </div>
        
        {/* 产品网格骨架 */}
        <ProductsGridSkeleton />
      </div>
    </div>
  )
} 