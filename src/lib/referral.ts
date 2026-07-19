import { SupabaseClient } from '@supabase/supabase-js'

export type ReferralResolution =
  | { type: 'none' }
  | { type: 'error'; message: string }
  | { type: 'referral'; ambassadorId: string; ambassadorName: string; discountPercent: number; mode: 'stack' }
  | { type: 'self_purchase'; ambassadorId: string; ambassadorName: string; discountPercent: number; mode: 'stack' }
  | { type: 'coupon'; couponId: string; discountPercent: number; mode: 'stack' | 'flat' }

// Looks up a referral/self-purchase/coupon code against the DB and returns how it
// should affect pricing. Never trusts anything but the raw code string — every
// percentage and id comes from a fresh DB read, same as the existing muses discount.
export async function resolveReferralCode(
  supabase: SupabaseClient,
  rawCode: string | undefined | null,
  cartItemQuantities: number[]
): Promise<ReferralResolution> {
  const code = (rawCode || '').trim().toUpperCase()
  if (!code) return { type: 'none' }

  const { data: settings } = await supabase
    .from('referral_settings')
    .select('referral_discount_percent, self_purchase_discount_percent')
    .eq('id', 1)
    .single()

  const referralPercent = Number(settings?.referral_discount_percent ?? 5)
  const selfPurchasePercent = Number(settings?.self_purchase_discount_percent ?? 50)

  const { data: byReferral } = await supabase
    .from('ambassadors')
    .select('id, name')
    .eq('referral_code', code)
    .eq('active', true)
    .maybeSingle()

  if (byReferral) {
    return {
      type: 'referral',
      ambassadorId: byReferral.id,
      ambassadorName: byReferral.name,
      discountPercent: referralPercent,
      mode: 'stack',
    }
  }

  const { data: bySelfPurchase } = await supabase
    .from('ambassadors')
    .select('id, name, self_purchase_used')
    .eq('self_purchase_code', code)
    .eq('active', true)
    .maybeSingle()

  if (bySelfPurchase) {
    if (bySelfPurchase.self_purchase_used) {
      return { type: 'error', message: 'This self-purchase code has already been used' }
    }
    if (cartItemQuantities.length === 0 || cartItemQuantities.some((qty) => qty !== 1)) {
      return { type: 'error', message: 'Self-purchase code allows any number of products, but only 1 quantity of each' }
    }
    return {
      type: 'self_purchase',
      ambassadorId: bySelfPurchase.id,
      ambassadorName: bySelfPurchase.name,
      discountPercent: selfPurchasePercent,
      mode: 'stack',
    }
  }

  const { data: coupon } = await supabase
    .from('coupons')
    .select('id, discount_percent, stacks')
    .eq('code', code)
    .eq('active', true)
    .maybeSingle()

  if (coupon) {
    return {
      type: 'coupon',
      couponId: coupon.id,
      discountPercent: Number(coupon.discount_percent),
      mode: coupon.stacks ? 'stack' : 'flat',
    }
  }

  return { type: 'error', message: 'Invalid or inactive code' }
}

// Combines a resolved code with the discount percent already computed from
// prepaid/early-access rules — stacks on top of it, or flat-overrides it.
export function applyReferralToDiscount(baseDiscountPercent: number, resolution: ReferralResolution): number {
  if (resolution.type === 'none' || resolution.type === 'error') return baseDiscountPercent
  return resolution.mode === 'stack' ? baseDiscountPercent + resolution.discountPercent : resolution.discountPercent
}
