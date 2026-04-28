'use client'
import { useState, useEffect } from 'react'

export const useCurrentTime = () => {
	const [now, setNow] = useState(new Date())

	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 1000)
		return () => clearInterval(timer)
	}, [])

	const weekDayRaw = new Intl.DateTimeFormat('ru-RU', {
		weekday: 'long',
	}).format(now)
	const weekDay = weekDayRaw.charAt(0).toUpperCase() + weekDayRaw.slice(1)
	const time = new Intl.DateTimeFormat('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(now)

	return { weekDay, time }
}
