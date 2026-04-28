'use client'

import { PlusIcon } from '@phosphor-icons/react'

const questButtonStyles =
	'w-40 h-10 px-1 py-1 flex items-center justify-center gap-1 bg-cta text-white shadow-card rounded-lg hover:bg-cta-hover transition-colors duration-200'

export function QuestButton() {
	return (
		<button className={questButtonStyles}>
			<PlusIcon size={15} weight="thin" />
			<span>Новое задание</span>
		</button>
	)
}
