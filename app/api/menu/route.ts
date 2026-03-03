import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all menu items with their categories
    const { data: menuItems, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .eq('is_available', true)
      .order('category_id')

    if (error) {
      throw error
    }

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Menu API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}
