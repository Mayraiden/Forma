import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import { Header } from '@/modules/layout/components/Header'
import { Sidebar } from '@/modules/layout/components/Sidebar'
import './globals.css'
import { cn } from '@/core/lib/utils'

const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
})

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
			className={cn(
				'h-full',
				'antialiased',
				plusJakartaSans.variable,
				'font-mono',
				jetbrainsMono.variable,
			)}
		>
			<body className="h-full overflow-hidden bg-bg-app font-sans text-text-main">
				<div className="flex h-full flex-col">
					<Header />
					<div className="flex min-h-0 flex-1 overflow-hidden">
						<Sidebar />
						<main className="min-h-0 flex-1 overflow-auto px-2 pb-2">
							{children}
						</main>
					</div>
				</div>
			</body>
		</html>
	)
}
