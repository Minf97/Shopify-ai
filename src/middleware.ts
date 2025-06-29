import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { i18nConfig } from '@/lib/i18n/config'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const search = request.nextUrl.search
  
  // 跳过 API 路由和静态文件
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    console.log('pathname', pathname);
    
    return await updateSession(request)
  }

  // 检查路径是否已经包含有效的语言前缀
  const pathnameHasLocale = i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  

  // 如果路径没有语言前缀，重定向到带默认语言的路径
  if (!pathnameHasLocale) {
    const defaultLocale = i18nConfig.defaultLocale
    
    // 构建新的URL，保留查询参数
    let redirectPath: string
    
    if (pathname === '/') {
      // 根路径重定向到 /en
      redirectPath = `/${defaultLocale}`
    } else {
      // 其他路径添加语言前缀，如 /products -> /en/products
      redirectPath = `/${defaultLocale}${pathname}`
    }
    
    // 保留查询参数
    const redirectUrl = new URL(redirectPath + search, request.url)
    
    console.log(`Redirecting from ${pathname}${search} to ${redirectPath}${search}`)
    
    return NextResponse.redirect(redirectUrl, { status: 307 })
  }

  // 验证语言代码是否有效
  const segments = pathname.split('/')
  const localeSegment = segments[1]
  
  if (localeSegment && !i18nConfig.locales.includes(localeSegment)) {
    // 如果语言代码无效，重定向到默认语言
    const cleanPath = '/' + segments.slice(2).join('/')
    const redirectPath = `/${i18nConfig.defaultLocale}${cleanPath === '/' ? '' : cleanPath}`
    const redirectUrl = new URL(redirectPath + search, request.url)
    
    console.log(`Invalid locale ${localeSegment}, redirecting to ${redirectPath}${search}`)
    
    return NextResponse.redirect(redirectUrl, { status: 307 })
  }

  // 只有在路径已经有有效语言前缀时才进行 Supabase 会话检查
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - Files with extensions (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ico)$).*)',
  ],
}