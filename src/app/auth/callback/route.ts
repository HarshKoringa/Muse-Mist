import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    console.error('[Muse & Mist] Auth callback: no code param received')
    return NextResponse.redirect(`${origin}/home-v1?error=auth_failed`)
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('[Muse & Mist] exchangeCodeForSession error:', error.message)
      return NextResponse.redirect(`${origin}/home-v1?error=auth_failed`)
    }

    // Success — send them home
    return NextResponse.redirect(`${origin}/home-v1`)

  } catch (err) {
    console.error('[Muse & Mist] Unexpected auth error:', err)
    return NextResponse.redirect(`${origin}/home-v1?error=auth_failed`)
  }
}
