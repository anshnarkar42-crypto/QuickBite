import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingCart, UtensilsCrossed, Clock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">QuickBite</h1>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero Content */}
        <section className="py-20 text-center">
          <h2 className="text-5xl font-bold mb-6 text-balance">
            Order Food From Your Canteen
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Skip the queues, save time. Browse our menu, customize your order, and get it ready when you need it.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose QuickBite?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Easy Ordering</h4>
              <p className="text-muted-foreground">
                Browse through our extensive menu, add items to your cart, and checkout in just a few clicks.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Real-Time Updates</h4>
              <p className="text-muted-foreground">
                Track your order status in real-time and get notified when it's ready for pickup.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Fresh & Varied</h4>
              <p className="text-muted-foreground">
                Enjoy a wide variety of fresh food options updated daily by the canteen management.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 border-t">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Create Your Account</h4>
                <p className="text-muted-foreground">
                  Sign up with your email and create a password in just a few seconds.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Browse the Menu</h4>
                <p className="text-muted-foreground">
                  Explore our daily menu, filter by category, and check prices.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Place Your Order</h4>
                <p className="text-muted-foreground">
                  Add items to your cart, review, and checkout securely.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Pick Up Your Order</h4>
                <p className="text-muted-foreground">
                  Get notified when your order is ready and pick it up from the counter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t">
          <div className="bg-primary text-primary-foreground rounded-lg p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Order?</h3>
            <p className="mb-6 text-lg opacity-90">
              Join our community and enjoy faster, easier canteen ordering.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/sign-up">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 QuickBite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
