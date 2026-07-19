import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.DISCOUNTS_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('referral_settings')
    .select('referral_discount_percent, self_purchase_discount_percent, updated_at')
    .eq('id', 1)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ settings: data })
}

export async function PATCH(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.DISCOUNTS_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { referral_discount_percent, self_purchase_discount_percent } = body

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }

  if (referral_discount_percent !== undefined) {
    const v = Number(referral_discount_percent)
    if (!Number.isFinite(v) || v < 0 || v > 100) {
      return NextResponse.json({ error: 'referral_discount_percent must be between 0 and 100' }, { status: 400 })
    }
    updates.referral_discount_percent = v
  }

  if (self_purchase_discount_percent !== undefined) {
    const v = Number(self_purchase_discount_percent)
    if (!Number.isFinite(v) || v < 0 || v > 100) {
      return NextResponse.json({ error: 'self_purchase_discount_percent must be between 0 and 100' }, { status: 400 })
    }
    updates.self_purchase_discount_percent = v
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('referral_settings')
    .update(updates)
    .eq('id', 1)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ settings: data })
}
