import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码都是必需的' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // 如果用户创建成功，同时在用户表中创建记录
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || '',
          avatar_url: '',
          locale: 'zh'
        })

      if (insertError) {
        console.error('Error inserting user:', insertError)
      }
    }

    return NextResponse.json({
      user: data.user,
      session: data.session,
      message: '注册成功！请检查您的邮箱进行验证。'
    })

  } catch (error) {
    console.error('Error signing up:', error)
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    )
  }
} 