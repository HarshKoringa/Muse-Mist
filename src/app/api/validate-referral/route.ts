import { createAdminClient } from '@/utils/supabase/admin'
import { resolveReferralCode } from '@/lib/referral'
import { NextRequest, NextResponse } from 'next/server'

// Read-only preview so the checkout UI can show the discount before the
// customer places the order. Places no order, changes no state.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { code, items } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, message: 'Enter a code' }, { status: 400 })
    }

    const itemList: { id: string; quantity: number }[] = Array.isArray(items) ? items : []

    const supabase = createAdminClient()
    const resolution = await resolveReferralCode(
      supabase,
      code,
      itemList.map((i) => Number(i.quantity) || 0)
    )

    if (resolution.type === 'none' || resolution.type === 'error') {
      return NextResponse.json({
        valid: false,
        message: resolution.type === 'error' ? resolution.message : 'Invalid code',
      })
    }

    return NextResponse.json({
      valid: true,
      type: resolution.type,
      discountPercent: resolution.discountPercent,
      mode: resolution.mode,
      ambassadorName: resolution.type === 'referral' || resolution.type === 'self_purchase' ? resolution.ambassadorName : undefined,
    })
  } catch (err) {
    console.error('[Muse & Mist] /api/validate-referral error:', err)
    return NextResponse.json({ valid: false, message: 'Could not validate code' }, { status: 500 })
  }
}
