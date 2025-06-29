"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, MouseEvent } from 'react'

interface PrefetchLinkProps {
  href: string
  children: ReactNode
  className?: string
  prefetch?: boolean
  onHoverPrefetch?: boolean
  onClick?: () => void
  [key: string]: any
}

export function PrefetchLink({ 
  href, 
  children, 
  className, 
  prefetch = true,
  onHoverPrefetch = true,
  onClick,
  ...props 
}: PrefetchLinkProps) {
  const router = useRouter()

  const handleMouseEnter = () => {
    if (onHoverPrefetch) {
      // 预加载页面
      router.prefetch(href)
    }
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // 调用传入的 onClick 函数
    if (onClick) {
      onClick()
    }
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
} 