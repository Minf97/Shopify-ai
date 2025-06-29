"use client"

import { User, LogOut, ShoppingBag, Heart, Settings, Package } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserMenuProps {
  dict: Record<string, any>
  locale: string
  isMobile?: boolean
  onItemClick?: () => void
}

export function UserMenu({ dict, locale, isMobile = false, onItemClick }: UserMenuProps) {
  const { user, loading, signOut, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center">
        <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
      </div>
    )
  }

  if (!isAuthenticated) {
    if (isMobile) {
      return (
        <Button asChild className="w-full">
          <Link href={`/${locale}/login`} onClick={onItemClick}>
            <User className="h-4 w-4 mr-2" />
            {dict.nav.signIn}
          </Link>
        </Button>
      )
    }

    return (
      <Button variant="default" size="sm" asChild className="hidden sm:flex">
        <Link href={`/${locale}/login`}>
          <User className="h-4 w-4 mr-2" />
          {dict.nav.signIn}
        </Link>
      </Button>
    )
  }

  // 获取用户名的首字母作为头像
  const getUserInitials = (email?: string, name?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return 'U'
  }

  const userInitials = getUserInitials(user?.email, user?.user_metadata?.full_name)
  const userName = user?.user_metadata?.full_name || user?.email || 'User'

  if (isMobile) {
    return (
      <div className="space-y-2">
        {/* 用户信息 */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{userName}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
          </div>
        </div>

        {/* 菜单项 */}
        <div className="space-y-1">
          <Link
            href={`/${locale}/profile`}
            onClick={onItemClick}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            <User className="h-4 w-4" />
            {dict.nav.profile}
          </Link>
          <Link
            href={`/${locale}/orders`}
            onClick={onItemClick}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            <Package className="h-4 w-4" />
            {dict.nav.orders}
          </Link>
          <Link
            href={`/${locale}/wishlist`}
            onClick={onItemClick}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            <Heart className="h-4 w-4" />
            {dict.nav.wishlist}
          </Link>
          <Link
            href={`/${locale}/account`}
            onClick={onItemClick}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
          >
            <Settings className="h-4 w-4" />
            {dict.nav.account}
          </Link>
          <button
            onClick={() => {
              signOut()
              onItemClick?.()
            }}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            {dict.nav.signOut}
          </button>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{dict.nav.profile}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/orders`} className="cursor-pointer">
            <Package className="mr-2 h-4 w-4" />
            <span>{dict.nav.orders}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/wishlist`} className="cursor-pointer">
            <Heart className="mr-2 h-4 w-4" />
            <span>{dict.nav.wishlist}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/account`} className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>{dict.nav.account}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{dict.nav.signOut}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 