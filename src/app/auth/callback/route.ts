import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const origin = requestUrl.origin

  if (!code) {
    console.error('[Muse & Mist] Auth callback: no code param received')
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[Muse & Mist] exchangeCodeForSession error:', error.message)
      return NextResponse.redirect(`${origin}/?error=auth_failed`)
    }

    // If user came from the cart drawer, open it automatically on return
    if (next === 'checkout') {
      return NextResponse.redirect(`${origin}/?openCart=1`)
    }

    return NextResponse.redirect(`${origin}/`)

  } catch (err) {
    console.error('[Muse & Mist] Unexpected auth error:', err)
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }
}
