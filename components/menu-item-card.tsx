'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Star, Check } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  is_available: boolean
}

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem, quantity: number) => void
}

export function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart(item, quantity)
    setQuantity(1)
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-border/30 hover:border-primary/50 bg-card/80 backdrop-blur-sm">
      {item.image_url ? (
        <div className="relative w-full h-56 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">Sold Out</span>
            </div>
          )}
          {item.is_available && (
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-56 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center group">
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Star className="w-16 h-16 text-primary/40 group-hover:text-primary/60 transition-colors" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex-1">
          <CardTitle className="text-lg font-bold line-clamp-2">{item.name}</CardTitle>
          <CardDescription className="line-clamp-2 text-xs mt-2 text-muted-foreground/80">
            {item.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">₹</span>
          <p className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{item.price.toFixed(0)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-4 border-t border-border/30 bg-muted/20">
        <div className="flex items-center gap-2 flex-1 bg-background rounded-lg p-1.5 border border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            disabled={!item.is_available}
          >
            −
          </Button>
          <span className="flex-1 text-center text-sm font-bold">{quantity}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setQuantity(quantity + 1)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            disabled={!item.is_available}
          >
            +
          </Button>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={!item.is_available}
          className="flex-1 gap-2 font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-lg shadow-md"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
