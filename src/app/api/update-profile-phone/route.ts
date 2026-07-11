import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { rateLimit } from '@/lib/rateLimit'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: sessionUser } } = await supabase.auth.getUser()

    if (!sessionUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { allowed } = rateLimit(`update-profile-phone:${sessionUser.id}`, 10, 60 * 1000)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a moment.' }, { status: 429 })
    }

    const body = await req.json()
    const { user_id, phone } = body

    if (!user_id || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (sessionUser.id !== user_id) {
      return NextResponse.json({ error: 'User mismatch' }, { status: 403 })
    }

    const cleanPhone = String(phone).replace(/\D/g, '')
    if (!/^91[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .upsert({ id: user_id, phone_number: cleanPhone }, { onConflict: 'id' })

    if (error) {
      console.error('[update-profile-phone] upsert error:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[update-profile-phone] error:', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
