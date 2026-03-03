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
    <Card className="border-none bg-gradient-to-r from-primary via-purple-600 to-secondary shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-8 overflow-hidden group">
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardContent className="pt-8 pb-8 px-6 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
        <div className="flex items-start md:items-center gap-5 flex-1">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-xl md:text-2xl text-white">{offer.title}</h3>
            <p className="text-sm md:text-base text-white/85">{offer.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-base md:text-lg px-4 py-2 font-black shadow-lg transform group-hover:scale-105 transition-transform">
            {discountDisplay}
          </Badge>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </Card>
  )
}
