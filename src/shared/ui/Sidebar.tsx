'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/shared/config/sidebarLinks'

const sidebarStyles = 'h-full w-42 mr-2'
const navListStyles = 'pl-2 flex flex-col gap-2'
const sidebarLinkStyles =
	'w-42 group flex h-10 items-center gap-2 rounded-xl px-3 text-md font-medium text-text-main transition-colors'
const activeSidebarLinkStyles = 'bg-bg-card shadow-card'
const iconStyles = 'transition-colors'
const activeIconStyles = 'text-black'
const badgeStyles =
	'ml-auto inline-flex min-w-5 items-center justify-center rounded-md border border-stroke px-1.5 py-0.5 text-[10px] font-semibold text-text-muted'
const activeBadgeStyles = 'border-primary/35 bg-primary-soft text-primary'

export function Sidebar() {
	const pathname = usePathname()

	return (
		<aside className={sidebarStyles}>
			<nav aria-label="Sidebar navigation">
				<ul className={navListStyles}>
					{sidebarLinks.map((link) => {
						const isActive = pathname === link.href
						const linkClassName = isActive
							? `${sidebarLinkStyles} ${activeSidebarLinkStyles}`
							: sidebarLinkStyles
						const Icon = link.icon
						const iconClassName = isActive
							? `${iconStyles} ${activeIconStyles}`
							: iconStyles
						const badgeClassName = isActive
							? `${badgeStyles} ${activeBadgeStyles}`
							: badgeStyles

						return (
							<li key={link.href}>
								<Link href={link.href} className={linkClassName}>
									<Icon
										size={16}
										weight={isActive ? 'fill' : 'regular'}
										className={iconClassName}
									/>
									<span>{link.label}</span>
									{link.badge ? (
										<span className={badgeClassName}>{link.badge}</span>
									) : null}
								</Link>
							</li>
						)
					})}
				</ul>
			</nav>
		</aside>
	)
}
