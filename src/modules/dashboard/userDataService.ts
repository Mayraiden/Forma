'use server'

import { createClient } from '@/core/supabase/server'

export async function getUserData() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	return user
}
