import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/core/supabase/env'

export const createClient = async () => {
	const cookieStore = await cookies()

	return createServerClient(
		getSupabaseUrl()!,
		getSupabaseAnonKey()!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options),
						)
					} catch {
						// В Server Components куки менять нельзя, игнорируем ошибку
					}
				},
			},
		},
	)
}
