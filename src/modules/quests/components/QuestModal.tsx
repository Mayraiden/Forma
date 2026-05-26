'use client'

import { useEffect } from 'react'

type QuestModalProps = {
	isOpen: boolean
	close: () => void
}

const opened =
	'fixed inset-0 z-50 w-screen h-screen flex items-center justify-center bg-black/50'
const closed = 'hidden'
const questModal = 'w-1/2 h-1/2 bg-bg-card rounded-md'
const questModalTitle = 'text-lg'

export const QuestModal = ({ isOpen, close }: QuestModalProps) => {
	useEffect(() => {
		if (!isOpen) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				close()
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isOpen, close])

	return (
		<div className={isOpen ? opened : closed} onClick={close}>
			<div className={questModal} onClick={(e) => e.stopPropagation()}>
				<h1 className={questModalTitle}>Создай новую цель</h1>
				<button onClick={close}>Создать</button>
			</div>
		</div>
	)
}
