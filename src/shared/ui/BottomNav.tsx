'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './Button'

import {
	PlusIcon,
	UserIcon,
	ChecksIcon,
	ChartLineUpIcon,
	GearIcon,
} from '@phosphor-icons/react'

const fabStyles =
	'shrink-0 size-14 rounded-xl bg-accent-dark text-white shadow-md'
const linkStyles = ''

type BottomNavProps = {
	onClick: () => void
}

export const BottomNav = ({ onClick }: BottomNavProps) => {
	const pathname = usePathname()

	return (
		<nav className="fixed bottom-0 inset-x-0 z-50 border-t border-stroke bg-bg-card md:hidden pb-[env(safe-area-inset-bottom)]">
			<div className="flex h-16 items-center justify-around px-2">
				<Link href={'/'} className={linkStyles}>
					<UserIcon size={30} weight={pathname === '/' ? 'fill' : 'regular'} />
				</Link>
				<Link href={'/goals'} className={linkStyles}>
					<ChecksIcon
						size={30}
						weight={pathname === '/goals' ? 'fill' : 'regular'}
					/>
				</Link>
				<Button
					type="button"
					className={fabStyles}
					aria-label="Добавить"
					onClick={onClick}
				>
					<PlusIcon size={25} weight="bold" />
				</Button>
				<Link href={'/statistics'} className={linkStyles}>
					<ChartLineUpIcon
						size={30}
						weight={pathname === '/statistics' ? 'fill' : 'regular'}
					/>
				</Link>
				<Link href={'/settings'} className={linkStyles}>
					<GearIcon
						size={30}
						weight={pathname === '/settings' ? 'fill' : 'regular'}
					/>
				</Link>
			</div>
		</nav>
	)
}
