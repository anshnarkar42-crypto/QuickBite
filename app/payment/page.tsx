'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useSupabase } from '@/hooks/use-supabase'
import { QrCode, Zap, CheckCircle, ArrowLeft } from 'lucide-react'

interface OrderData {
  items: Array<{
    menu_item_id: string
    quantity: number
    price_at_time: number
    name: string
  }>
  total_amount: number
}

export default function PaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useSupabase()

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [userPoints, setUserPoints] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [qrScanned, setQrScanned] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const stored = sessionStorage.getItem('pending_order')
        if (stored) {
          const parsed = JSON.parse(stored)
          setOrderData(parsed)
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('points')
            .eq('id', user.id)
            .single()

          setUserPoints(profile?.points || 0)
        }
      } catch (error) {
        console.error('[v0] Failed to load payment data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleQRScan = async () => {
    if (!orderData) return

    setQrScanned(true)
    setIsProcessing(true)

    try {
      // Simulate QR scan processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      // Deduct points from user
      const pointsToDeduct = Math.ceil(orderData.total_amount)
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ points: Math.max(0, userPoints - pointsToDeduct) })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: orderData.total_amount,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = orderData.items.map((item) => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price_at_time: item.price_at_time,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) throw itemsError

      setPaymentSuccess(true)
      sessionStorage.removeItem('pending_order')

      setTimeout(() => {
        router.push(`/orders/${order.id}`)
      }, 2000)
    } catch (error) {
      console.error('[v0] Payment error:', error)
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      })
      setQrScanned(false)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Loading payment page...</p>
        </div>
      </div>
    )
  }

  const pointsRequired = Math.ceil(orderData.total_amount)
  const hasEnoughPoints = userPoints >= pointsRequired
  const pointsShortage = Math.max(0, pointsRequired - userPoints)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="border-b bg-background/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Points Payment</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-3 border-b last:border-b-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      {(item.price_at_time * item.quantity).toFixed(0)} pts
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t border-border mt-3">
                  <p className="text-lg font-bold">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.ceil(orderData.total_amount)} pts
                  </p>
                </div>
              </div>
            </div>

            {/* Points Info */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="font-bold text-lg">Your Points</h3>
              </div>
              <p className="text-3xl font-bold mb-2">{userPoints}</p>
              {hasEnoughPoints ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  You have enough points to complete this order
                </p>
              ) : (
                <p className="text-sm text-destructive">
                  You need {pointsShortage} more points to complete this order
                </p>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center">
            {!paymentSuccess ? (
              <div className="w-full space-y-6">
                <div className="bg-card border-2 border-primary/30 rounded-lg p-8 flex flex-col items-center justify-center aspect-square">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center animate-pulse">
                    <QrCode className="w-20 h-20 text-primary-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Scan the QR code at the counter to complete payment
                  </p>
                </div>

                <Button
                  onClick={handleQRScan}
                  disabled={!hasEnoughPoints || isProcessing}
                  size="lg"
                  className="w-full gap-2 bg-gradient-to-r from-primary to-secondary"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5" />
                      Complete Payment with QR
                    </>
                  )}
                </Button>

                {!hasEnoughPoints && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
                    <p className="text-sm font-semibold text-destructive">
                      Insufficient Points
                    </p>
                    <p className="text-xs text-destructive/80 mt-1">
                      You need {pointsShortage} more points. Please try again later.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full space-y-6 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                  <p className="text-muted-foreground">
                    Your order has been placed and will be ready soon.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Points deducted: {Math.ceil(orderData.total_amount)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
