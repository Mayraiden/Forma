'use client'

import { useOptimistic, useTransition } from 'react'

import { Calendar } from '@/modules/calendar/components/Calendar'
import type { DayCell } from '@/modules/calendar/CalendarModel'

import { toggleLog } from '../goalsService'
import type { GoalWithLogs } from '../types'

type GoalProgressProps = {
	goal: GoalWithLogs
}

export function GoalProgress({ goal }: GoalProgressProps) {
	// log_date уже в ISO 'yyyy-MM-dd' — тот же формат, что и cell.key.
	const doneFromServer = new Set(goal.goal_logs.map((log) => log.log_date))

	const [doneDates, applyOptimistic] = useOptimistic(
		doneFromServer,
		(current: Set<string>, dateKey: string) => {
			const next = new Set(current)
			if (next.has(dateKey)) next.delete(dateKey)
			else next.add(dateKey)
			return next
		},
	)

	const [, startTransition] = useTransition()

	const handleDayClick = (cell: DayCell) => {
		if (cell.temporal === 'future') return

		startTransition(async () => {
			applyOptimistic(cell.key)
			await toggleLog(goal.id, cell.key)
		})
	}

	return <Calendar doneDates={doneDates} onDayClick={handleDayClick} />
}
