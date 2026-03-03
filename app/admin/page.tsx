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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSupabase } from '@/hooks/use-supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogOut, Plus, Trash2, Clock, Flame, Package, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@supabase/supabase-js' // Import createClient

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  is_available: boolean
  category_id: string
  categories: {
    name: string
  }
}

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
  user_profiles: {
    full_name: string
  }
  order_items: OrderItem[]
}

export default function AdminDashboard() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('orders')
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useSupabase() // Use the imported createClient

  useEffect(() => {
    checkAdmin()
  }, [])

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    // Note: In production, verify admin status from user metadata or profiles table
    fetchData()
  }

  const fetchData = async () => {
    try {
      const [ordersRes, menuRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/menu-items'),
      ])

      if (ordersRes.status === 403 || menuRes.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive',
        })
        router.push('/dashboard')
        return
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }

      if (menuRes.ok) {
        const menuData = await menuRes.json()
        setMenuItems(menuData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update order')

      const updatedOrder = await response.json()
      setOrders(orders.map((o) => (o.id === orderId ? updatedOrder : o)))
      toast({
        title: 'Success',
        description: 'Order status updated',
      })
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await fetch(`/api/admin/menu-items/${itemId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete item')

      setMenuItems(menuItems.filter((item) => item.id !== itemId))
      toast({
        title: 'Success',
        description: 'Menu item deleted',
      })
    } catch (error) {
      console.error('Error deleting item:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete menu item',
        variant: 'destructive',
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
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
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage menu and orders</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="kitchen">Kitchen Display</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="menu">Menu Items</TabsTrigger>
            </TabsList>

            {/* Kitchen Display Tab */}
            <TabsContent value="kitchen" className="mt-6">
              <div className="space-y-4">
                {/* Kitchen Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Pending Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{orders.filter(o => o.status === 'pending').length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Preparing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-orange-600">{orders.filter(o => o.status === 'preparing').length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Ready</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === 'ready').length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.status === 'completed').length}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Kitchen Kanban Board */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {['pending', 'preparing', 'ready', 'completed'].map((status) => (
                    <div key={status} className="space-y-3">
                      <div className="flex items-center gap-2 pb-3 border-b">
                        {status === 'pending' && <Clock className="w-5 h-5 text-yellow-500" />}
                        {status === 'preparing' && <Flame className="w-5 h-5 text-orange-500" />}
                        {status === 'ready' && <Package className="w-5 h-5 text-green-500" />}
                        {status === 'completed' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                        <h3 className="font-semibold capitalize">{status}</h3>
                      </div>
                      <div className="space-y-3">
                        {orders.filter(o => o.status === status).map((order) => (
                          <Card key={order.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-sm">Order #{order.id.slice(0, 8)}</CardTitle>
                                  <CardDescription className="text-xs">{order.user_profiles.full_name}</CardDescription>
                                </div>
                                <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString()}</span>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="text-sm space-y-1 bg-muted p-2 rounded">
                                {order.order_items.map((item, idx) => (
                                  <div key={idx} className="flex justify-between">
                                    <span>{item.quantity}x {item.menu_items.name}</span>
                                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(0)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-1">
                                {status !== 'completed' && (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="flex-1 text-xs"
                                    onClick={() => {
                                      const nextStatus = status === 'pending' ? 'preparing' : status === 'preparing' ? 'ready' : 'completed'
                                      handleUpdateOrderStatus(order.id, nextStatus)
                                    }}
                                  >
                                    Next
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {orders.filter(o => o.status === status).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No orders
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6 mt-6">
              {orders.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Orders</CardTitle>
                    <CardDescription>
                      No orders have been placed yet
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>
                              Order #{order.id.slice(0, 8)}
                            </CardTitle>
                            <CardDescription>
                              {order.user_profiles.full_name} • {formatDate(order.created_at)}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Items</h4>
                          <ul className="space-y-1">
                            {order.order_items.map((item, idx) => (
                              <li
                                key={idx}
                                className="text-sm text-muted-foreground"
                              >
                                {item.quantity}x {item.menu_items.name} - ₹
                                {(item.price * item.quantity).toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-t pt-4 flex justify-between items-center">
                          <span className="font-medium">Total</span>
                          <span className="text-lg font-bold text-primary">
                            ₹{order.total_amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={
                              order.status === 'pending' ? 'default' : 'outline'
                            }
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'pending')
                            }
                          >
                            Pending
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              order.status === 'ready' ? 'default' : 'outline'
                            }
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'ready')
                            }
                          >
                            Ready
                          </Button>
                          <Button
                            size="sm"
                            variant={
                              order.status === 'completed'
                                ? 'default'
                                : 'outline'
                            }
                            onClick={() =>
                              handleUpdateOrderStatus(order.id, 'completed')
                            }
                          >
                            Completed
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Menu Items Tab */}
            <TabsContent value="menu" className="space-y-6 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Menu Items</h2>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {menuItems.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Items</CardTitle>
                    <CardDescription>
                      Add menu items to get started
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription>
                              {item.categories?.name}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={item.is_available ? 'default' : 'secondary'}>
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </Badge>
                            <span className="text-xl font-bold text-primary">
                              ₹{item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteMenuItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}
