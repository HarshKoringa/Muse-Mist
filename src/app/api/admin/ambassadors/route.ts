import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

function randomSuffix(length = 4) {
  return Math.random().toString(36).slice(2, 2 + length).toUpperCase()
}

function slugify(name: string) {
  return name.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '').slice(0, 10) || 'AMB'
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.DISCOUNTS_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('ambassadors')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const ambassadors = (data ?? []).map((a) => ({
    ...a,
    free_products_owed: Math.floor(a.order_count / 2) - a.free_products_fulfilled,
  }))

  return NextResponse.json({ ambassadors })
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.DISCOUNTS_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, referral_code, self_purchase_code } = body

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const base = slugify(name)

  const referralCode = (referral_code?.trim().toUpperCase()) || `${base}${randomSuffix()}`
  const selfPurchaseCode = (self_purchase_code?.trim().toUpperCase()) || `${base}SELF${randomSuffix()}`

  const { data, error } = await supabase
    .from('ambassadors')
    .insert({
      name: name.trim(),
      referral_code: referralCode,
      self_purchase_code: selfPurchaseCode,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ambassador: data })
}
