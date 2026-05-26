'use client'

import { PlusIcon } from '@phosphor-icons/react'

const questButtonStyles =
	'w-40 h-10 px-2 py-1 flex items-center justify-center gap-1 bg-black-coffe text-white shadow-card rounded-3xl hover:bg-xp-gold transition-colors duration-200'

const questButtonText = 'text-md'

type QuestButtonProps = {
	onClick: () => void
}

export function QuestButton({ onClick }: QuestButtonProps) {
	return (
		<button type="button" className={questButtonStyles} onClick={onClick}>
			<PlusIcon size={15} weight="bold" />
			<span className={questButtonText}>Новое задание</span>
		</button>
	)
}
