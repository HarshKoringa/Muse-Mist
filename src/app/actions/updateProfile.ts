'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(data: {
  full_name: string
  email: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase
    .from('profiles')
    .update({
      full_name: data.full_name.trim(),
      email: data.email.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) throw error

  revalidatePath('/profile')
}
