import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import OrderHistory from '@/components/OrderHistory'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'

export default async function OrdersPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total, payment_method, created_at, items')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-[#DCEFFF] px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/home-v1">
            <ArrowLeft size={22} className="text-[#1A237E] cursor-pointer hover:opacity-70 transition-opacity" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-[#1A237E]">
              My Orders
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {orders?.length ?? 0} order{(orders?.length ?? 0) !== 1 ? 's' : ''} placed
            </p>
          </div>
        </div>

        {/* Empty state */}
        {(!orders || orders.length === 0) && (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Package size={28} className="text-[#1A237E] opacity-30" />
            </div>
            <p className="text-lg font-medium text-[#1A237E] opacity-40">
              No orders yet
            </p>
            <Link
              href="/home-v1#products"
              className="mt-2 px-6 py-3 rounded-xl bg-[#1A237E] text-white text-base font-medium hover:opacity-90 transition-opacity"
            >
              Shop The Edit
            </Link>
          </div>
        )}

        {/* Orders list */}
        {orders && orders.length > 0 && (
          <OrderHistory orders={orders} />
        )}

      </div>
    </main>
  )
}
