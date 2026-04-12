export type KeyIngredient = {
  name: string
  benefit: string
}

export type Product = {
  id: string
  name: string
  slug: string
  price: number
  description: string
  category: string
  stock_count: number
  image_url: string | null
  key_ingredients?: KeyIngredient[] | null
  how_to_use?: string | null
  skin_type?: string | null
}
