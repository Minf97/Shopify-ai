import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Chat Interface Skeleton */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
            </div>

            {/* Quick Replies */}
            <div className="p-4 border-b">
              <Skeleton className="h-4 w-24 mb-3" />
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-8 w-30" />
              </div>
            </div>

            {/* Messages */}
            <div className="p-4 space-y-4 h-96">
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-16 w-64 rounded-2xl" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-12 w-48 rounded-2xl" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-20 w-72 rounded-2xl" />
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Skeleton className="flex-1 h-12 rounded-xl" />
                <Skeleton className="h-12 w-16 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 