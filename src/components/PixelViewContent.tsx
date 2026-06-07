'use client'

import { useEffect } from 'react'
import { trackViewContent } from '@/lib/pixel'

type Props = {
  product: { name: string; slug: string; price: number; category?: string }
}

export default function PixelViewContent({ product }: Props) {
  useEffect(() => {
    trackViewContent(product)
  }, [product])
  return null
}
