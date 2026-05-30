const notificationButtonStyles =
	'w-10 h-10 rounded-full flex items-center justify-center'

import { BellIcon } from '@phosphor-icons/react'
import { Button } from './Button'
export function NotificationButton() {
	return (
		<Button className={notificationButtonStyles}>
			<BellIcon size={25} weight="bold" />
		</Button>
	)
}
