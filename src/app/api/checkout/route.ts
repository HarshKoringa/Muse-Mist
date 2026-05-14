import { getRazorpayInstance } from '@/lib/razorpay'
import { NextRequest, NextResponse } from 'next/server'

const COD_CHARGE = 50
const PREPAID_DISCOUNT_PERCENT = 5

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, payment_method, user_id } = body

    if (!items?.length || !payment_method || !user_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )

    let discount = 0
    let delivery_charge = 0
    let total = subtotal

    if (payment_method === 'prepaid') {
      discount = Math.round(subtotal * (PREPAID_DISCOUNT_PERCENT / 100))
      delivery_charge = 0
      total = subtotal - discount
    } else {
      discount = 0
      delivery_charge = COD_CHARGE
      total = subtotal + delivery_charge
    }

    let razorpay_order_id = null

    if (payment_method === 'prepaid') {
      const razorpay = getRazorpayInstance()
      const razorpayOrder = await razorpay.orders.create({
        amount: total * 100,
        currency: 'INR',
        receipt: crypto.randomUUID().slice(0, 10),
        notes: {
          user_id,
          payment_method,
        },
      })
      razorpay_order_id = razorpayOrder.id
    }

    return NextResponse.json({
      razorpay_order_id,
      razorpay_key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subtotal,
      discount,
      delivery_charge,
      total,
      payment_method,
    })
  } catch (err) {
    console.error('[Muse & Mist] /api/checkout error:', err)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}
