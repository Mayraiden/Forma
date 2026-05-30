import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
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
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		title: 'Forma',
		statusBarStyle: 'default',
	},
	icons: {
		icon: '/assets/icons/logo.svg',
		apple: '/assets/icons/logo.svg',
	},
	themeColor: '#10b981',
}

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
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
			<body className="h-full overflow-hidden bg-bg-app/60 font-sans text-text-main">
				{children}
			</body>
		</html>
	)
}
