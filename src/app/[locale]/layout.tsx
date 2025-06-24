import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HeaderI18n } from "@/components/Header-i18n";
import { i18nConfig, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { Toaster } from "sonner";
import { CartProvider } from "@/hooks/use-cart";
import { LoadingBar } from "@/components/loading-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EliteStore - Premium Shopping Experience",
  description: "Discover curated premium products with an exceptional shopping experience. Built with Next.js and Shopify.",
};

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  const { locale } = await params;
  // 验证语言参数
  const validLocale = i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale;
  
  // 预加载字典数据
  await getDictionary(validLocale);

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="elite-store-theme"
        >
          <CartProvider>
            <LoadingBar />
            <div className="min-h-screen bg-background">
              <HeaderI18n />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </CartProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
} 