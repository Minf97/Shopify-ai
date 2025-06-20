"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Globe, ChevronDown } from "lucide-react"
import { i18nConfig, localeNames, type Locale } from "@/lib/i18n/config"
import { addLocaleToUrl, removeLocaleFromUrl, getLocaleFromUrl } from "@/lib/i18n"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = getLocaleFromUrl(pathname)
  const [isOpen, setIsOpen] = useState(false)

  const handleLocaleChange = (newLocale: Locale) => {
    const cleanPath = removeLocaleFromUrl(pathname)
    const newPath = addLocaleToUrl(cleanPath, newLocale)
    
    setIsOpen(false)
    router.push(newPath)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-8 px-3"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">
          {localeNames[currentLocale as keyof typeof localeNames]}
        </span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-20 min-w-[140px]">
            {i18nConfig.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                className={`
                  w-full px-3 py-2 text-left text-sm hover:bg-accent rounded-md transition-colors
                  ${currentLocale === locale ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}
                `}
              >
                                 {localeNames[locale as keyof typeof localeNames]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
} 