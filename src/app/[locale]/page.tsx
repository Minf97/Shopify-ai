import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  ShoppingCart
} from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { type Locale } from "@/lib/i18n/config";
import { fetchProductList } from "@/lib/shopify";

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
      products = productsResponse.body.data.products.edges.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        price: edge.node.priceRange.minVariantPrice.amount,
        image: edge.node.images.edges[0]?.node?.url || 'https://picsum.photos/400/400?random=1',
        handle: edge.node.handle,
        description: edge.node.description,
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {dict.hero.title}<br />
                <span className="text-gray-600">
                  {locale === 'zh' && '精选系列'}
                  {locale === 'ja' && 'キュレーションコレクション'}
                  {locale === 'en' && 'Curated Collection'}
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                {dict.hero.description}
              </p>
            </div>
            
            <Button 
              size="lg"
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-6 rounded-full font-medium"
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
            <div className="aspect-square bg-white rounded-3xl p-8 shadow-lg">
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
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {products.map((product: Product) => (
              <div key={product.id} className="group cursor-pointer">
                {/* Product Image */}
                <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Add to Cart Button */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <Button 
                      size="sm"
                      className="bg-white text-gray-900 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-lg"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {locale === 'zh' && '加入购物车'}
                      {locale === 'ja' && 'カートに追加'}
                      {locale === 'en' && 'Add to Cart'}
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 text-lg">
                    {product.title}
                  </h3>
                  <p className="font-semibold text-gray-900 text-xl">
                    ${product.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 