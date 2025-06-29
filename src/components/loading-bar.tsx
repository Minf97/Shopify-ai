"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function LoadingBar() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 路径变化时显示加载状态
    setLoading(true)
    
    // 模拟加载完成
    const timer = setTimeout(() => {
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-muted overflow-hidden">
        <div className="h-full bg-primary animate-pulse" 
             style={{
               animation: 'loading-bar 1s ease-in-out infinite'
             }}
        />
      </div>
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; margin-left: 0px; margin-right: 100%; }
          50% { width: 75%; margin-left: 25%; margin-right: 0%; }
          100% { width: 100%; margin-left: 0px; margin-right: 0%; }
        }
      `}</style>
    </div>
  )
} 