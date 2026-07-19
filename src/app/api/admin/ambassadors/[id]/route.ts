import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.DISCOUNTS_ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const { action, active } = body

  const supabase = createAdminClient()

  if (action === 'fulfill') {
    const { data: ambassador, error: fetchErr } = await supabase
      .from('ambassadors')
      .select('free_products_fulfilled')
      .eq('id', id)
      .single()

    if (fetchErr || !ambassador) {
      return NextResponse.json({ error: 'Ambassador not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('ambassadors')
      .update({ free_products_fulfilled: ambassador.free_products_fulfilled + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ambassador: data })
  }

  if (typeof active === 'boolean') {
    const { data, error } = await supabase
      .from('ambassadors')
      .update({ active })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ambassador: data })
  }

  return NextResponse.json({ error: 'No valid action provided' }, { status: 400 })
}
