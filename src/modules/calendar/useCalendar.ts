import { useMemo, useState } from 'react'

import {
	buildMonth,
	monthLabel,
	toKey,
	weekdayLabels,
	type CalendarContext,
	type GridCell,
} from './CalendarModel'

type UseCalendarParams = {
	// Выполненные дни в формате toKey (dd-mm-yyyy).
	doneDates?: Set<string>
	weekStartsOn?: 0 | 1
	locale?: string
}

type UseCalendarResult = {
	cells: GridCell[]
	weekdays: string[]
	title: string
	goPrev: () => void
	goNext: () => void
}

export function useCalendar({
	doneDates = new Set(),
	weekStartsOn = 1,
	locale = 'ru-RU',
}: UseCalendarParams = {}): UseCalendarResult {
	const today = useMemo(() => new Date(), [])

	const [current, setCurrent] = useState(() => ({
		year: today.getFullYear(),
		month: today.getMonth(),
	}))

	const cells = useMemo(() => {
		const ctx: CalendarContext = {
			doneDates,
			todayKey: toKey(today),
			todayDate: today,
			weekStartsOn,
		}

		return buildMonth(current.year, current.month, ctx)
	}, [current, doneDates, today, weekStartsOn])

	const weekdays = useMemo(
		() => weekdayLabels(locale, weekStartsOn),
		[locale, weekStartsOn],
	)

	const goPrev = () =>
		setCurrent(({ year, month }) =>
			month === 0
				? { year: year - 1, month: 11 }
				: { year, month: month - 1 },
		)

	const goNext = () =>
		setCurrent(({ year, month }) =>
			month === 11
				? { year: year + 1, month: 0 }
				: { year, month: month + 1 },
		)

	const title = monthLabel(current.year, current.month, locale)

	return { cells, weekdays, title, goPrev, goNext }
}
