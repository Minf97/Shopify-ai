"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { useParams } from "next/navigation"
import { type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n"

interface SearchSuggestion {
  id: string
  title: string
  category: string
  handle: string
  image?: string
}

interface SearchBoxProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
}

// Mock 数据 - 当 API 不可用时使用
const MOCK_SUGGESTIONS: SearchSuggestion[] = [
  // 鞋子分类
  { id: '1', title: 'Nike Air Max 90', category: '运动鞋', handle: 'nike-air-max-90', image: 'https://picsum.photos/100/100?random=1' },
  { id: '2', title: 'Adidas Ultraboost', category: '运动鞋', handle: 'adidas-ultraboost', image: 'https://picsum.photos/100/100?random=2' },
  { id: '3', title: '经典帆布鞋', category: '休闲鞋', handle: 'canvas-shoes', image: 'https://picsum.photos/100/100?random=3' },
  { id: '4', title: '商务皮鞋', category: '正装鞋', handle: 'business-shoes', image: 'https://picsum.photos/100/100?random=4' },
  
  // 衣服分类
  { id: '5', title: '纯棉白T恤', category: 'T恤', handle: 'white-tshirt', image: 'https://picsum.photos/100/100?random=5' },
  { id: '6', title: '牛仔夹克', category: '外套', handle: 'denim-jacket', image: 'https://picsum.photos/100/100?random=6' },
  { id: '7', title: '羊毛毛衣', category: '毛衫', handle: 'wool-sweater', image: 'https://picsum.photos/100/100?random=7' },
  { id: '8', title: '休闲衬衫', category: '衬衫', handle: 'casual-shirt', image: 'https://picsum.photos/100/100?random=8' },
  
  // 配饰分类
  { id: '9', title: '真皮钱包', category: '钱包', handle: 'leather-wallet', image: 'https://picsum.photos/100/100?random=9' },
  { id: '10', title: '时尚手表', category: '手表', handle: 'fashion-watch', image: 'https://picsum.photos/100/100?random=10' },
  { id: '11', title: '太阳镜', category: '眼镜', handle: 'sunglasses', image: 'https://picsum.photos/100/100?random=11' },
  { id: '12', title: '运动背包', category: '包包', handle: 'sport-backpack', image: 'https://picsum.photos/100/100?random=12' },
]

// Mock 热门分类
const MOCK_POPULAR_CATEGORIES = [
  { name: '运动鞋', count: 2, handle: 'sports-shoes' },
  { name: 'T恤', count: 1, handle: 'tshirts' },
  { name: '外套', count: 1, handle: 'jackets' },
  { name: '包包', count: 1, handle: 'bags' },
]

interface ApiResponse {
  suggestions: SearchSuggestion[]
  collections: Array<{
    id: string
    title: string
    handle: string
    description: string
    image?: string
    type: string
  }>
  popular: Array<{
    name: string
    handle: string
    count: number
  }>
}

export function SearchBox({ placeholder, className = "", onSearch }: SearchBoxProps) {
  const params = useParams()
  const locale = params.locale as Locale
  const [dict, setDict] = useState<Record<string, any> | null>(null)
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [popularCategories, setPopularCategories] = useState<Array<{ name: string; count: number; handle: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  // 监听点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 获取搜索建议 (真实 API 或 Mock 数据)
  const fetchSuggestions = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim())
      }
      
      const response = await fetch(`/api/search/suggestions?${params}`)
      const data: ApiResponse = await response.json()
      
      if (response.ok) {
        setSuggestions(data.suggestions || [])
        if (data.popular && data.popular.length > 0) {
          setPopularCategories(data.popular)
        } else {
          setPopularCategories(MOCK_POPULAR_CATEGORIES)
        }
      } else {
        // API 失败时使用 Mock 数据
        console.warn('API failed, using mock data')
        setSuggestions(filterMockSuggestions(searchQuery))
        setPopularCategories(MOCK_POPULAR_CATEGORIES)
      }
    } catch (error) {
      console.warn('API error, using mock data:', error)
      // 网络错误时使用 Mock 数据
      setSuggestions(filterMockSuggestions(searchQuery))
      setPopularCategories(MOCK_POPULAR_CATEGORIES)
    } finally {
      setIsLoading(false)
    }
  }

  // Mock 数据过滤逻辑
  const filterMockSuggestions = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return MOCK_SUGGESTIONS.slice(0, 8) // 显示热门商品
    }

    return MOCK_SUGGESTIONS.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8)
  }

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    fetchSuggestions(value)
  }

  // 处理搜索提交
  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      onSearch?.(finalQuery.trim())
      setIsOpen(false)
      // 这里可以跳转到搜索结果页面
      console.log('搜索:', finalQuery)
    }
  }

  // 处理建议点击
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    handleSearch(suggestion.title)
  }

  // 按分类分组建议
  const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
    const category = suggestion.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(suggestion)
    return groups
  }, {} as Record<string, SearchSuggestion[]>)

  if (!dict) return null

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true)
            fetchSuggestions(query)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSearch()
            } else if (e.key === 'Escape') {
              setIsOpen(false)
            }
          }}
          placeholder={placeholder || dict.search?.placeholder || dict.nav?.search || '搜索商品...'}
          className="w-full pl-10 pr-10 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              fetchSuggestions('')
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 搜索建议下拉框 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {query ? dict.search?.noResults || '没有找到相关商品' : dict.search?.startTyping || '开始输入以搜索商品'}
            </div>
          ) : (
            <div className="py-2">
              {/* 显示热门分类 (仅在无搜索词时) */}
              {!query.trim() && (
                <div className="px-4 py-2 border-b">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">{dict.search?.popularCategories || '热门分类'}</h4>
                  <div className="flex flex-wrap gap-2">
                    {popularCategories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => handleSearch(category.name)}
                        className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
                      >
                        {category.name} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 按分类显示商品建议 */}
              {Object.entries(groupedSuggestions).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                    {category}
                  </div>
                  {items.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      {/* 商品图片 */}
                      {suggestion.image && (
                        <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                          <img
                            src={suggestion.image}
                            alt={suggestion.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      {/* 商品信息 */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {suggestion.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {suggestion.category}
                        </div>
                      </div>

                      {/* 搜索图标 */}
                      <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 