import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 在构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在构建时忽略 TypeScript 错误  
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  // 性能优化配置
  experimental: {
    // 启用优化的包导入
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  // 编译优化
  compiler: {
    // 移除 console.log (仅在生产环境)
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
