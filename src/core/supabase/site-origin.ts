import type { NextRequest } from 'next/server'

type OriginHeaders = {
	get(name: string): string | null
}

function originFromHeaders(headers: OriginHeaders, fallbackUrl?: string): string | null {
	const host = headers.get('x-forwarded-host') ?? headers.get('host')
	const protocol =
		headers.get('x-forwarded-proto') ??
		(fallbackUrl?.startsWith('https') ? 'https' : 'http')

	if (host) {
		return `${protocol}://${host.split(',')[0]?.trim()}`
	}

	return null
}

/** Публичный origin приложения (Vercel, localhost). Без завершающего slash. */
export function getSiteOrigin(request?: NextRequest): string {
	if (request) {
		return (
			originFromHeaders(request.headers, request.url) ??
			new URL(request.url).origin
		)
	}

	const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
	if (fromEnv) return fromEnv

	return 'http://localhost:3000'
}

export function getSiteOriginFromHeaders(headers: OriginHeaders): string {
	return originFromHeaders(headers) ?? getSiteOrigin()
}
