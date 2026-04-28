import { Icon, UserIcon, ChartDonutIcon } from '@phosphor-icons/react'

export type SidebarLink = {
	label: string
	href: string
	icon: Icon
	badge?: number
}

export const sidebarLinks: SidebarLink[] = [
	{
		label: 'Профиль',
		href: '/',
		icon: UserIcon,
	},
	{
		label: 'Квесты',
		href: '/quests',
		icon: ChartDonutIcon,
		badge: 3,
	},
]
