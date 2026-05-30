/** Supabase dashboard may label this as anon or publishable — same key. */
export function getSupabaseAnonKey() {
	return (
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
		process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
	)
}

export function getSupabaseUrl() {
	return process.env.NEXT_PUBLIC_SUPABASE_URL
}
