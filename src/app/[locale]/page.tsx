import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";
import { fetchProductList } from "@/lib/shopify";
import { ProductsGrid } from "@/components/products-grid";

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  handle: string;
  description: string;
}

export default async function HomePage({ params }: { params: { locale: Locale } }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  // Fetch real products from Shopify
  let products: Product[] = [];
  try {
    const productsResponse = await fetchProductList();
    if (productsResponse.status === 200 && productsResponse.body?.data?.products?.edges) {
      products = productsResponse.body.data.products.edges.map((edge: { node: any }) => ({
        id: edge.node.id,
        title: edge.node.title,
        price: edge.node.priceRange.minVariantPrice.amount,
        image: edge.node.images.edges[0]?.node?.url || 'https://picsum.photos/400/400?random=1',
        handle: edge.node.handle,
        description: edge.node.description,
        variants: edge.node.variants?.edges?.map((variantEdge: { node: any }) => ({
          id: variantEdge.node.id,
          title: variantEdge.node.title,
          price: variantEdge.node.price.amount,
          available: variantEdge.node.availableForSale,
        })) || []
      }));
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data
    products = [
      {
        id: '1',
        title: 'Sunbeam Tote Jeff',
        price: '25.00',
        image: 'https://picsum.photos/400/400?random=1',
        handle: 'sunbeam-tote-jeff',
        description: 'Beautiful tote bag',
      },
      {
        id: '2',
        title: 'ShadowStride Shoes',
        price: '20.00',
        image: 'https://picsum.photos/400/400?random=2',
        handle: 'shadowstride-shoes',
        description: 'Comfortable shoes',
      },
      {
        id: '3',
        title: 'Horizon Gaze Sunglasses',
        price: '20.00',
        image: 'https://picsum.photos/400/400?random=3',
        handle: 'horizon-gaze-sunglasses',
        description: 'Stylish sunglasses',
      },
    ];
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 py-20 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {dict.hero.title}<br />
                <span className="text-muted-foreground">
                  {locale === 'zh' && '精选系列'}
                  {locale === 'ja' && 'キュレーションコレクション'}
                  {locale === 'en' && 'Curated Collection'}
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {dict.hero.description}
              </p>
            </div>
            
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/80 active:bg-primary/70 text-primary-foreground px-8 py-6 rounded-full font-medium transition-colors duration-200 cursor-pointer"
              asChild
            >
              <Link href={`/${locale}/products`} className="inline-flex items-center gap-2">
                {locale === 'zh' && '立即购买'}
                {locale === 'ja' && '今すぐ購入'}
                {locale === 'en' && 'Shop Now'}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-square bg-card rounded-3xl p-8 shadow-lg border border-border hover:border-border/60 transition-colors duration-200">
              <div className="relative w-full h-full">
                <Image
                  src="https://picsum.photos/600/600?random=hero"
                  alt="Featured Product"
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {locale === 'zh' && '精选商品'}
              {locale === 'ja' && '厳選商品'}
              {locale === 'en' && 'Featured Products'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {locale === 'zh' && '发现我们精心挑选的优质商品'}
              {locale === 'ja' && '厳選された高品質な商品をご覧ください'}
              {locale === 'en' && 'Discover our carefully curated selection of premium products'}
            </p>
          </div>

          <ProductsGrid products={products} locale={locale} />
        </div>
      </section>
    </div>
  );
} 