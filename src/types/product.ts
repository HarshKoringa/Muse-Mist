export type KeyIngredient = {
  name: string
  benefit: string
}

export type Product = {
  id: string
  name: string
  slug: string
  price: number
  mrp: number | null
  description: string
  category: string
  stock_count: number
  is_active: boolean
  image_url: string | null
  key_ingredients?: KeyIngredient[] | null
  how_to_use?: string | null
  skin_type?: string | null
  discount_percent: number | null
  discount_label: string | null
  discount_active: boolean
}
