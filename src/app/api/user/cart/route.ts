import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - 获取用户的购物车
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    const { data: cartData, error } = await supabase
      .from('user_carts')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      return NextResponse.json(
        { error: '获取购物车失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      cart: cartData || null
    })

  } catch (error) {
    console.error('Error fetching user cart:', error)
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    )
  }
}

// POST - 保存/更新用户的购物车
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { shopifyCartId, cartData } = body

    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    // 检查是否已有购物车记录
    const { data: existingCart } = await supabase
      .from('user_carts')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let result

    if (existingCart) {
      // 更新现有购物车
      result = await supabase
        .from('user_carts')
        .update({
          shopify_cart_id: shopifyCartId,
          cart_data: cartData,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCart.id)
    } else {
      // 创建新的购物车记录
      result = await supabase
        .from('user_carts')
        .insert({
          user_id: user.id,
          shopify_cart_id: shopifyCartId,
          cart_data: cartData
        })
    }

    if (result.error) {
      return NextResponse.json(
        { error: '保存购物车失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '购物车已同步'
    })

  } catch (error) {
    console.error('Error saving user cart:', error)
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    )
  }
} 