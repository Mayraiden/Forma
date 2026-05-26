'use client'

import Image from 'next/image'
import Link from 'next/link'

import { createPortal } from 'react-dom'

import { NotificationButton } from '@/shared/ui/NotificationButton'
import { QuestButton } from '@/modules/quests/components/QuestButton'
import { useToggle } from '@/shared/hooks/useToggle'
import { QuestModal } from '@/modules/quests/components/QuestModal'

const headerStyles = 'px-2 py-2 flex items-center justify-between'
const logoStyles = 'flex items-center gap-1 text-2xl font-bold'

export function Header() {
	const [isOpen, toggle] = useToggle(false)

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
				<QuestButton onClick={toggle} />
				{isOpen &&
					createPortal(
						<QuestModal isOpen={isOpen} close={toggle} />,
						document.body,
					)}
			</div>
		</header>
	)
}
