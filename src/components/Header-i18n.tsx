"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { CartDrawer } from "@/components/cart-drawer"
import { SearchBox } from "@/components/search-box"
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
import { useParams } from "next/navigation"
import { type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n"
import { useCart } from "@/hooks/use-cart"

export function HeaderI18n() {
  const params = useParams()
  const locale = params.locale as Locale
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const { totalItems } = useCart()

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  if (!dict) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="h-6 w-6 animate-pulse bg-gray-300 rounded"></div>
            <div className="h-8 w-32 animate-pulse bg-gray-300 rounded"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link href={`/${locale}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Store className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Grace
                </span>
              </Link>

              {/* Main Navigation - Desktop */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href={`/${locale}/products`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.nav.products}
                </Link>
                <Link 
                  href={`/${locale}/categories`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.nav.categories}
                </Link>
                <Link 
                  href={`/${locale}/collections`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.nav.collections}
                </Link>
                <Link 
                  href={`/${locale}/about`}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {dict.nav.about}
                </Link>
              </nav>
            </div>

            {/* Center: Search Box - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <SearchBox 
                placeholder={dict.nav.search}
                className="w-full"
                onSearch={(query: string) => {
                  console.log('桌面端搜索:', query)
                  // 这里可以跳转到搜索结果页面
                }}
              />
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Search Button - Mobile Only */}
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Search className="h-4 w-4" />
                <span className="sr-only">{dict.nav.search}</span>
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" title={dict.nav.wishlist}>
                <Heart className="h-4 w-4" />
                <span className="sr-only">{dict.nav.wishlist}</span>
              </Button>

              {/* Shopping Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                title={dict.nav.cart} 
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-4 w-4" />
                {/* Cart Badge */}
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">{dict.nav.cart}</span>
              </Button>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* GitHub Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                asChild
                title="View GitHub Repository"
              >
                <Link 
                  href="https://github.com/shopify" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub Repository</span>
                </Link>
              </Button>

              {/* Login Button */}
              <Button variant="default" size="sm" asChild className="hidden sm:flex">
                <Link href={`/${locale}/login`}>
                  <User className="h-4 w-4 mr-2" />
                  {dict.nav.signIn}
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={toggleMobileMenu}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">{dict.common.menu}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" 
            onClick={closeMobileMenu}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 z-50 h-full w-80 bg-background border-r shadow-lg md:hidden">
            <div className="flex flex-col h-full p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <Link 
                  href={`/${locale}`}
                  className="flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <Store className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">Grace</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={closeMobileMenu}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Search Box */}
              <SearchBox 
                placeholder={dict.nav.search}
                className="mb-6"
                onSearch={(query: string) => {
                  console.log('移动端搜索:', query)
                  // 这里可以跳转到搜索结果页面
                }}
              />

              {/* Navigation Menu */}
              <nav className="space-y-2 mb-6">
                <Link
                  href={`/${locale}`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {dict.nav.home}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {dict.nav.products}
                </Link>
                <Link
                  href={`/${locale}/categories`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {dict.nav.categories}
                </Link>
                <Link
                  href={`/${locale}/collections`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {dict.nav.collections}
                </Link>
                <Link
                  href={`/${locale}/about`}
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  {dict.nav.about}
                </Link>
              </nav>

              {/* Login Button */}
              <Button asChild className="w-full">
                <Link href={`/${locale}/login`} onClick={closeMobileMenu}>
                  <User className="h-4 w-4 mr-2" />
                  {dict.nav.signIn}
                </Link>
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  )
} 