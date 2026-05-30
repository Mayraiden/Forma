import { RegForm } from '@/modules/auth/components/RegForm'
import Link from 'next/link'

const pageStyle = 'h-full p-4 flex flex-col gap-8 items-center justify-center'

export default function RegPage() {
	return (
		<main className={pageStyle}>
			<h1 className="text-2xl text-center">
				Создать аккаунт в <span className="font-bold">Forma</span>
			</h1>
			<RegForm />
			<Link href={'/login'} className="text-sm space-x-1 text-text-secondary ">
				<span>уже есть аккаунт?</span>
				<span className="border-b">Войти</span>
			</Link>
		</main>
	)
}
