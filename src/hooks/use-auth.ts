"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查环境变量是否配置
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase environment variables not configured, auth disabled')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      // 获取初始用户状态
      const getUser = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          setUser(user)
        } catch (error) {
          console.error('Error getting user:', error)
        } finally {
          setLoading(false)
        }
      }

      getUser()

      // 监听认证状态变化
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          setLoading(false)
          
          // 认证状态变化时更新状态，不需要刷新页面
          console.log('Auth state changed:', event, session?.user?.email)
        }
      )

      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Supabase client creation failed:', error)
      setLoading(false)
    }
  }, [])

  // 登出函数
  const signOut = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn('Supabase not configured, cannot sign out')
      return
    }

    try {
      setLoading(true)
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user
  }
} 