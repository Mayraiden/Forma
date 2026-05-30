'use client'

import type { ReactNode } from 'react'

import { useToggle } from '@/shared/hooks/useToggle'
import { BottomNav } from '@/shared/ui/BottomNav'

import { GoalCreateModal } from './GoalCreateModal'

type GoalWidgetProps = {
	children: ReactNode
}

export function GoalWidget({ children }: GoalWidgetProps) {
	const [open, , setOpen, setClose] = useToggle(false)

	return (
		<>
			{children}
			<BottomNav onClick={setOpen} />
			{open && <GoalCreateModal onClose={setClose} />}
		</>
	)
}
