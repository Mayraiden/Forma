import Image from 'next/image'
import Link from 'next/link'
import { NotificationButton } from './NotificationButton'
import { QuestButton } from './QuestButton'

const headerStyles = 'px-2 py-2 flex items-center justify-between'
const logoStyles = 'flex items-center gap-1 text-2xl font-bold'

export function Header() {
	return (
		<header className={headerStyles}>
			<Link href="/" className={logoStyles}>
				<Image
					src="/assets/icons/logo.svg"
					alt="logo"
					width={50}
					height={50}
					priority
				/>
				<h1>Forma</h1>
			</Link>
			<div className="flex items-center gap-2">
				<NotificationButton />
				<QuestButton />
			</div>
		</header>
	)
}
