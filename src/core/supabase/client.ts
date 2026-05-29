import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/core/supabase/env'

export const createClient = () =>
	createBrowserClient(getSupabaseUrl()!, getSupabaseAnonKey()!)
