import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'
import { notFound, redirect } from 'next/navigation'
import OrderDetailClient from '@/components/OrderDetailClient'

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!order) notFound()

  return <OrderDetailClient order={order} />
}
