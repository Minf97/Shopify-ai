"use client";

import { fetchProductList } from "@/lib/shopify";
import { useEffect, useState } from "react";
import { Product } from "@/types/shopify";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
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
  Users
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";
import { useParams } from "next/navigation";

export default function HomePage() {
  const params = useParams();
  const locale = params.locale as Locale;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // 加载翻译和产品数据
    Promise.all([
      getDictionary(locale),
      fetchProductList()
    ]).then(([dictionary, productsRes]) => {
      setDict(dictionary);
      
      if (productsRes.status === 200 && productsRes.body?.data?.products?.edges) {
        setProducts(productsRes.body.data.products.edges.map(edge => edge.node));
      }
      setLoading(false);
    });
  }, [locale]);

  const featuredProducts = products.slice(0, 4);

  if (!dict) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

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
            <span className="text-sm font-medium text-[var(--elite-strong)]">{dict.hero.tagline}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-4 elite-text-gradient leading-tight">
            {dict.hero.title}
          </h1>
          <p className="text-xl text-[var(--elite-normal)] mb-8 max-w-2xl mx-auto font-light">
            {dict.hero.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button 
              size="lg" 
              className="elite-button-primary px-8 py-3 text-base font-medium"
              asChild
            >
              <Link href={`/${locale}/products`}>
                <Zap className="mr-2 h-5 w-5" />
                {dict.hero.exploreCollection}
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-[var(--elite-border-strong)] text-[var(--elite-strong)] hover:bg-[var(--elite-strong)] hover:text-white px-8 py-3"
            >
              <Play className="mr-2 h-5 w-5" />
              {dict.hero.watchStory}
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
              <div className="text-sm text-[var(--elite-normal)]">{dict.stats.customers}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--elite-strong)]">500+</div>
              <div className="text-sm text-[var(--elite-normal)]">{dict.stats.products}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--elite-strong)]">4.9★</div>
              <div className="text-sm text-[var(--elite-normal)]">{dict.stats.rating}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--elite-strong)]">24/7</div>
              <div className="text-sm text-[var(--elite-normal)]">{dict.stats.support}</div>
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
                <h2 className="text-3xl font-bold elite-text-gradient mb-2">{dict.sections.featuredCollection}</h2>
                <p className="text-[var(--elite-normal)]">{dict.sections.handpicked}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/${locale}/products`}>{dict.sections.viewAll}</Link>
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
                        {dict.sections.bestSeller}
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
                        {dict.sections.addToCart}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{dict.features.freeShipping}</h3>
              <p className="text-muted-foreground text-sm">{dict.features.freeShippingDesc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{dict.features.securePayment}</h3>
              <p className="text-muted-foreground text-sm">{dict.features.securePaymentDesc}</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{dict.features.customerSupport}</h3>
              <p className="text-muted-foreground text-sm">{dict.features.customerSupportDesc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 