'use client'

import { CheckIcon } from '@phosphor-icons/react'
import { cva } from 'class-variance-authority'

import { cn } from '@/core/lib/utils'

import type { DayCell } from '../CalendarModel'

const dayStyles = cva(
	'relative flex h-12 w-12 items-center justify-center rounded-full text-sm transition-colors',
	{
		variants: {
			temporal: {
				past: '',
				today: 'font-bold ring-2 ring-bg-app/70',
				future: 'pointer-events-none text-text-muted',
			},
			done: {
				true: 'bg-primary text-white',
				false: '',
			},
		},
	},
)

type DayButtonProps = {
	cell: DayCell
	onClick?: (cell: DayCell) => void
}

export function DayButton({ cell, onClick }: DayButtonProps) {
	return (
		<button
			type="button"
			className={cn(dayStyles({ temporal: cell.temporal, done: cell.done }))}
			onClick={() => onClick?.(cell)}
		>
			{cell.done ? <CheckIcon weight="bold" /> : cell.day}
		</button>
	)
}
