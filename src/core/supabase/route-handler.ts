import { createServerClient } from '@supabase/ssr'
import type { NextRequest, NextResponse } from 'next/server'

import { getSupabaseAnonKey, getSupabaseUrl } from '@/core/supabase/env'

/** Supabase client for Route Handlers — cookies must be written to `response`. */
export function createRouteHandlerClient(
	request: NextRequest,
	response: NextResponse,
) {
	return createServerClient(getSupabaseUrl()!, getSupabaseAnonKey()!, {
		cookies: {
			getAll() {
				return request.cookies.getAll()
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value }) =>
					request.cookies.set(name, value),
				)
				cookiesToSet.forEach(({ name, value, options }) =>
					response.cookies.set(name, value, options),
				)
			},
		},
	})
}

/** @supabase/supabase-js v2.91+ defers SIGNED_IN; wait before returning the response. */
export async function flushAuthCookies() {
	await new Promise<void>((resolve) => setTimeout(resolve, 0))
}
