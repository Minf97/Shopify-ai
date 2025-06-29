import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码都是必需的' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    // 检查用户是否存在于用户表中，如果不存在则创建
    if (data.user) {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || '',
          avatar_url: data.user.user_metadata?.avatar_url || '',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })

      if (upsertError) {
        console.error('Error upserting user:', upsertError)
      }
    }

    return NextResponse.json({
      user: data.user,
      session: data.session
    })

  } catch (error) {
    console.error('Error signing in:', error)
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    )
  }
} 