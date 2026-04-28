'use client'

const notificationButtonStyles =
	'w-10 h-10 rounded-full flex items-center justify-center bg-bg-card shadow-card hover:bg-primary-soft transition-colors duration-200'

import { BellIcon } from '@phosphor-icons/react'
export function NotificationButton() {
	return (
		<button className={notificationButtonStyles}>
			<BellIcon size={20} weight="regular" />
		</button>
	)
}
