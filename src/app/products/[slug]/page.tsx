import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import PDPHero from '@/components/pdp/PDPHero'
import PDPIngredients from '@/components/pdp/PDPIngredients'
import PDPRoutine from '@/components/pdp/PDPRoutine'
import { Product } from '@/types/product'

type Props = {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('id, name, slug, price, mrp, description, category, stock_count, is_active, image_url, key_ingredients, how_to_use, skin_type, discount_percent, discount_label, discount_active')
    .eq('slug', slug)
    .single()

  if (!product) notFound()

  return (
    <main className="min-h-screen bg-white">
      <PDPHero product={product as Product} />
      <PDPIngredients product={product as Product} />
      <PDPRoutine product={product as Product} />
    </main>
  )
}
