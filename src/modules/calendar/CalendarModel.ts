// Две независимые оси: когда день (temporal) и отмечен ли он (done).
export type DayTemporal = 'past' | 'today' | 'future'

export type DayCell = {
	key: string
	day: number
	date: Date
	temporal: DayTemporal
	done: boolean
}

export type BlankCell = { key: string; day: null }
export type GridCell = DayCell | BlankCell

export type CalendarContext = {
	doneDates: Set<string>
	todayKey: string
	todayDate: Date // Добавили для корректного сравнения прошлого/будущего
	weekStartsOn?: 0 | 1
}

// ISO 'yyyy-MM-dd' — совпадает с log_date в БД, поэтому doneDates строится без конвертаций.
export function toKey(d: Date): string {
	const y = d.getFullYear()
	const m = String(d.getMonth() + 1).padStart(2, '0')
	const day = String(d.getDate()).padStart(2, '0')

	return `${y}-${m}-${day}`
}

function resolveTemporal(
	date: Date,
	key: string,
	ctx: CalendarContext,
): DayTemporal {
	if (key === ctx.todayKey) return 'today'

	// Сравниваем только даты (без учета времени)
	const currentMs = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	).getTime()
	const todayMs = new Date(
		ctx.todayDate.getFullYear(),
		ctx.todayDate.getMonth(),
		ctx.todayDate.getDate(),
	).getTime()

	return currentMs < todayMs ? 'past' : 'future'
}

function makeCell(date: Date, ctx: CalendarContext): DayCell {
	const key = toKey(date)

	return {
		key,
		day: date.getDate(),
		date,
		temporal: resolveTemporal(date, key, ctx),
		done: ctx.doneDates.has(key),
	}
}

export function buildMonth(
	year: number,
	month: number,
	ctx: CalendarContext,
): GridCell[] {
	const weekStartsOn = ctx.weekStartsOn ?? 0

	// Последний день месяца
	const daysInMonth = new Date(year, month + 1, 0).getDate()

	// ИСПРАВЛЕНО: .getDay() вместо .getDate()
	const firstWeekday = new Date(year, month, 1).getDay()

	// Сколько пустых клеток слева до первого числа
	const blanks = (firstWeekday - weekStartsOn + 7) % 7

	const cells: GridCell[] = []

	for (let i = 0; i < blanks; i++) {
		cells.push({ key: `blank-${year}-${month}-${i}`, day: null })
	}

	for (let d = 1; d <= daysInMonth; d++) {
		cells.push(makeCell(new Date(year, month, d), ctx))
	}

	return cells
}

export function buildWeek(anchor: Date, ctx: CalendarContext): DayCell[] {
	const weekStartsOn = ctx.weekStartsOn ?? 0

	// Откатываемся к началу недели
	const offset = (anchor.getDay() - weekStartsOn + 7) % 7
	const start = new Date(anchor)
	start.setDate(anchor.getDate() - offset)

	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(start)
		d.setDate(start.getDate() + i)
		return makeCell(d, ctx)
	})
}

// Стабильные подписи для ru — Intl в Node и в браузере даёт разный регистр (hydration mismatch).
const WEEKDAYS_RU_FROM_MON = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const
const WEEKDAYS_RU_FROM_SUN = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const

// Короткие подписи дней недели. weekStartsOn=1 — неделя с понедельника.
export function weekdayLabels(
	locale = 'ru-RU',
	weekStartsOn: 0 | 1 = 1,
): string[] {
	if (locale.toLowerCase().startsWith('ru')) {
		return weekStartsOn === 1
			? [...WEEKDAYS_RU_FROM_MON]
			: [...WEEKDAYS_RU_FROM_SUN]
	}

	const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })

	// Нормализуем регистр, чтобы SSR и клиент совпадали.
	return Array.from({ length: 7 }, (_, i) => {
		const raw = fmt.format(new Date(2024, 0, 7 + weekStartsOn + i))
		return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
	})
}

// Длина текущей серии: подряд идущие отмеченные дни, заканчивая сегодня.
// Если сегодня ещё не отмечено — серия не рвётся, считаем от вчера. Если и вчера нет — 0.
export function calcStreak(doneDates: Set<string>, today: Date): number {
	const cursor = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	)

	if (!doneDates.has(toKey(cursor))) {
		cursor.setDate(cursor.getDate() - 1)
	}

	let streak = 0
	while (doneDates.has(toKey(cursor))) {
		streak += 1
		cursor.setDate(cursor.getDate() - 1)
	}

	return streak
}

// Заголовок месяца вида 'Июнь 2026' (без 'г.', с заглавной буквы). month 0-индексный.
export function monthLabel(
	year: number,
	month: number,
	locale = 'ru-RU',
): string {
	const name = new Intl.DateTimeFormat(locale, { month: 'long' }).format(
		new Date(year, month, 1),
	)

	return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`
}
