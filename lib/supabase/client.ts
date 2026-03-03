import { createBrowserClient } from '@supabase/ssr'

declare global {
  var __supabaseClient: ReturnType<typeof createBrowserClient> | undefined
}

export function createClient() {
  if (!globalThis.__supabaseClient) {
    globalThis.__supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return globalThis.__supabaseClient
}
