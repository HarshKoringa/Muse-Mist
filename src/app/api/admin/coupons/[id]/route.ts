import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.DISCOUNTS_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { active, discount_percent, stacks } = body

  const updates: Record<string, unknown> = {}
  if (typeof active === 'boolean') updates.active = active
  if (discount_percent !== undefined) {
    const discountPercent = Number(discount_percent)
    if (!Number.isFinite(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
      return NextResponse.json({ error: 'discount_percent must be between 0 and 100' }, { status: 400 })
    }
    updates.discount_percent = discountPercent
  }
  if (typeof stacks === 'boolean') updates.stacks = stacks

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ coupon: data })
}
