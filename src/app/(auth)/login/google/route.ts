import { type NextRequest, NextResponse } from 'next/server'

import {
	createRouteHandlerClient,
	flushAuthCookies,
} from '@/core/supabase/route-handler'
import { getSiteOrigin } from '@/core/supabase/site-origin'

export async function GET(request: NextRequest) {
	const origin = getSiteOrigin(request)
	const redirectTo = `${origin}/callback?next=/`

	// Один redirect-ответ: сюда пишем PKCE-cookies, потом меняем Location на URL Google
	const response = NextResponse.redirect(`${origin}/auth-error`)
	const supabase = createRouteHandlerClient(request, response)

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			redirectTo,
			queryParams: { prompt: 'select_account' },
		},
	})

	await flushAuthCookies()

	if (error || !data.url) {
		return response
	}

	response.headers.set('Location', data.url)
	return response
}
