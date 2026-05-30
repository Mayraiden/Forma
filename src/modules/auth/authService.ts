'use server'

import { createClient } from '@/core/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

async function getRequestOrigin() {
	const headersList = await headers()
	const origin = headersList.get('origin')
	if (origin) return origin

	const host = headersList.get('x-forwarded-host') ?? headersList.get('host')
	const protocol = headersList.get('x-forwarded-proto') ?? 'http'

	if (host) return `${protocol}://${host}`

	return 'http://localhost:3000'
}

export async function signIn(initialState: unknown, formData: FormData) {
	const supabase = await createClient()
	const email = formData.get('email') as string
	const password = formData.get('password') as string

	const { error } = await supabase.auth.signInWithPassword({ email, password })

	if (error) {
		return { error: error.message }
	}

	revalidatePath('/', 'layout')
	redirect('/')
}

export async function signOAuth(provider: 'google') {
	const supabase = await createClient()
	const origin = await getRequestOrigin()

	const { data, error } = await supabase.auth.signInWithOAuth({
		provider,
		options: {
			redirectTo: `${origin}/callback?next=/`,
		},
	})

	if (error || !data.url) {
		redirect('/auth-error')
	}

	redirect(data.url)
}

export async function signUp(initialState: unknown, formData: FormData) {
	const supabase = await createClient()
	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const displayName = formData.get('displayName') as string

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				display_name: displayName,
			},
		},
	})

	if (error) {
		return { error: error.message }
	}

	revalidatePath('/', 'layout')
	redirect('/')
}

export async function signOut() {
	const supabase = await createClient()
	await supabase.auth.signOut()

	revalidatePath('/', 'layout')
	redirect('/login')
}
