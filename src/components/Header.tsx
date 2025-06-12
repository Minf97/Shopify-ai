"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  ShoppingBag, 
  Search, 
  User, 
  Heart, 
  Github,
  Store,
  Menu,
  X
} from "lucide-react"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* 左侧：Logo 和导航 */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Store className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  ShopifyStore
                </span>
              </Link>

              {/* 主导航 - 在大屏幕上显示 */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/products" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  商品
                </Link>
                <Link 
                  href="/categories" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  分类
                </Link>
                <Link 
                  href="/collections" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  合集
                </Link>
                <Link 
                  href="/about" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  关于我们
                </Link>
              </nav>
            </div>

            {/* 中间：搜索框 - 在大屏幕上显示 */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="搜索商品..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
              </div>
            </div>

            {/* 右侧：功能按钮 */}
            <div className="flex items-center gap-2">
              {/* 搜索按钮 - 仅在小屏幕上显示 */}
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Search className="h-4 w-4" />
                <span className="sr-only">搜索</span>
              </Button>

              {/* 心愿单 */}
              <Button variant="ghost" size="icon" title="心愿单">
                <Heart className="h-4 w-4" />
                <span className="sr-only">心愿单</span>
              </Button>

              {/* 购物车 */}
              <Button variant="ghost" size="icon" title="购物车" className="relative">
                <ShoppingBag className="h-4 w-4" />
                {/* 购物车数量徽章 */}
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  2
                </span>
                <span className="sr-only">购物车</span>
              </Button>

              {/* 主题切换器 */}
              <ThemeToggle />

              {/* GitHub 按钮 */}
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
                title="查看 GitHub 仓库"
              >
                <Link 
                  href="https://github.com/shopify" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub 仓库</span>
                </Link>
              </Button>

              {/* 登录按钮 */}
              <Button variant="default" size="sm" asChild className="hidden sm:flex">
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  登录
                </Link>
              </Button>

              {/* 移动端菜单按钮 */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={toggleMobileMenu}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">菜单</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 移动端导航菜单 */}
      {isMobileMenuOpen && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
            onClick={closeMobileMenu}
          />
          
          {/* 侧边栏 */}
          <div className="fixed top-0 left-0 z-50 h-full w-80 bg-background border-r shadow-lg md:hidden">
            <div className="flex flex-col h-full p-6">
              {/* 头部 */}
              <div className="flex items-center justify-between mb-8">
                <Link 
                  href="/" 
                  className="flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <Store className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">ShopifyStore</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeMobileMenu}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 搜索框 */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="搜索商品..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
              </div>

              {/* 导航菜单 */}
              <nav className="space-y-2 mb-6">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  首页
                </Link>
                <Link
                  href="/products"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  商品
                </Link>
                <Link
                  href="/categories"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  分类
                </Link>
                <Link
                  href="/collections"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  合集
                </Link>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  关于我们
                </Link>
              </nav>

              {/* 分隔线 */}
              <div className="border-t my-4" />

              {/* 功能按钮 */}
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <Link href="/login" onClick={closeMobileMenu}>
                    <User className="h-4 w-4" />
                    登录 / 注册
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={closeMobileMenu}
                >
                  <Heart className="h-4 w-4" />
                  心愿单
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 relative"
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag className="h-4 w-4" />
                  购物车
                  <span className="absolute right-3 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
} 