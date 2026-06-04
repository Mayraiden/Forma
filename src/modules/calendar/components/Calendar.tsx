'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'

import type { DayCell } from '../CalendarModel'
import { useCalendar } from '../useCalendar'
import { DayButton } from './DayButton'

type CalendarProps = {
	// Выполненные дни в формате toKey (ISO 'yyyy-MM-dd'). Собирать тем же toKey, что и ячейки.
	doneDates?: Set<string>
	onDayClick?: (cell: DayCell) => void
}
const containerStyles = 'h-fit p-1 space-y-3 bg-white rounded-2xl'
const panelStyles = 'mb-6 pb-2 flex items-center justify-between border-b'
const monthTitleStyles = 'text-lg font-semibold'
const buttonNavStyles =
	'w-12 h-12 flex items-center justify-center bg-bg-app/30 rounded-2xl'

export function Calendar({ doneDates, onDayClick }: CalendarProps) {
	const { cells, weekdays, title, goPrev, goNext } = useCalendar({ doneDates })

	return (
		<div className={containerStyles}>
			<div className={panelStyles}>
				<button
					className={buttonNavStyles}
					type="button"
					onClick={goPrev}
					aria-label="Предыдущий месяц"
				>
					<CaretLeftIcon size={25} weight="bold" />
				</button>
				<span className={monthTitleStyles}>{title}</span>
				<button
					className={buttonNavStyles}
					type="button"
					onClick={goNext}
					aria-label="Следующий месяц"
				>
					<CaretRightIcon size={25} weight="bold" />
				</button>
			</div>

			<div className="mb-4 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase">
				{weekdays.map((label) => (
					<span key={label}>{label}</span>
				))}
			</div>

			<div className="grid grid-cols-7 gap-2 place-items-center">
				{cells.map((cell) =>
					cell.day === null ? (
						<div key={cell.key} />
					) : (
						<DayButton key={cell.key} cell={cell} onClick={onDayClick} />
					),
				)}
			</div>
		</div>
	)
}
