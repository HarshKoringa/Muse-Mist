import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

function generateDiscountCode(name: string): string {
  const prefix = 'MUSE'
  const nameCode = name.trim().slice(0, 3).toUpperCase()
  const random = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `${prefix}-${nameCode}-${random}`
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone } = await req.json()

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required' },
        { status: 400 }
      )
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid Indian mobile number' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Check if phone already registered
    const { data: existing } = await supabase
      .from('muses')
      .select('id, discount_code')
      .eq('phone', phone)
      .single()

    if (existing) {
      return NextResponse.json(
        {
          error: 'Already registered',
          code: 'already_registered',
          discount_code: existing.discount_code
        },
        { status: 409 }
      )
    }

    // Generate unique discount code
    let discountCode = generateDiscountCode(name)

    // Ensure uniqueness
    let attempts = 0
    while (attempts < 5) {
      const { data: codeExists } = await supabase
        .from('muses')
        .select('id')
        .eq('discount_code', discountCode)
        .single()

      if (!codeExists) break
      discountCode = generateDiscountCode(name)
      attempts++
    }

    // Insert new early access muse
    const { data, error } = await supabase
      .from('muses')
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        contact_type: 'phone',
        discount_code: discountCode,
        discount_percent: 30,
        discount_used: false,
        source: 'early_access_landing',
      })
      .select('id, discount_code')
      .single()

    if (error) {
      console.error('[Muse & Mist] Early access insert error:', error)
      return NextResponse.json(
        { error: 'Registration failed. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      discount_code: data.discount_code,
    })

  } catch (err) {
    console.error('[Muse & Mist] Early access error:', err)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
