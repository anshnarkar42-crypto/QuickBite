import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

// Check admin authorization
async function isAdmin(supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single()

  return profile?.is_admin || false
}

export async function GET() {
  try {
    const supabase = await createClient()

    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: items, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .order('name')

    if (error) throw error

    return NextResponse.json(items)
  } catch (error) {
    console.error('Menu items admin API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!(await isAdmin(supabase))) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, price, category_id, is_available } = body

    if (!name || !price || !category_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: item, error } = await supabase
      .from('menu_items')
      .insert({
        name,
        description,
        price,
        category_id,
        is_available: is_available ?? true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Create menu item error:', error)
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}
