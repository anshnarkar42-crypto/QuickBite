'use client'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingCart, Trash2, Package, Clock, Users } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  menu_item_id: string
}

interface CartSidebarProps {
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
  isLoading?: boolean
}

export function CartSidebar({
  items,
  onRemoveItem,
  onCheckout,
  isLoading,
}: CartSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [scheduledTime, setScheduledTime] = useState('')
  const [groupCode, setGroupCode] = useState('')
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          size="lg" 
          className="fixed bottom-6 right-6 rounded-full shadow-lg hover:shadow-xl transition-shadow gap-2 bg-gradient-to-r from-primary to-secondary"
        >
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <span className="absolute -top-3 -right-3 bg-accent text-accent-foreground rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold animate-pulse">
              {itemCount}
            </span>
          )}
          <span className="hidden sm:inline">Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col p-0">
        <SheetHeader className="border-b px-6 py-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Your Order
          </SheetTitle>
          <SheetDescription>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} ready to order
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-8 h-8 text-primary/50" />
            </div>
            <p className="text-muted-foreground text-center">Your cart is empty</p>
            <p className="text-xs text-muted-foreground/70 px-4 text-center">Add items from the menu to get started</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-br from-card to-muted/50 border border-border/50 rounded-lg hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.quantity} × ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-bold text-sm text-primary">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t bg-muted/50 px-6 py-4 space-y-4">
              <div className="flex items-center justify-between gap-2 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Estimated delivery
                </div>
                <span className="font-semibold text-sm">~15 min</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-semibold text-muted-foreground">Total Amount</span>
                <span className="text-3xl font-bold text-primary">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

              {/* Order Type Options */}
              <div className="flex gap-2">
                <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 text-xs bg-transparent"
                      disabled={items.length === 0}
                    >
                      <Clock className="w-3 h-3" />
                      Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Schedule Your Order</DialogTitle>
                      <DialogDescription>
                        Choose when you'd like to pick up your order
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="time">Pickup Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          if (scheduledTime) {
                            setShowScheduleDialog(false)
                            // Store scheduled time and proceed with checkout
                            sessionStorage.setItem('scheduled_time', scheduledTime)
                            onCheckout()
                          }
                        }}
                        className="w-full"
                      >
                        Schedule Order
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={showGroupDialog} onOpenChange={setShowGroupDialog}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1 text-xs bg-transparent"
                      disabled={items.length === 0}
                    >
                      <Users className="w-3 h-3" />
                      Group Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Group Order</DialogTitle>
                      <DialogDescription>
                        Create or join a group order with friends
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="code">Group Code (or leave blank to create new)</Label>
                        <Input
                          id="code"
                          placeholder="Enter group code or leave blank"
                          value={groupCode}
                          onChange={(e) => setGroupCode(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {groupCode ? 'Joining existing group order' : 'Creating new group order'}
                      </p>
                      <Button
                        onClick={() => {
                          setShowGroupDialog(false)
                          // Store group code and proceed with checkout
                          if (!groupCode) {
                            // Generate new group code
                            const newCode = 'GRP' + Math.random().toString(36).substr(2, 9).toUpperCase()
                            sessionStorage.setItem('group_code', newCode)
                          } else {
                            sessionStorage.setItem('group_code', groupCode)
                          }
                          onCheckout()
                        }}
                        className="w-full"
                      >
                        {groupCode ? 'Join Group' : 'Create Group'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Button
                onClick={onCheckout}
                disabled={items.length === 0 || isLoading}
                className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4" />
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
