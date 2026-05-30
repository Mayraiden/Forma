'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { XIcon } from '@phosphor-icons/react'

import { GoalForm } from './GoalForm'

type GoalCreateModalProps = {
	onClose: () => void
}

const overlayStyles =
	'fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4'
const panelStyles =
	'w-full max-w-md rounded-xl bg-bg-card p-4 shadow-lg ring-1 ring-stroke'
const headerStyles = 'mb-4 flex items-center justify-between'
const titleStyles = 'text-lg font-semibold text-text-main'

export function GoalCreateModal({ onClose }: GoalCreateModalProps) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return createPortal(
		<div className={overlayStyles} onClick={onClose}>
			<div
				className={panelStyles}
				onClick={(event) => event.stopPropagation()}
				role="dialog"
				aria-modal="true"
				aria-labelledby="goal-create-title"
			>
				<div className={headerStyles}>
					<h2 id="goal-create-title" className={titleStyles}>
						Новая цель
					</h2>
					<button
						type="button"
						onClick={onClose}
						aria-label="Закрыть"
						className="rounded-lg p-1 text-text-main"
					>
						<XIcon size={20} />
					</button>
				</div>
				<GoalForm onSuccess={onClose} />
			</div>
		</div>,
		document.body,
	)
}
