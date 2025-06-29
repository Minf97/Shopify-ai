'use client'

import { login, signup, signInWithGitHub, signInWithGoogle } from './actions'
import { getDictionary } from '@/lib/i18n'
import { useParams } from 'next/navigation'
import { type Locale } from '@/lib/i18n/config'
import { useEffect, useState } from 'react'
import { Store, Mail, Lock, Github } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const params = useParams()
  const locale = params.locale as Locale
  const [dict, setDict] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    getDictionary(locale).then(setDict)
  }, [locale])

  if (!dict) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <Store className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Grace
            </span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            {dict.auth.welcomeBack}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {dict.auth.signInDescription}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-6 space-y-6">
          {/* Login Form */}
          <form className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                {dict.auth.email}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {dict.auth.password}
                </label>
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  {dict.auth.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
                  placeholder="••••••••••"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                {dict.auth.rememberMe}
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3">
              <Button 
                formAction={login}
                type="submit" 
                className="w-full"
              >
                {dict.auth.signIn}
              </Button>
              
              <Button 
                formAction={signup}
                type="submit" 
                variant="outline"
                className="w-full"
              >
                {dict.auth.createAccount}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{dict.auth.orContinueWith}</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <form action={signInWithGitHub}>
              <Button 
                type="submit"
                variant="outline"
                className="w-full"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </form>
            
            <form action={signInWithGoogle}>
              <Button 
                type="submit"
                variant="outline"
                className="w-full"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {dict.auth.dontHaveAccount}{' '}
            <Link
              href={`/${locale}/signup`}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {dict.auth.signUpHere}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}