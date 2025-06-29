export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题骨架 */}
        <div className="mb-8">
          <div className="h-8 bg-muted rounded-md w-48 mb-4 animate-pulse" />
          <div className="h-5 bg-muted rounded-md w-96 animate-pulse" />
        </div>
        
        {/* 分类网格骨架 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-muted rounded-md w-3/4 mb-3" />
              <div className="h-4 bg-muted rounded-md w-1/2 mb-4" />
              <div className="h-10 bg-muted rounded-md w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 