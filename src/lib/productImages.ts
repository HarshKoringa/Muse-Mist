const SUPABASE_IMG = '/images'

export const PRODUCT_IMAGES: Record<string, string[]> = {
  'invisible-glow-shield': [
    `${SUPABASE_IMG}/SunScreen01.png`,
    `${SUPABASE_IMG}/SunScreen02.png`,
    `${SUPABASE_IMG}/SunScreen03.png`,
    `${SUPABASE_IMG}/SunScreen04.png`,
    `${SUPABASE_IMG}/SunScreen05.jpeg`,
    `${SUPABASE_IMG}/SunScreen06.png`,
  ],
  'reset-to-radiance': [
    `${SUPABASE_IMG}/VitaminC01.png`,
    `${SUPABASE_IMG}/VitaminC02.png`,
    `${SUPABASE_IMG}/VitaminC03.png`,
    `${SUPABASE_IMG}/VitaminC04.png`,
    `${SUPABASE_IMG}/VitaminC05.png`,
    `${SUPABASE_IMG}/VitaminC06.png`,
  ],
  'smooth-and-spotless': [
    `${SUPABASE_IMG}/Niacinamied01.png`,
    `${SUPABASE_IMG}/Niacinamied02.png`,
    `${SUPABASE_IMG}/Niacinamied03.png`,
    `${SUPABASE_IMG}/Niacinamied04.png`,
    `${SUPABASE_IMG}/Niacinamied05.png`,
    `${SUPABASE_IMG}/Niacinamied06.png`,
    `${SUPABASE_IMG}/Niacinamied07.png`,
  ],
  'barrier-repair': [
    `${SUPABASE_IMG}/Moisturizer01.png`,
    `${SUPABASE_IMG}/Moisturizer02.png`,
    `${SUPABASE_IMG}/Moisturizer03.png`,
    `${SUPABASE_IMG}/Moisturizer04.png`,
    `${SUPABASE_IMG}/Moisturizer05.png`,
    `${SUPABASE_IMG}/Moisturizer06.png`,
    `${SUPABASE_IMG}/Moisturizer07.png`,
  ],
  'cleanse-clear-calm': [
    `${SUPABASE_IMG}/FaceWash01.png`,
    `${SUPABASE_IMG}/FaceWash02.png`,
    `${SUPABASE_IMG}/FaceWash03.png`,
    `${SUPABASE_IMG}/FaceWash04.png`,
    `${SUPABASE_IMG}/FaceWash05.png`,
    `${SUPABASE_IMG}/FaceWash06.png`,
    `${SUPABASE_IMG}/FaceWash07.png`,
  ],
}

export function getProductImages(slug: string, fallbackUrl: string): string[] {
  return PRODUCT_IMAGES[slug] || [fallbackUrl]
}
