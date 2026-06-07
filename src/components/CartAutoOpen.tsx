'use client'

import { useEffect } from 'react'
import { useCartUIStore } from '@/store/cartUIStore'
import { createClient } from '@/utils/supabase/client'

export default function CartAutoOpen() {
  const openCart = useCartUIStore((s) => s.openCart)

  useEffect(() => {
    const check = async () => {
      if (localStorage.getItem('mm_open_cart') !== 'true') return
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        localStorage.removeItem('mm_open_cart')
        setTimeout(() => openCart(), 800)
      }
    }
    check()
  }, [openCart])

  return null
}
