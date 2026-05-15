import { createAdminClient } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  const { data: unshipped } = await supabase
    .from('orders')
    .select('id, payment_method, status, total, created_at, shipping_address')
    .is('shiprocket_order_id', null)
    .neq('status', 'cancelled')
    .lt('created_at', fiveMinsAgo)

  const { data: failures } = await supabase
    .from('shiprocket_failures')
    .select('*')
    .eq('resolved', false)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    unshipped_count: unshipped?.length ?? 0,
    failure_count: failures?.length ?? 0,
    unshipped_orders: unshipped ?? [],
    failures: failures ?? [],
    checked_at: new Date().toISOString(),
  })
}
