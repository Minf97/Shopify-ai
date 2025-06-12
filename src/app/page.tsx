"use client";

import { fetchProductList } from "@/lib/shopify";
import { useEffect, useState } from "react";
import { Product } from "@/types/shopify";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Star, 
  Truck, 
  Shield, 
  Play,
  TrendingUp,
  Zap,
  Award,
  Eye,
  Heart,
  ShoppingCart,
  Users,
  Filter
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchProductList().then((res) => {
      if (res.status === 200 && res.body?.data?.products?.edges) {
        setProducts(res.body.data.products.edges.map(edge => edge.node));
      }
      setLoading(false);
    });
  }, []);

  const categories = ['all', 'featured', 'trending', 'new', 'sale'];
  const featuredProducts = products.slice(0, 4);
  const trendingProducts = products.slice(4, 12);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Compact Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: "var(--elite-gradient-primary)",
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(5, 7, 17, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(58, 64, 80, 0.1) 0%, transparent 50%)
            `
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-[var(--elite-border)] mb-6">
            <TrendingUp className="h-4 w-4 text-[var(--elite-strong)] mr-2" />
            <span className="text-sm font-medium text-[var(--elite-strong)]">Top 1% Premium Products</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 elite-text-gradient leading-tight">
            Elite Store
          </h1>
          <p className="text-xl text-[var(--elite-normal)] mb-8 max-w-2xl mx-auto font-light">
            Curated excellence for the discerning few. Premium products that define luxury.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              size="lg" 
              className="elite-button-primary px-8 py-3 text-base font-medium"
              asChild
            >
              <Link href="/products">
                <Zap className="mr-2 h-5 w-5" />
                Explore Collection
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-[var(--elite-border-strong)] text-[var(--elite-strong)] hover:bg-[var(--elite-strong)] hover:text-white px-8 py-3"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Story
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-6 border-b border-[var(--elite-border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--elite-strong)]">10K+</div>
              <div className="text-sm text-[var(--elite-normal)]">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--elite-strong)]">500+</div>
              <div className="text-sm text-[var(--elite-normal)]">Premium Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--elite-strong)]">4.9★</div>
              <div className="text-sm text-[var(--elite-normal)]">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--elite-strong)]">24/7</div>
              <div className="text-sm text-[var(--elite-normal)]">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Compact Grid */}
      {!loading && featuredProducts.length > 0 && (
        <section className="py-12 elite-surface">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold elite-text-gradient mb-2">Featured Collection</h2>
                <p className="text-[var(--elite-normal)]">Handpicked for excellence</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/products">View All</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="elite-card p-4 group">
                  {/* Product Image */}
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    {product.images.edges.length > 0 && (
                      <Image
                        src={product.images.edges[0].node.url}
                        alt={product.images.edges[0].node.altText || product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Badge */}
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-[var(--elite-strong)] text-white px-2 py-1 rounded-full text-xs font-medium">
                        <Award className="h-3 w-3 inline mr-1" />
                        Best Seller
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-[var(--elite-strong)] line-clamp-1 text-sm">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs text-[var(--elite-normal)] ml-1">(4.8)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--elite-strong)] text-lg">
                        ${product.priceRange.minVariantPrice.amount}
                      </span>
                      <Button size="sm" className="h-7 px-3 text-xs">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter & Products Grid */}
      {!loading && trendingProducts.length > 0 && (
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            {/* Category Filter */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold elite-text-gradient">Shop by Category</h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--elite-normal)]" />
                <div className="flex gap-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveCategory(category)}
                      className="capitalize text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Compact Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {trendingProducts.map((product, index) => (
                <div key={product.id} className="elite-card p-3 group">
                  {/* Compact Image */}
                  <div className="relative aspect-square mb-3 overflow-hidden rounded-md bg-gray-100">
                    {product.images.edges.length > 0 && (
                      <Image
                        src={product.images.edges[0].node.url}
                        alt={product.images.edges[0].node.altText || product.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" className="h-6 w-6 p-0">
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Trending Badge */}
                    {index < 3 && (
                      <div className="absolute top-1 left-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                        HOT
                      </div>
                    )}
                  </div>

                  {/* Compact Info */}
                  <div className="space-y-1">
                    <h3 className="font-medium text-[var(--elite-strong)] line-clamp-2 text-xs leading-tight">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[var(--elite-strong)] text-sm">
                        ${product.priceRange.minVariantPrice.amount}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-[var(--elite-normal)] ml-0.5">4.8</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full h-6 text-xs">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compact Features */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-t border-[var(--elite-border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="elite-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--elite-strong)] to-[var(--elite-muted)] text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-[var(--elite-strong)] mb-2">Free Express Delivery</h3>
              <p className="text-[var(--elite-normal)] text-sm">Fast & secure shipping worldwide</p>
            </div>

            <div className="elite-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--elite-strong)] to-[var(--elite-muted)] text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-[var(--elite-strong)] mb-2">Premium Warranty</h3>
              <p className="text-[var(--elite-normal)] text-sm">Complete protection & peace of mind</p>
            </div>

            <div className="elite-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--elite-strong)] to-[var(--elite-muted)] text-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-[var(--elite-strong)] mb-2">24/7 Expert Support</h3>
              <p className="text-[var(--elite-normal)] text-sm">Always here to help you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Newsletter */}
      <section className="py-12 bg-gradient-to-br from-[var(--elite-strong)] to-[var(--elite-muted)] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Zap className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Exclusive Access</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Elite Circle
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Get early access to new arrivals, exclusive deals, and insider insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <Button size="lg" variant="secondary" className="px-6 bg-white text-[var(--elite-strong)] hover:bg-white/90">
              <ArrowRight className="h-4 w-4 mr-2" />
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[var(--elite-strong)] border-t-transparent mb-4"></div>
              <p className="text-[var(--elite-normal)]">Curating premium products...</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
