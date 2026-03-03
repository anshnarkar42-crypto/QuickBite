'use client'

import { MenuItemCard } from '@/components/menu-item-card'
import { CartSidebar, type CartItem } from '@/components/cart-sidebar'
import { SpecialOffersBanner } from '@/components/special-offers-banner'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useSupabase } from '@/hooks/use-supabase'
import { LogOut, UtensilsCrossed, Clock, Zap, TrendingUp, Trophy } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  is_available: boolean
  category_id: string
}

interface Category {
  id: string
  name: string
}

export default function DashboardPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useSupabase()

  useEffect(() => {
    fetchMenu()
    fetchCategories()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await fetch('/api/menu')
      if (!response.ok) throw new Error('Failed to fetch menu')
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error('Error fetching menu:', error)
      toast({
        title: 'Error',
        description: 'Failed to load menu items',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    const existingItem = cart.find((ci) => ci.menu_item_id === item.id)

    if (existingItem) {
      setCart(
        cart.map((ci) =>
          ci.menu_item_id === item.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        )
      )
    } else {
      setCart([
        ...cart,
        {
          id: Math.random().toString(),
          name: item.name,
          price: item.price,
          quantity,
          menu_item_id: item.id,
        },
      ])
    }

    toast({
      title: 'Added to cart',
      description: `${item.name} added to your cart`,
    })
  }

  const handleRemoveFromCart = (itemId: string) => {
    setCart(cart.filter((ci) => ci.id !== itemId))
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

      if (totalAmount <= 0) {
        throw new Error('Invalid cart total')
      }

      const orderData = {
        items: cart.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price_at_time: item.price,
          name: item.name,
        })),
        total_amount: totalAmount,
      }

      // Store order data in sessionStorage and redirect to payment page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pending_order', JSON.stringify(orderData))
      }

      router.push('/payment')
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to proceed to payment',
        variant: 'destructive',
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const filteredItems =
    selectedCategory === 'all'
      ? menuItems
      : menuItems.filter((item) => item.category_id === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-gradient-to-r from-primary via-purple-600 to-secondary shadow-lg z-40">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">QuickBite</h1>
              <p className="text-xs text-white/80 font-semibold">Fresh Food, Fast Delivery</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold"
              onClick={() => router.push('/leaderboard')}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* Special Offers Banner */}
        <div className="mb-10">
          <SpecialOffersBanner />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="group bg-gradient-to-br from-primary via-purple-500 to-purple-600 rounded-2xl p-6 flex items-start gap-4 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/90 font-semibold">Available Items</p>
              <p className="text-3xl font-black">{filteredItems.length}</p>
            </div>
          </div>
          <div className="group bg-gradient-to-br from-secondary via-orange-400 to-orange-500 rounded-2xl p-6 flex items-start gap-4 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/90 font-semibold">Items in Cart</p>
              <p className="text-3xl font-black">{cart.length}</p>
            </div>
          </div>
          <div className="group bg-gradient-to-br from-accent via-yellow-400 to-yellow-500 rounded-2xl p-6 flex items-start gap-4 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-colors">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/90 font-semibold">Estimated Wait</p>
              <p className="text-3xl font-black">~15 min</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-8 space-y-4">
          <div>
            <h2 className="text-3xl font-black text-foreground mb-2">Browse Menu</h2>
            <p className="text-muted-foreground text-sm">Discover our fresh and delicious offerings</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-muted/50 p-4 rounded-xl">
            <label className="text-sm font-semibold text-foreground whitespace-nowrap">Filter by Category:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-72 h-11 bg-background border-2 border-primary/30 rounded-lg font-medium">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Menu Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 border-4 border-transparent border-t-primary border-r-secondary rounded-full animate-spin"></div>
            </div>
            <p className="text-lg font-semibold text-foreground mb-2">Loading delicious menu...</p>
            <p className="text-sm text-muted-foreground">Hold tight, we're preparing something tasty!</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border-2 border-dashed border-muted">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-10 h-10 text-primary/60" />
            </div>
            <p className="text-lg font-semibold text-foreground">No items available</p>
            <p className="text-sm text-muted-foreground mt-2">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {filteredItems.map((item, idx) => (
              <div key={item.id} style={{ animationDelay: `${idx * 50}ms` }} className="animate-in fade-in zoom-in duration-300">
                <MenuItemCard
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        items={cart}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        isLoading={isCheckingOut}
      />
    </div>
  )
}
