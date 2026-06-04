import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabaseAnonKey, getSupabaseUrl } from '@/core/supabase/env'

const AUTH_BYPASS_PATHS = ['/callback', '/login/google']

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// OAuth callback: не трогаем куки (PKCE verifier), иначе exchangeCodeForSession падает
	if (AUTH_BYPASS_PATHS.includes(pathname)) {
		return NextResponse.next({
			request: { headers: request.headers },
		})
	}

	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	})

	const supabase = createServerClient(
		getSupabaseUrl()!,
		getSupabaseAnonKey()!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					)
					response = NextResponse.next({
						request,
					})
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options),
					)
				},
			},
		},
	)

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	// После signOut в куках может остаться битый refresh token — чистим без шума в логах
	if (error?.code === 'refresh_token_not_found') {
		await supabase.auth.signOut()
	} else if (!user && request.cookies.getAll().some((c) => c.name.includes('auth-token'))) {
		await supabase.auth.signOut()
	}

	return response
}

export const config = {
	// Защищаем или обрабатываем middleware только нужные роуты (исключаем статику и картинки)
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
