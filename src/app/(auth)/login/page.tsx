import { LoginForm } from '@/modules/auth/components/LoginForm'
import Link from 'next/link'

const mainStyles = 'h-full flex flex-col gap-10 items-center justify-center p-4'

export default function LoginPage() {
	return (
		<main className={mainStyles}>
			<div className="flex gap-2 flex-col items-center">
				<h1 className="text-3xl font-bold text-center">С Возвращением!</h1>
				<h3 className="text-text-main/80">войдите в аккаунт</h3>
			</div>
			<LoginForm />

			<Link href="/register" className="space-x-1 text-sm text-text-secondary">
				<span>Нет аккаунта?</span>
				<span className="border-b">Зарегистрироваться</span>
			</Link>
		</main>
	)
}
