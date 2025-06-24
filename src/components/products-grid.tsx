"use client"

import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  title: string
  price: string
  image: string
  handle: string
  description: string
  variants?: Array<{
    id: string
    title: string
    price: string
    available: boolean
  }>
}

interface ProductsGridProps {
  products: Product[]
  locale: string
}

export function ProductsGrid({ products, locale }: ProductsGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          locale={locale}
        />
      ))}
    </div>
  )
} 