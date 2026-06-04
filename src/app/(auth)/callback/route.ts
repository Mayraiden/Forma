import { type NextRequest, NextResponse } from 'next/server'

import {
	createRouteHandlerClient,
	flushAuthCookies,
} from '@/core/supabase/route-handler'
import { getSiteOrigin } from '@/core/supabase/site-origin'

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url)
	const origin = getSiteOrigin(request)
	const code = searchParams.get('code')
	let next = searchParams.get('next') ?? '/'

	if (!next.startsWith('/')) {
		next = '/'
	}

	if (!code) {
		return NextResponse.redirect(`${origin}/auth-error`)
	}

	const successUrl = `${origin}${next}`
	const response = NextResponse.redirect(successUrl)
	const supabase = createRouteHandlerClient(request, response)

	const { error } = await supabase.auth.exchangeCodeForSession(code)
	await flushAuthCookies()

	if (!error) {
		return response
	}

	const reason = encodeURIComponent(error.message)
	return NextResponse.redirect(`${origin}/auth-error?reason=${reason}`)
}
