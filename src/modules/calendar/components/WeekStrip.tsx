'use client'

import {
	buildWeek,
	toKey,
	weekdayLabels,
	type CalendarContext,
} from '../CalendarModel'

type WeekStripProps = {
	// Выполненные дни в формате toKey (ISO 'yyyy-MM-dd'). Собирать тем же toKey, что и ячейки.
	doneDates?: Set<string>
	// Любой день внутри нужной недели. По умолчанию — сегодня.
	anchor?: Date
}

const WEEKDAYS = weekdayLabels('ru-RU', 1)

export function WeekStrip({ doneDates = new Set(), anchor }: WeekStripProps) {
	const today = new Date()

	const ctx: CalendarContext = {
		doneDates,
		todayKey: toKey(today),
		todayDate: today,
		weekStartsOn: 1,
	}

	const days = buildWeek(anchor ?? today, ctx)

	return (
		<div className="flex justify-between gap-1">
			{days.map((cell, i) => (
				<div
					key={cell.key}
					data-temporal={cell.temporal}
					data-done={cell.done}
					className="group flex flex-1 flex-col items-center gap-1.5 rounded-2xl px-1 py-2 transition-colors data-[temporal=today]:bg-accent-dark"
				>
					<span className="text-xs font-medium text-text-muted group-data-[temporal=today]:text-white group-data-[temporal=today]:font-bold">
						{WEEKDAYS[i]}
					</span>
					<span className="text-lg font-bold text-text-main group-data-[temporal=today]:text-white">
						{cell.day}
					</span>
					<span className="h-1.5 w-1.5 rounded-full bg-transparent group-data-[done=true]:bg-primary" />
				</div>
			))}
		</div>
	)
}
