'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/hooks/use-supabase'
import Link from 'next/link'
import { Trophy, Star, Zap } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  email: string
  full_name: string
  points: number
  loyalty_tier: string
  total_orders: number
  rank: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabase()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Fetch leaderboard from view
      const { data, error } = await supabase
        .from('points_leaderboard')
        .select('*')
        .limit(50)

      if (error) throw error

      const entries = data?.map((item: any) => ({
        ...item,
        email: item.email || 'Student',
        full_name: item.full_name || item.email || 'Anonymous',
      })) || []

      setLeaderboard(entries)

      // Find current user's rank
      if (user && entries.length > 0) {
        const userEntry = entries.find((e: any) => e.id === user.id)
        setUserRank(userEntry || null)
      }
    } catch (error) {
      console.error('[v0] Error fetching leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'bg-orange-100 text-orange-800'
      case 'silver':
        return 'bg-gray-100 text-gray-800'
      case 'gold':
        return 'bg-yellow-100 text-yellow-800'
      case 'platinum':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Trophy className="w-5 h-5 text-orange-400" />
    return <Star className="w-5 h-5 text-primary" />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Leaderboard</h1>
              <p className="text-xs text-muted-foreground">Top point holders</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User's Rank Card */}
            {userRank && (
              <Card className="border-primary bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Zap className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Your Rank</p>
                        <p className="text-2xl font-bold">#{userRank.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Points</p>
                      <p className="text-2xl font-bold text-primary">{userRank.points}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Points collected by students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No leaderboard data available</p>
                  ) : (
                    leaderboard.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        {/* Rank */}
                        <div className="w-12 flex items-center justify-center">
                          <div className="flex items-center gap-2">
                            {getRankIcon(entry.rank)}
                            <span className="text-lg font-bold text-muted-foreground">#{entry.rank}</span>
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <p className="font-semibold">{entry.full_name}</p>
                          <p className="text-xs text-muted-foreground">{entry.email}</p>
                        </div>

                        {/* Tier */}
                        <Badge className={getTierBadgeColor(entry.loyalty_tier)}>
                          {entry.loyalty_tier.charAt(0).toUpperCase() + entry.loyalty_tier.slice(1)}
                        </Badge>

                        {/* Stats */}
                        <div className="flex items-center gap-6 text-right">
                          <div>
                            <p className="text-xs text-muted-foreground">Orders</p>
                            <p className="text-lg font-bold">{entry.total_orders}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Points</p>
                            <p className="text-xl font-bold text-primary">{entry.points}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Tiers Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loyalty Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier) => (
                    <div key={tier} className={`p-4 rounded-lg ${getTierBadgeColor(tier.toLowerCase())}`}>
                      <p className="font-semibold">{tier}</p>
                      <p className="text-xs mt-2">Earn more points to level up!</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
