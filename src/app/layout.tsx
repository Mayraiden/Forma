import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { Header } from '@/shared/ui/Header'
import { Sidebar } from '@/shared/ui/Sidebar'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
	variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
	title: 'Forma',
	description: 'Forma - gamified personal progress tracker',
}

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html
			lang="ru"
			className={`${plusJakartaSans.variable} h-full antialiased`}
		>
			<body className="h-full overflow-hidden bg-bg-app font-sans text-text-main">
				<div className="flex h-full flex-col">
					<Header />
					<div className="flex min-h-0 flex-1 overflow-hidden">
						<Sidebar />
						<main className="min-h-0 flex-1 overflow-auto px-2 pb-2">{children}</main>
					</div>
				</div>
			</body>
		</html>
	)
}
