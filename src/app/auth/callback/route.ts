import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  try {
    let userId: string | undefined

    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
      userId = data.session?.user?.id
    } else if (token_hash && type) {
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
      if (error) throw error
      userId = data.session?.user?.id ?? data.user?.id
    }

    // Check profile vibes to decide redirect destination
    if (userId) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('vibes')
        .eq('id', userId)
        .single()

      const hasVibes =
        profile?.vibes && Array.isArray(profile.vibes) && profile.vibes.length > 0

      return NextResponse.redirect(
        new URL(hasVibes ? '/home' : '/setup', request.url)
      )
    }

    // No user ID obtained -- fall through to setup
    return NextResponse.redirect(new URL('/setup', request.url))
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
