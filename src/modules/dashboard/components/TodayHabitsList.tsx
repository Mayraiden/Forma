'use client'

import { useOptimistic, useTransition } from 'react'

import { CheckIcon, FireIcon, TargetIcon } from '@phosphor-icons/react'

import { cn } from '@/core/lib/utils'
import { calcStreak, toKey } from '@/modules/calendar/CalendarModel'
import { checkIn } from '@/modules/goals/goalsService'
import { ProgressBar } from '@/shared/ui/ProgressBar'

export type HabitItem = {
	id: string
	title: string
	doneDates: string[]
}

type TodayHabitsListProps = {
	items: HabitItem[]
}

export function TodayHabitsList({ items }: TodayHabitsListProps) {
	const today = new Date()
	const todayKey = toKey(today)

	const [doneIds, markDone] = useOptimistic(
		new Set(
			items.filter((i) => i.doneDates.includes(todayKey)).map((i) => i.id),
		),
		(set: Set<string>, id: string) => new Set(set).add(id),
	)
	const [, startTransition] = useTransition()

	// На главной отметку нельзя отменить — только поставить (в отличие от календаря).
	const handleTap = (item: HabitItem) => {
		if (doneIds.has(item.id)) return

		startTransition(async () => {
			markDone(item.id)
			await checkIn(item.id)
		})
	}

	const total = items.length
	const doneCount = items.filter((i) => doneIds.has(i.id)).length
	const percent = total ? Math.round((doneCount / total) * 100) : 0

	return (
		<section className="space-y-3">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-text-main">Привычки на сегодня</h2>
				<span className="text-sm text-text-muted">
					{doneCount}/{total} · {percent}%
				</span>
			</div>

			<ProgressBar value={percent} />

			{total === 0 ? (
				<p className="text-sm text-text-muted">
					Пока нет активных целей. Нажми + внизу, чтобы создать первую.
				</p>
			) : (
				<ul className="space-y-3">
					{items.map((item) => {
						const isDone = doneIds.has(item.id)

						const doneDates = new Set(item.doneDates)
						if (isDone) doneDates.add(todayKey)
						const streak = calcStreak(doneDates, today)

						return (
							<li key={item.id}>
								<button
									type="button"
									disabled={isDone}
									onClick={() => handleTap(item)}
									className="flex w-full items-center gap-3 rounded-2xl bg-bg-card p-3 text-left shadow-card transition-colors enabled:hover:bg-bg-pill/40 disabled:cursor-default"
								>
									<span
										className={cn(
											'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
											isDone
												? 'bg-accent-purple text-white'
												: 'bg-bg-pill text-text-secondary',
										)}
									>
										{isDone ? (
											<CheckIcon size={24} weight="bold" />
										) : (
											<TargetIcon size={24} weight="bold" />
										)}
									</span>

									<div className="flex flex-1 items-center gap-2">
										<p
											className={cn(
												'font-semibold',
												isDone
													? 'text-text-muted line-through'
													: 'text-text-main',
											)}
										>
											{item.title}
										</p>
										{streak > 0 && (
											<span className="flex items-center gap-0.5 text-sm font-bold text-accent-orange">
												<FireIcon size={16} weight="fill" />
												{streak}
											</span>
										)}
									</div>
								</button>
							</li>
						)
					})}
				</ul>
			)}
		</section>
	)
}
