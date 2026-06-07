'use client'

import { useEffect } from 'react'
import { useCartUIStore } from '@/store/cartUIStore'

export default function CartAutoOpen() {
  const openCart = useCartUIStore((s) => s.openCart)

  useEffect(() => {
    const flag = localStorage.getItem('mm_open_cart')
    if (flag === 'true') {
      localStorage.removeItem('mm_open_cart')
      openCart()
    }
  }, [openCart])

  return null
}
