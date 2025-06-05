"use client";

import { fetchProductList } from "@/lib/shopify";
import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import { Product } from "@/types/shopify";
import Image from "next/image";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxSteps: 5,
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductList().then((res) => {
      console.log(res, "res");
      if (res.status === 200 && res.body?.data?.products?.edges) {
        setProducts(res.body.data.products.edges.map(edge => edge.node));
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左侧商品区域 */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">商品展示</h1>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">加载中...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* 商品图片 */}
                {product.images.edges.length > 0 && (
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={product.images.edges[0].node.url}
                      alt={product.images.edges[0].node.altText || product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      width={200}
                      height={200}
                    />
                  </div>
                )}
                
                {/* 商品信息 */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {product.description}
                    </p>
                  )}
                  
                  {/* 价格 */}
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-blue-600">
                      {product.priceRange.minVariantPrice.currencyCode} {product.priceRange.minVariantPrice.amount}
                    </span>
                    
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      查看详情
                    </button>
                  </div>
                  
                  {/* 标签 */}
                  {product.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 右侧AI聊天区域 */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-blue-50">
          <h2 className="text-lg font-semibold text-gray-800">AI 助手</h2>
          <p className="text-sm text-gray-600">有什么可以帮助您的？</p>
        </div>
        
        {/* 聊天消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text":
                      return <div key={`${message.id}-${i}`} className="whitespace-pre-wrap">{part.text}</div>;
                    case "tool-invocation":
                      return (
                        <pre key={`${message.id}-${i}`} className="text-xs bg-gray-900 text-green-400 p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(part.toolInvocation, null, 2)}
                        </pre>
                      );
                  }
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 输入框 */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={input}
              placeholder="输入消息..."
              onChange={handleInputChange}
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!input.trim()}
            >
              发送
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
