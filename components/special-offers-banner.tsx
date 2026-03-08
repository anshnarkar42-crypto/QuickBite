'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, X } from 'lucide-react'

interface SpecialOffer {
  id: string
  title: string
  description: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  end_date: string
}

export function SpecialOffersBanner() {
  const [offers, setOffers] = useState<SpecialOffer[]>([])
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/special-offers')
      const data = await response.json()
      setOffers(data || [])
    } catch (error) {
      console.error('[v0] Error fetching offers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [offers])

  if (isLoading || offers.length === 0 || dismissed) return null

  const offer = offers[currentOfferIndex]
  const discountDisplay = 
    offer.discount_type === 'percentage'
      ? `${offer.discount_value}% OFF`
      : `₹${offer.discount_value} OFF`

  return (
    <Card className="border-none bg-gradient-to-r from-primary via-purple-600 to-secondary shadow-lg mb-8 overflow-hidden">
      <CardContent className="pt-6 pb-6 px-6 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg md:text-xl text-white">{offer.title}</h3>
            <p className="text-sm md:text-base text-white/85">{offer.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-base px-4 py-2 font-bold shadow-md">
            {discountDisplay}
          </Badge>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
