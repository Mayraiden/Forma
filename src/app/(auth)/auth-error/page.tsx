import Link from 'next/link'

type AuthErrorPageProps = {
	searchParams: Promise<{ reason?: string }>
}

export default async function AuthError({ searchParams }: AuthErrorPageProps) {
	const { reason } = await searchParams

	return (
		<div className="mx-auto max-w-md space-y-4 p-8">
			<h1 className="text-xl font-semibold">Не удалось войти</h1>
			<p className="text-sm text-text-muted">
				Обычно это сбой OAuth: неверный redirect URL в Supabase, устаревшие
				куки или вход с другого домена (preview ≠ production).
			</p>
			{reason ? (
				<pre className="overflow-x-auto rounded-lg bg-bg-card p-3 text-xs ring-1 ring-stroke">
					{decodeURIComponent(reason)}
				</pre>
			) : null}
			<Link href="/login" className="text-accent-orange underline">
				Вернуться на вход
			</Link>
		</div>
	)
}
