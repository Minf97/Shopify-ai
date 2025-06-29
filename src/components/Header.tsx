"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { CartDrawer } from "@/components/cart-drawer"
import { useCart } from "@/hooks/use-cart"
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
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const { totalItems } = useCart()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleCartDrawer = () => {
    setIsCartDrawerOpen(!isCartDrawerOpen)
  }

  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Store className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  EliteStore
                </span>
              </Link>

              {/* Main Navigation - Desktop */}
              <nav className="hidden md:flex items-center gap-6">
                <Link 
                  href="/products" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Products
                </Link>
                <Link 
                  href="/categories" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Categories
                </Link>
                <Link 
                  href="/collections" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Collections
                </Link>
                <Link 
                  href="/faq" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
                <Link 
                  href="/test_rag" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  RAG Test
                </Link>
                <Link 
                  href="/about" 
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </nav>
            </div>

            {/* Center: Search Box - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Search Button - Mobile Only */}
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" title="Wishlist">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Wishlist</span>
              </Button>

              {/* Shopping Cart */}
              <Button 
                variant="ghost" 
                size="icon" 
                title="Shopping Cart" 
                className="relative"
                onClick={toggleCartDrawer}
              >
                <ShoppingBag className="h-4 w-4" />
                {/* Cart Badge */}
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Button>

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
                <Link href="/login">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
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
                <span className="sr-only">Menu</span>
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
                  href="/" 
                  className="flex items-center gap-2"
                  onClick={closeMobileMenu}
                >
                  <Store className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">EliteStore</span>
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
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2 mb-6">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Products
                </Link>
                <Link
                  href="/categories"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/collections"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Collections
                </Link>
                <Link
                  href="/faq"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/test_rag"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  RAG Test
                </Link>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  About
                </Link>
              </nav>

              {/* Divider */}
              <div className="border-t my-4" />

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <Link href="/login" onClick={closeMobileMenu}>
                    <User className="h-4 w-4" />
                    Sign In / Sign Up
                  </Link>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3"
                  onClick={closeMobileMenu}
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-3 relative"
                  onClick={() => {
                    closeMobileMenu()
                    toggleCartDrawer()
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Shopping Cart
                  {totalItems > 0 && (
                    <span className="absolute right-3 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
    </>
  )
} 