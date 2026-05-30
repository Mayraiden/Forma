'use client'

import Link from 'next/link'
import { NotificationButton } from '@/shared/ui/NotificationButton'
import { StreakPill } from '@/modules/streakPill/components/StreakPill'

const headerStyles = 'px-2 pb-2 flex items-center justify-between'
const logoStyles = 'flex items-center gap-1 text-2xl font-bold'

export function Header() {
	return (
		<header className={headerStyles}>
			<Link href="/" className={logoStyles}>
				<h1 className="text-3xl">Forma</h1>
			</Link>
			<div className="flex items-center gap-1">
				<StreakPill />
				<NotificationButton />
			</div>
		</header>
	)
}
