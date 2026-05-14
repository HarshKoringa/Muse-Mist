'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

const PREPAID_BASE = 5

export type DiscountInfo = {
  prepaidDiscountPercent: number
  earlyAccessPercent: number
  totalPrepaidPercent: number
  codDiscountPercent: number
  isEarlyAccess: boolean
}

export async function getDiscountInfo(): Promise<DiscountInfo> {
  const fallback: DiscountInfo = {
    prepaidDiscountPercent: PREPAID_BASE,
    earlyAccessPercent: 0,
    totalPrepaidPercent: PREPAID_BASE,
    codDiscountPercent: 0,
    isEarlyAccess: false,
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return fallback

    const adminSupabase = createAdminClient()

    const { data: profile } = await adminSupabase
      .from('profiles')
      .select('phone_number')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile?.phone_number) return fallback

    const rawPhone = profile.phone_number.replace(/\D/g, '')
    const normalizedPhone = rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone

    const { data: muse } = await adminSupabase
      .from('muses')
      .select('discount_percent')
      .eq('phone', normalizedPhone)
      .eq('discount_used', false)
      .maybeSingle()

    if (muse) {
      const earlyPercent: number = muse.discount_percent
      return {
        prepaidDiscountPercent: PREPAID_BASE,
        earlyAccessPercent: earlyPercent,
        totalPrepaidPercent: PREPAID_BASE + earlyPercent,
        codDiscountPercent: earlyPercent,
        isEarlyAccess: true,
      }
    }
  } catch {
    // silently fall back to regular pricing
  }

  return fallback
}
