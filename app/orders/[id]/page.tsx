'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSupabase } from '@/hooks/use-supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle, Clock, Flame, Package } from 'lucide-react'

interface OrderItem {
  menu_item_id: string
  quantity: number
  price: number
  menu_items: {
    name: string
  }
}

interface Order {
  id: string
  status: string
  total_amount: number
  created_at: string
  order_items: OrderItem[]
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = useSupabase()

  useEffect(() => {
    fetchOrder()
    
    // Auto-refresh order status every 3 seconds
    const interval = setInterval(fetchOrder, 3000)
    return () => clearInterval(interval)
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, menu_items(name))')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setOrder(data)
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500 animate-spin" />
      case 'preparing':
        return <Flame className="w-6 h-6 text-orange-500" />
      case 'ready':
        return <Package className="w-6 h-6 text-green-500" />
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />
      default:
        return <Clock className="w-6 h-6 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 border-yellow-200'
      case 'preparing':
        return 'bg-orange-50 border-orange-200'
      case 'ready':
        return 'bg-green-50 border-green-200'
      case 'completed':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-muted'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Order Confirmed',
      preparing: 'Being Prepared',
      ready: 'Ready for Pickup',
      completed: 'Order Completed',
    }
    return labels[status] || status
  }

  const statuses = ['pending', 'preparing', 'ready', 'completed']
  const currentStatusIndex = statuses.indexOf(order?.status || 'pending')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <Button variant="outline" asChild>
            <Link href="/orders">Back to Orders</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading order...</p>
          </div>
        ) : !order ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Order not found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Status Card with Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Status */}
                <div className={`p-4 rounded-lg border-2 ${getStatusColor(order.status)}`}>
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Current Status</p>
                      <p className="text-2xl font-bold">{getStatusLabel(order.status)}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.status === 'pending' && 'Your order has been confirmed. Preparation starting soon.'}
                        {order.status === 'preparing' && 'Our team is preparing your delicious order!'}
                        {order.status === 'ready' && '✓ Your order is ready! Please pick it up at the counter.'}
                        {order.status === 'completed' && 'Thank you for your order!'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">Order Timeline</p>
                  <div className="space-y-3">
                    {statuses.map((status, idx) => (
                      <div key={status} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          idx <= currentStatusIndex
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {idx < currentStatusIndex ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-medium">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            idx <= currentStatusIndex
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          }`}>
                            {getStatusLabel(status)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                <CardDescription>
                  Placed on {formatDate(order.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Items</h4>
                  <div className="space-y-2">
                    {order.order_items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.menu_items.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" asChild>
                <Link href="/orders">View All Orders</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/dashboard">Order More</Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
