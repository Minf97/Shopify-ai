export default function CartLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题骨架 */}
        <div className="mb-8">
          <div className="h-6 bg-muted rounded-md w-32 mb-4 animate-pulse" />
          <div className="h-8 bg-muted rounded-md w-48 mb-2 animate-pulse" />
          <div className="h-5 bg-muted rounded-md w-24 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 购物车商品列表骨架 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-6 bg-muted rounded-md w-32 mb-6 animate-pulse" />
              
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-4 pb-6 border-b border-border animate-pulse">
                    <div className="w-24 h-24 bg-muted rounded-md flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 bg-muted rounded-md w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded-md w-1/2 mb-4" />
                      <div className="h-6 bg-muted rounded-md w-20 mb-4" />
                      <div className="flex items-center gap-3">
                        <div className="h-8 bg-muted rounded-md w-24" />
                        <div className="h-8 bg-muted rounded-md w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 购物车汇总骨架 */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="h-6 bg-muted rounded-md w-32 mb-6 animate-pulse" />
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 bg-muted rounded-md w-16" />
                  <div className="h-4 bg-muted rounded-md w-20" />
                </div>
                
                <div className="h-4 bg-muted rounded-md w-full" />
                
                <hr className="border-border" />
                
                <div className="flex justify-between">
                  <div className="h-5 bg-muted rounded-md w-16" />
                  <div className="h-5 bg-muted rounded-md w-20" />
                </div>
                
                <div className="h-12 bg-muted rounded-md w-full" />
                <div className="h-10 bg-muted rounded-md w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 